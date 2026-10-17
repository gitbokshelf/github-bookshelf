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
