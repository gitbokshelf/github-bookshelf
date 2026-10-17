import test from 'node:test';
import assert from 'node:assert/strict';
import {notificationKind, readState, stateAfterNotification} from '../tools/monitor-policy.mjs';
const now=100000000;
test('avisa falha, limita repetição e avisa recuperação uma única vez', () => {
  const initial=readState(null);
  assert.equal(notificationKind(true,initial,now),null);
  assert.equal(notificationKind(false,initial,now),'failure');
  const incident=stateAfterNotification(initial,'failure',now);
  assert.equal(notificationKind(false,incident,now+1000),null);
  assert.equal(notificationKind(false,incident,now+21600000),'reminder');
  assert.equal(notificationKind(true,incident,now+2000),'recovery');
  const recovered=stateAfterNotification(incident,'recovery',now+2000);
  assert.equal(notificationKind(true,recovered,now+3000),null);
});
test('teste de entrega não consome o aviso de um incidente real', () => {
  const state={incident:true,notifiedAt:now};
  assert.equal(notificationKind(true,state,now,true),'test');
  assert.deepEqual(stateAfterNotification(state,'test',now+1000),state);
  assert.deepEqual(readState({incident:'true',notifiedAt:'secret',extra:'discard'}),{incident:false,notifiedAt:0});
});
