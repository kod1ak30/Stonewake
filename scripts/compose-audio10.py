#!/usr/bin/env python3
"""Original Stonewake score and Foley, synthesized from equations and seeded noise.
No recordings, samples, external compositions or downloaded sources are used.
Run with Python + NumPy and ffmpeg. The AAC track is 20 bars at 100 BPM, 48 s.
"""
from pathlib import Path
import json, math, re, subprocess, tempfile, wave
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Stonewake/Web/audio'
WORK=Path(tempfile.gettempdir())/'stonewake-audio10'
WORK.mkdir(exist_ok=True)
RATE=44100
BEAT=.6
LENGTH=48.
N=round(RATE*LENGTH)
rng=np.random.default_rng(100319)
score=np.zeros((N,2),np.float64)

def filter_noise(seconds,low=0,high=5000):
    count=round(seconds*RATE)
    noise=rng.standard_normal(count)
    f=np.fft.rfftfreq(count,1/RATE)
    shape=1/np.sqrt(1+(f/max(high,1))**6)
    if low: shape*=np.sqrt((f/max(low,1))**4/(1+(f/max(low,1))**4))
    value=np.fft.irfft(np.fft.rfft(noise)*shape,n=count)
    return value/(np.std(value)+1e-9)

def add(note,start,gain=1,pan=0):
    # Wrap tails at bar 20 so the exact loop has room decay at its opening.
    index=(np.arange(len(note))+round(start*RATE))%N
    theta=(pan+1)*np.pi/4
    np.add.at(score[:,0],index,note*gain*np.cos(theta))
    np.add.at(score[:,1],index,note*gain*np.sin(theta))

def pitch(midi):return 440*2**((midi-69)/12)

def envelope(t,attack,hold,release):
    return (1-np.exp(-t/max(attack,.001))) * np.where(t<=hold,1,np.exp(-(t-hold)/release)) * np.minimum(1,np.maximum(0,(t[-1]-t)/.015))

def strings(midi,duration,short=False):
    t=np.arange(round((duration+(.24 if short else .6))*RATE))/RATE
    freq=pitch(midi);value=np.zeros_like(t)
    # Independent bow ensembles: detuning, slow vibrato and inharmonic bow air.
    for detune,phase in [(-.0035,.2),(.001,.9),(.0041,2.1)]:
        angle=2*np.pi*freq*(1+detune)*t+.012*np.sin(2*np.pi*5.1*t+phase)
        voice=np.zeros_like(t)
        for k in range(1,min(25,int(11000/freq))):
            body=1+.8*np.exp(-((freq*k-900)/550)**2)
            voice+=np.sin(k*angle+phase*.06)*body/(k**1.4)
        value+=voice/3
    value+=filter_noise(len(t)/RATE,600,5500)*.035
    bow=envelope(t,.018 if short else .12,duration,.07 if short else .19)
    if short:bow*=np.exp(-t/1.1)
    return value*bow

def brass(midi,duration):
    t=np.arange(round((duration+.38)*RATE))/RATE;f=pitch(midi)
    value=np.zeros_like(t)
    bloom=1-np.exp(-t/.13)
    for detune in [-.0018,.0026]:
        angle=2*np.pi*f*(1+detune)*t+.012*np.sin(2*np.pi*4.7*t)
        for k in range(1,17):
            # Harmonics bloom after the breath attack instead of a square-wave buzz.
            value+=np.sin(k*angle)/(k**1.35)*(.25+.75*bloom**(k/5))/2
    return value*envelope(t,.045,duration,.13)

def drum(heavy=False):
    seconds=1.2 if heavy else .7;t=np.arange(round(seconds*RATE))/RATE
    f=(42 if heavy else 75)+(90 if heavy else 72)*np.exp(-t/.018)
    phase=2*np.pi*np.cumsum(f)/RATE
    body=np.sin(phase)*np.exp(-t/(.34 if heavy else .19))
    skin=.3*np.sin(phase*1.61+.4)*np.exp(-t/.075)
    air=filter_noise(seconds,35,1300)*np.exp(-t/.09)*.3
    click=filter_noise(seconds,600,4500)*np.exp(-t/.009)*.12
    return np.tanh((body+skin+air+click)*1.25)*np.minimum(1,t/.0015)

def brush(seconds=.3):
    t=np.arange(round(seconds*RATE))/RATE
    return filter_noise(seconds,2200,8500)*np.exp(-t/.06)*np.minimum(1,t/.003)

