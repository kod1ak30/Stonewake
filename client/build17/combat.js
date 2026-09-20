// Presentation and pointer intent only. These helpers never alter battle rules.
export const SWDeploymentCadence17 = Object.freeze({hold: 180, repeat: 115, slop: 9, leaveRail: 20});

export function SWCreateDeploymentGesture17({getSurface, now, schedule, unschedule, points = new Map()}) {
  let session = null, blocked = false;
  const current = g => {
    const surface = getSurface();
    return surface && (surface.token || surface) === g.token && surface.active(g.kind) ? surface : null;
  };
  function cancel() {
    const previous = session; session = null;
    if (!previous) return;
    unschedule(previous.timer); previous.cancelled = true; previous.surface.preview(null);
    try { if (previous.element?.hasPointerCapture?.(previous.pointer)) previous.element.releasePointerCapture(previous.pointer); } catch { /* Surface may have unmounted. */ }
  }
  function fire(g = session) {
    if (!g || g !== session || blocked || points.size !== 1 || g.exhausted) return false;
    const surface = current(g);
    if (!surface) { cancel(); return false; }
    const target = surface.target(g.x, g.y, g.kind); g.target = target;
    surface.preview(target, {x: g.x, y: g.y, kind: g.kind, origin: g.origin});
    if (!target) return false;
    const accepted = surface.fire(target, g.kind) === true;
    if (accepted) { g.started = true; g.lastTime = now(); }
    else { g.exhausted = true; unschedule(g.timer); surface.rejected?.(target, g.kind); }
    return accepted;
  }
  function repeat(g) {
    if (g !== session || g.exhausted || blocked) return;
    // A delayed main thread produces one command, never a catch-up burst.
    g.timer = schedule(() => { if (g !== session) return; fire(g); repeat(g); }, SWDeploymentCadence17.repeat);
  }
  function start(g) {
    unschedule(g.timer);
    fire(g);
    if (!g.exhausted && g === session) repeat(g);
  }
  function pointerDown(event) {
    const surface = getSurface();
    points.set(event.pointerId, {x: event.clientX, y: event.clientY, scoped: !!surface?.contains?.(event.clientX, event.clientY)});
    if (points.size > 1) {
      blocked = true; cancel();
      if ([...points.values()].every(point => point.scoped)) surface?.pinch?.([...points.values()]);
    }
  }
  function begin(event, kind, origin = 'map') {
    const surface = getSurface();
    if (!surface?.active(kind) || blocked || points.size > 1 || (event.pointerType === 'mouse' && event.button !== 0)) return false;
    if (!points.has(event.pointerId)) pointerDown(event);
    const target = surface.target(event.clientX, event.clientY, kind);
    if (origin === 'map' && !target) return false;
    cancel();
    event.preventDefault();
    try { event.currentTarget?.setPointerCapture?.(event.pointerId); } catch { /* Global listeners retain the pointer. */ }
    const rail = origin === 'tray' ? event.currentTarget?.closest?.('.sw-deploy-strip14') : null;
    session = {surface, token: surface.token || surface, element: event.currentTarget, pointer: event.pointerId,
      kind, origin, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY,
      target, recognized: origin === 'map', started: false, moved: false, scrolling: false,
      cancelled: false, exhausted: false, lastTime: -Infinity, began: now(), rail, scroll: rail?.scrollLeft || 0};
    const g = session;
    surface.preview(target, {x: g.x, y: g.y, kind, origin});
    if (origin === 'map') g.timer = schedule(() => start(g), SWDeploymentCadence17.hold);
    return true;
  }
  function pointerMove(event) {
    const point = points.get(event.pointerId);
    if (point) { point.x = event.clientX; point.y = event.clientY; }
    if (points.size > 1) {
      if ([...points.values()].every(value => value.scoped)) getSurface()?.pinch?.([...points.values()]);
      return;
    }
    const g = session;
    if (!g || g.pointer !== event.pointerId || blocked || g.exhausted) return;
    const surface = current(g); if (!surface) { cancel(); return; }
    g.x = event.clientX; g.y = event.clientY;
    const dx = g.x - g.startX, dy = g.y - g.startY;
    if (g.origin === 'tray' && !g.recognized) {
      const bounds = g.rail?.getBoundingClientRect?.();
      const canScroll = g.rail && g.rail.scrollWidth > g.rail.clientWidth + 4;
      const outside = !bounds || g.y < bounds.top - 4 || g.y > bounds.bottom + 4;
      if (!g.scrolling && outside && Math.abs(dy) >= SWDeploymentCadence17.leaveRail) g.recognized = true;
      else {
        if (canScroll && Math.abs(dx) > SWDeploymentCadence17.slop && Math.abs(dx) > Math.abs(dy) * 1.35) g.scrolling = true;
        if (g.scrolling && g.rail) g.rail.scrollLeft = g.scroll - dx;
        return;
      }
    }
    if (Math.hypot(dx, dy) > SWDeploymentCadence17.slop) g.moved = true;
    const target = surface.target(g.x, g.y, g.kind); g.target = target;
    surface.preview(target, {x: g.x, y: g.y, kind: g.kind, origin: g.origin});
    if (target && !g.started && (g.origin === 'tray' || g.moved)) start(g);
  }
  function pointerUp(event, cancelled = false) {
    // A platform may coalesce a short drag into its final release position.
    // Resolve that position through the same intent rules before committing.
    // An already recognized rail scroll or cancelled gesture stays cancelled.
    if (!cancelled && !blocked && session?.pointer === event.pointerId) pointerMove(event);
    const g = session;
    // Commit before removing the final pointer; a short tap produces one order.
    if (g?.pointer === event.pointerId) {
      g.x = event.clientX; g.y = event.clientY;
      if (!cancelled && !blocked && !g.started && !g.exhausted && (g.origin === 'map' || g.recognized)) fire(g);
      cancel();
    }
    points.delete(event.pointerId);
    getSurface()?.endPinch?.([...points]);
    if (!points.size) blocked = false;
  }
  function lostCapture(event) {
    // A touch can implicitly capture the portrait inside a troop card before
    // begin() transfers capture to the card. Losing that child's capture is not
    // losing our gesture; only the element we explicitly captured owns it.
    if (session?.pointer === event.pointerId && event.target === session.element) { blocked = true; cancel(); }
  }
  function reset() { cancel(); points.clear(); blocked = false; getSurface()?.endPinch?.([]); }
  return {points, get session() { return session; }, pointerDown, begin, pointerMove, pointerUp, lostCapture, fire, cancel, reset};
}

