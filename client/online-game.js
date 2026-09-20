// Server commands are serialized; local previews never become authoritative saves.
(function () {
  const copy = value => JSON.parse(JSON.stringify(value));
  const requestId = () => {
    if(typeof crypto.randomUUID==='function')return crypto.randomUUID();
    const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
    return [...bytes].map((byte,index)=>([4,6,8,10].includes(index)?'-':'')+byte.toString(16).padStart(2,'0')).join('');
  };
  const uncertain = error => !['invalid_order','already_used','command_conflict','battle_complete','no_battle'].includes(error.code);
  function preview(input, jobs, now) {
    const result = copy(input);
    for (const job of jobs) for (const command of job.commands) {
      const time = Math.min(119.5, Math.max(result.orders?.at(-1)?.time || 0, Math.ceil(now * 2) / 2));
      if (command.type === 'deploy') (result.orders ||= []).push({kind:command.kind,x:command.x,y:command.y,time});
      else if (command.type === 'rally') result.rallyAt = time;
      else if (command.type === 'ability') result.heroAt = time;
    }
    return result;
  }
  function battleQueue({battle,serverTime,onInput,onError,onState,request=window.SWOnline.request}) {
    let base = copy(battle.input), sequence = battle.commandSeq || 0, offset = (serverTime || Date.now()) - Date.now();
    let jobs = [], active = null, timer = null, failure = null, stopped = false;
    const elapsed = () => Math.max(0,(Date.now()+offset-battle.createdAt)/1000);
    const emit = () => { if (!stopped) onInput(preview(base,jobs,elapsed())); };
    async function drain() {
      if (active) return active;
      if (timer) { clearTimeout(timer); timer=null; }
      failure = null;
      active = (async()=>{
        while (jobs.length && !stopped) {
          const job=jobs[0];job.sequence ??= sequence;
          try {
            const result=await request('/v1/battles/commands',{method:'POST',body:{requestId:job.id,battleId:battle.id,commandSeq:job.sequence,commands:job.commands}});
            if(stopped)return;
            offset=Math.max(offset,result.serverTime-Date.now());base=copy(result.input);sequence=result.commandSeq;jobs.shift();emit();
          } catch(error) {
            if(stopped)return;
            if(!uncertain(error)) {
              // A rejected atomic batch applied nothing. Rebase the remaining previews.
              let game;try{game=await request('/v1/game')}catch(syncError){failure=syncError;onError?.(syncError);throw syncError;}onState?.(game);
              if(game.battle?.id===battle.id){base=copy(game.battle.input);sequence=game.battle.commandSeq;offset=Math.max(offset,game.serverTime-Date.now());}
              jobs.shift();for(const pending of jobs)delete pending.sequence;emit();
            }
            failure=error;onError?.(error);throw error;
          }
        }
      })().finally(()=>{active=null});
      return active;
    }
    return {
      elapsed, get pending(){return jobs.reduce((n,job)=>n+job.commands.length,0)}, get error(){return failure},
      enqueue(command) {
        if(stopped||failure)return false;
        const last=jobs.at(-1);
        if(last&&last.sequence===undefined&&last.commands.length<20)last.commands.push(copy(command));
        else jobs.push({id:requestId(),commands:[copy(command)]});
        emit();if(!active&&!timer)timer=setTimeout(()=>{timer=null;drain().catch(()=>{})},45);
        return true;
      },
      flush:drain,
      stop(){stopped=true;if(timer)clearTimeout(timer);jobs=[]},
    };
  }
  window.SWOnlineGame={requestId,battleQueue};
})();
