import test from 'node:test';
import assert from 'node:assert/strict';
import {quotaRetry} from '../../frontend/src/utils/sync-quota.ts';
test('quota preserva espaçamento crescente e encerra repetição automática', () => {
  let state={attempts:0};
  for (const [delay, automatic] of [[2200,true],[4400,true],[8800,true],[8800,false],[8800,false]]) {
    state=quotaRetry(state.attempts,1000);
    assert.equal(state.retryAt,1000+delay);
    assert.equal(state.automatic,automatic);
  }
});