export function SWLandingCarrier17(input, frame, kind, target, preferredId) {
  if (input?.campaignType !== 'sea' || !target) return null;
  const orders = input.orders || [];
  if (kind === 'hero' && (!input.commander || orders.some(order => order.kind === 'hero'))) return null;
  const candidates = (input.fleet14 || []).flatMap(ship => {
    const live = frame?.units?.find(unit => unit.side === 'attack' && unit.shipId === ship.id);
    if (live && (live.hp <= 0 || live.command?.type === 'withdraw')) return [];
    const remaining = kind === 'hero' ? 1 : (ship.cargo?.[kind] || 0) - orders.filter(order => order.kind === kind && order.shipId === ship.id).length;
    if (remaining <= 0) return [];
    return [{shipId: ship.id, kind: ship.kind, remaining, x: live?.x ?? -9, y: live?.y ?? 2,
      distance: Math.hypot((live?.x ?? -9) - target.x, (live?.y ?? 2) - target.y)}];
  });
  return candidates.find(ship => ship.shipId === preferredId) || candidates.sort((a, b) => a.distance - b.distance || a.shipId.localeCompare(b.shipId))[0] || null;
}

export function SWNavalCommandTarget17(frame, tile, type) {
  if (!tile || !Number.isFinite(tile.x) || !Number.isFinite(tile.y)) return null;
  if (type === 'focus') {
    const target = (frame?.units || []).filter(unit => unit.side === 'defend' && unit.hp > 0 && Math.hypot(unit.x - tile.x, unit.y - tile.y) < 1.5)
      .sort((a, b) => Math.hypot(a.x - tile.x, a.y - tile.y) - Math.hypot(b.x - tile.x, b.y - tile.y) || a.id.localeCompare(b.id))[0];
    return target ? {x: target.x, y: target.y, targetId: target.id, valid: true, label: target.naval ? 'Focus this ship' : 'Focus this defense'} : null;
  }
  if (type !== 'move' || tile.x > -2.4 || tile.x < -12 || tile.y < -2 || tile.y > 11 || (tile.x > -6.7 && tile.x < -5.7 && tile.y > 3.05 && tile.y < 5.85)) return null;
  return {x: tile.x, y: tile.y, valid: true, label: 'Sail here'};
}

export function SWShotPose17(shot, time, kind) {
  if (!shot || !Number.isFinite(time)) return null;
  const ranged = ['archer', 'crossbow', 'cannon', 'trebuchet', 'grenadier', 'bombard', 'galley', 'naval'].includes(kind);
  const heavy = ['cannon', 'trebuchet', 'ram', 'bombard', 'naval'].includes(kind);
  const contact = ranged ? shot.firedAt : shot.impactAt;
  if (!Number.isFinite(contact)) return null;
  const windup = heavy ? .24 : .16, recovery = heavy ? .32 : .22, elapsed = time - contact;
  if (elapsed < -windup || elapsed > recovery) return null;
  const phase = elapsed < 0 ? Math.max(0, (elapsed + windup) / windup) * .5 : .5 + Math.min(1, elapsed / recovery) * .5;
  const recoil = elapsed < 0 ? 0 : Math.sin(Math.min(1, elapsed / recovery) * Math.PI) * (heavy ? 3.2 : ranged ? .8 : 1.5);
  return {phase, recoil, stage: elapsed < 0 ? 'windup' : elapsed < .06 ? 'contact' : 'recover', heavy, ranged};
}

export function SWContactMotion17(event, time, reduced = false) {
  if (!event || reduced || !Number.isFinite(event.time) || time < event.time || time - event.time > .22) return {x: 0, y: 0, angle: 0};
  const elapsed = (time - event.time) / .22, strength = Math.sin(elapsed * Math.PI) * (1 - elapsed);
  const dx = (event.tx ?? event.x) - event.x, dy = (event.ty ?? event.y) - event.y;
  const screenX = dx - dy, screenY = (dx + dy) * .5, length = Math.hypot(screenX, screenY) || 1;
  return {x: screenX / length * strength * 3.2, y: screenY / length * strength * 1.4, angle: strength * .018 * Math.sign(screenX || 1)};
}
