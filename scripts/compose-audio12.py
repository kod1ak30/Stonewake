#!/usr/bin/env python3
"""Original Scout, Victory and battle-percussion compositions. No source audio.
Reuse only oscillator/instrument functions from our Build 10 composition script.
"""
import ast, json, math, subprocess, tempfile, wave
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Stonewake/Web/audio'
WORK=Path(tempfile.gettempdir())/'stonewake-audio12'
WORK.mkdir(exist_ok=True)
RATE=44100
tree=ast.parse((ROOT/'scripts/compose-audio10.py').read_text())
shared=ast.Module(body=[n for n in tree.body if isinstance(n,(ast.Import,ast.ImportFrom,ast.FunctionDef))],type_ignores=[])
ns={'__file__':str(ROOT/'scripts/compose-audio10.py'),'RATE':RATE,'OUT':OUT,'rng':np.random.default_rng(120319)}
exec(compile(shared,'original-instruments','exec'),ns)
report={'provenance':'Original equations, seeded noise and melodies; no sampled or downloaded recordings.','subjective_audition':'Not verified on physical speakers or headphones.'}

def compose(name,duration,bpm,target,loop,program):
    n=round(duration*RATE);ns.update(N=n,score=np.zeros((n,2)),rng=np.random.default_rng(120319))
    program(60/bpm)
    score=ns['score'];dry=score.copy()
    for delay,gain in [(.043,.15),(.107,.1),(.239,.055),(.481,.035),(.719,.02)]:
        reflection=np.roll(dry,round(delay*RATE),axis=0)
        if not loop:reflection[:round(delay*RATE)]=0
        score+=reflection[:,::-1]*gain
    score=np.tanh(score);score-=score.mean(axis=0)
    if not loop:
        score[:round(.04*RATE)]*=np.linspace(0,1,round(.04*RATE))[:,None]
        score[-round(1.2*RATE):]*=np.linspace(1,0,round(1.2*RATE))[:,None]
    raw=WORK/(name+'-raw.wav');ns['write_wav'](raw,score);stats=ns['measure'](raw)
    score*=10**(min(target-stats['integrated_lufs'],-6-stats['true_peak_dbfs'])/20)
    master=WORK/(name+'-master.wav');ns['write_wav'](master,score)
    output=OUT/(name+'.m4a')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(master),'-c:a','aac','-b:a','192k','-movflags','+faststart',str(output)],check=True)
    decoded=WORK/(name+'-decoded.wav');subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(output),'-t',str(duration),str(decoded)],check=True)
    with wave.open(str(decoded),'rb') as w:pcm=np.frombuffer(w.readframes(w.getnframes()),'<i2').reshape(-1,2).astype(float)/32768
    report[name+'.m4a']={**ns['measure'](output),'duration_seconds':duration,'bpm':bpm,'loop':loop,'clipped_samples':int(np.count_nonzero(np.abs(pcm)>=.999)),'boundary_step':float(np.max(np.abs(pcm[0]-pcm[-1]))),'ordinary_99_9_percentile_step':float(np.quantile(np.abs(np.diff(pcm,axis=0)),.999))}

def scout(beat):
    add=ns['add'];strings=ns['strings']
    # Sixteen bars: restrained D-minor modal exploration, with answering phrases.
    roots=[38,38,34,34,41,41,36,33,38,34,31,33,38,41,33,33]
    melody=[0,7,10,7,3,5,7,3,0,3,5,7,10,7,3,2]
    for bar,root in enumerate(roots):
        third=3 if root in [38,31] else 4
        for interval,pan in [(0,-.45),(7,.4),(third,.05)]:add(strings(root+12+interval,beat*3.7),bar*4*beat,.024 if interval else .033,pan)
        for j in range(4):
            note=root+24+[0,7,12,third+12][j]
            t=np.arange(round(beat*1.5*RATE))/RATE
            pluck=(np.sin(2*np.pi*ns['pitch'](note)*t)+.24*np.sin(4*np.pi*ns['pitch'](note)*t))*np.exp(-t/.28)*(1-np.exp(-t/.008))
            add(pluck,(bar*4+j+.5)*beat,.04,(-.4 if j%2 else .4))
        if bar%2==0:
            pitch=ns['pitch'](62+melody[bar]);t=np.arange(round(beat*3*RATE))/RATE
            air=(np.sin(2*np.pi*pitch*t+.012*np.sin(2*np.pi*4.7*t))+.18*np.sin(4*np.pi*pitch*t))*ns['envelope'](t,.13,beat*2,.24)
            add(air,(bar*4+.5)*beat,.025,.1)
        add(ns['drum'](True),bar*4*beat,.035,-.05)

def victory(beat):
    add=ns['add'];strings=ns['strings'];brass=ns['brass']
    for bar,(root,third) in enumerate([(38,3),(34,4),(33,4),(38,4)]):
        for i,pan in [(0,-.5),(third,0),(7,.5)]:add(strings(root+24+i,beat*3.3),bar*4*beat,.027,pan)
        for note,start,dur in [(root+24,0,1),(root+31,1.5,.8),(root+36,2.75,1)]:add(brass(note,beat*dur),(bar*4+start)*beat,.021,.1)
        add(ns['drum'](True),bar*4*beat,.075,-.1)

def pulse(beat):
    add=ns['add']
    # Matches the existing battle score exactly: 100 BPM, twenty 4/4 bars, 48 s.
    for bar in range(20):
        for at,gain in [(0,.055),(1.5,.025),(2,.045),(3.5,.024)]:add(ns['drum'](at%2==0),(bar*4+at)*beat,gain,(-.3 if at<2 else .3))
        if bar%4==3:
            for j in range(4):add(ns['brush'](.24),(bar*4+3+j/4)*beat,.01+j*.001,.5)

compose('scout',64*60/90,90,-25,True,scout)
compose('victory',16*60/108+1.3,108,-25,False,victory)
compose('battle-pulse',48,100,-30,True,pulse)
(OUT/'audio12-analysis.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