# Twenty bars in D minor, with dominant A-major tension returning to the opening D.
chords=[(38,'m'),(38,'m'),(34,'M'),(34,'M'),(31,'m'),(31,'m'),(33,'M'),(38,'m'),
        (34,'M'),(36,'M'),(38,'m'),(33,'M'),(38,'m'),(34,'M'),(31,'m'),(33,'M'),
        (38,'m'),(31,'m'),(33,'M'),(33,'M')]
for bar,(root,quality) in enumerate(chords):
    start=bar*4*BEAT;third=3 if quality=='m' else 4
    strength=.8 if bar<4 else 1 if bar<12 else 1.15 if bar<18 else .95
    # Cello ostinato, quieter alternating violas, and bowed bass on the downbeats.
    pattern=[0,7,third,7,0,12,7,third]
    if bar%4==3:pattern=[0,7,12,7,third,7,12,7]
    for i,interval in enumerate(pattern):
        jitter=rng.uniform(-.004,.004)
        add(strings(root+12+interval,.205,True),start+i*BEAT/2+jitter,.053*strength*(1 if i%2==0 else .74),-.36)
        if bar>=4:add(strings(root+24+pattern[(i+2)%8],.12,True),start+i*BEAT/2+.15,.015*strength,.42)
    for beat in [0,2]:add(strings(root,.76,True),start+beat*BEAT,.069,-.05)
    for interval,pan in [(0,-.65),(third,.05),(7,.65)]:
        add(strings(root+24+interval,2.27),start,.0135*strength,pan)
    # Large drum accents and answering toms; the final bars roll into the restart.
    for beat,gain in [(0,.16),(1.5,.058),(2,.13),(3.25,.045)]:add(drum(beat in [0,2]),start+beat*BEAT,gain*strength,-.1 if beat==0 else .14)
    for beat in [.5,1,2.5,3]:add(drum(False),start+beat*BEAT,.031*strength,(-1 if beat%1 else 1)*.45)
    for beat in [1,3]:add(brush(),start+beat*BEAT,.016,.6)
    if bar%4==3:
        for i in range(4):add(drum(False),start+(3+i/4)*BEAT,.029+i*.006,(-.6+i*.35))
    # Four-bar brass sentences, with a higher reply at the midpoint and final rise.
    if bar%4 in [0,2]:
        melody=[(0,7,.8),(1.5,third,.65),(2.75,0,.95)] if bar%4==0 else [(0,third,.7),(1.5,7,.7),(2.75,12,.85)]
        for beat,interval,dur in melody:add(brass(root+24+interval,dur),start+beat*BEAT,.018 if bar<8 else .024,.18)
    if bar in [7,11,15,19]:
        t=np.arange(round(1.6*RATE))/RATE
        swell=filter_noise(1.6,1700,8500)*np.sin(np.pi*t/1.6)**2
        add(swell,start+1.0,.010,-.65)

# Circular, decorrelated early reflections and a restrained dark hall tail.
dry=score.copy()
for delay,gain,cross in [(.031,.16,False),(.059,.11,True),(.109,.09,True),(.193,.065,False),(.307,.05,True),(.463,.03,False),(.719,.018,True)]:
    reflected=np.roll(dry,round(delay*RATE),axis=0)
    score+=reflected[:,::-1] * gain if cross else reflected*gain
# Gentle saturation catches summing peaks without hard clipping.
score=np.tanh(score*.92)/.92
score-=score.mean(axis=0)

def write_wav(path,a):
    if a.ndim==1:a=a[:,None]
    with wave.open(str(path),'wb') as w:
        w.setnchannels(a.shape[1]);w.setsampwidth(2);w.setframerate(RATE)
        w.writeframes(np.round(np.clip(a,-.9999,.9999)*32767).astype('<i2').tobytes())

def measure(path):
    done=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',str(path),'-af','ebur128=peak=true','-f','null','-'],capture_output=True,text=True,check=True)
    summary=done.stderr.rsplit('Summary:',1)[-1]
    return {'integrated_lufs':float(re.search(r'I:\s+(-?[\d.]+) LUFS',summary)[1]),'true_peak_dbfs':float(re.search(r'Peak:\s+(-?[\d.]+) dBFS',summary)[1])}

raw=WORK/'battle-raw.wav';write_wav(raw,score)
stats=measure(raw);gain=min(-22-stats['integrated_lufs'],-5-stats['true_peak_dbfs'])
score*=10**(gain/20)
master=WORK/'battle-master.wav';write_wav(master,score)
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(master),'-c:a','aac','-b:a','192k','-movflags','+faststart',str(OUT/'battle.m4a')],check=True)

