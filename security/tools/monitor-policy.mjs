// Política pura: nenhum dado de usuário é incluído no estado ou nos avisos.
export function notificationKind(healthy, state, now, test = false) {
  if (test) return 'test';
  if (healthy) return state.incident ? 'recovery' : null;
  if (!state.incident) return 'failure';
  return now - state.notifiedAt >= 6 * 60 * 60 * 1000 ? 'reminder' : null;
}
export function readState(value) {
  return { incident: value?.incident === true, notifiedAt: Number.isFinite(value?.notifiedAt) && value.notifiedAt > 0 ? value.notifiedAt : 0 };
}
export function stateAfterNotification(state, kind, now) {
  if (!kind || kind === 'test') return state;
  return { incident: kind !== 'recovery', notifiedAt: now };
}
export function safeContentPolicy(value) {
  const directives=new Map();
  for(const part of value.split(';')) {
    const [name,...sources]=part.trim().split(/\s+/);
    if(!name) continue;
    if(directives.has(name)) return false;
    directives.set(name,sources);
  }
  const only=(name, expected)=>{
    const sources=directives.get(name);
    return Array.isArray(sources) && sources.length===expected.length && expected.every(source=>sources.some(actual=>actual===source));
  };
  return only('object-src',["'none'"]) && only('frame-ancestors',["'none'"]) && only('script-src',["'self'",'https://challenges.cloudflare.com']) && only('frame-src',['https://challenges.cloudflare.com']) && only('connect-src',["'self'",'https://dxnfhzgxdkhdggqoogft.supabase.co']);
}
