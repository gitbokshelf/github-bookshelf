// Três novas tentativas automáticas; depois, requer ação explícita do usuário.
export const MAX_QUOTA_RETRIES = 3;
export function quotaRetry(previous: number, now: number) {
  const attempts = previous + 1;
  return { attempts, retryAt: now + Math.min(8800, 2200 * 2 ** (attempts - 1)), automatic: attempts <= MAX_QUOTA_RETRIES };
}