def boom(seconds=1.1):
    t=np.arange(round(seconds*RATE))/RATE
    phase=2*np.pi*np.cumsum(38+65*np.exp(-t/.02))/RATE
    value=np.sin(phase)*np.exp(-t/.23)*.64
    value+=filter_noise(seconds,30,1800)*np.exp(-t/.115)*.4
    value+=filter_noise(seconds,1200,9000)*np.exp(-t/.015)*.27
    return np.tanh(value*1.25)*np.minimum(1,t/.0007)

def timber(seconds=.8):
    t=np.arange(round(seconds*RATE))/RATE
    value=filter_noise(seconds,180,3500)*np.exp(-t/.14)*.25
    for start,scale in [(0,.55),(.045,.35),(.13,.24),(.27,.14),(.41,.08)]:
        tt=np.maximum(0,t-start);gate=t>=start
        crack=filter_noise(seconds,350,6500)*np.exp(-tt/.016)*gate
        body=(np.sin(2*np.pi*215*tt)+.4*np.sin(2*np.pi*397*tt))*np.exp(-tt/.049)*gate
        value+=scale*(crack*.65+body*.25)
    return value*np.minimum(1,t/.0007)

def splash(seconds=1.3):
    t=np.arange(round(seconds*RATE))/RATE
    value=filter_noise(seconds,220,6800)*(1-np.exp(-t/.013))*np.exp(-t/.24)*.65
    value+=filter_noise(seconds,50,620)*np.exp(-t/.18)*.35
    for delay in [.09,.17,.29,.43,.58,.74]:
        tt=np.maximum(0,t-delay);gate=t>=delay;freq=250+rng.uniform(0,400)
        value+=np.sin(2*np.pi*(freq*tt-80*tt**2))*np.exp(-tt/.045)*gate*.045
    return value*np.minimum(1,t/.001)

def extend(a,n):return np.pad(a,(0,max(0,n-len(a))))[:n]
def finish_effect(name,a,peak=-5.5):
    a=a-np.mean(a);a*=min(1,10**(peak/20)/(np.max(np.abs(a))+1e-9))
    fade=min(round(.025*RATE),len(a));a[-fade:]*=np.linspace(1,0,fade);a[:35]*=np.linspace(0,1,35)
    write_wav(OUT/name,a)

finish_effect('naval-fire.wav',boom(1.2))
n=round(1.5*RATE);impact=extend(boom(.95),n)*.65+extend(timber(1.1),n)*.5
impact+=np.roll(extend(splash(1.2),n),round(.055*RATE))*.34
finish_effect('naval-impact.wav',impact)
n=round(1.9*RATE);collapse=extend(boom(1.6),n)*.6+extend(timber(1.75),n)*.62
for delay,scale in [(.22,.27),(.48,.18),(.83,.1)]:collapse+=np.roll(extend(timber(.8),n),round(delay*RATE))*scale
finish_effect('building-destroy.wav',collapse)
finish_effect('wood-break.wav',timber(.85),-7)
finish_effect('water-splash.wav',splash(1.4),-7)

# AAC is packetized. Check the decoded intended duration and seam, not padded encoder frames.
decoded=WORK/'battle-decoded.wav'
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(OUT/'battle.m4a'),'-t',str(LENGTH),str(decoded)],check=True)
with wave.open(str(decoded),'rb') as w:
    pcm=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').reshape(-1,2).astype(float)/32768
loop_jump=float(np.max(np.abs(pcm[0]-pcm[-1])))
ordinary_step=float(np.quantile(np.abs(np.diff(pcm,axis=0)),.999))
report={'composition':{'bpm':100,'bars':20,'meter':'4/4','key':'D minor, dominant A major','duration_seconds':48,'seed':100319},'battle.m4a':measure(OUT/'battle.m4a'),'loop':{'decoded_frames':len(pcm),'expected_frames':N,'boundary_step':loop_jump,'normal_99_9_percentile_step':ordinary_step,'sample_peak':float(np.max(np.abs(pcm))),'head_tail_rms_ratio':float(np.sqrt(np.mean(pcm[:4410]**2))/np.sqrt(np.mean(pcm[-4410:]**2))),'clipped_samples':int(np.count_nonzero(np.abs(pcm)>=.999))},'effects':{}}
for name in ['naval-fire.wav','naval-impact.wav','building-destroy.wav','wood-break.wav','water-splash.wav']:
    with wave.open(str(OUT/name),'rb') as w:
        samples=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(float)/32768
        report['effects'][name]={'duration_seconds':len(samples)/RATE,'sample_peak_dbfs':float(20*np.log10(np.max(np.abs(samples)))),'clipped_samples':int(np.count_nonzero(np.abs(samples)>=.999)),'first_sample':float(samples[0]),'last_sample':float(samples[-1])}
(OUT/'audio10-analysis.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
