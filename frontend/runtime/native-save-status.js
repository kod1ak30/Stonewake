/** Correlates UI status with the latest native write, independently of disk order. */
export function createNativeSaveStatus(makeSession = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`) {
  let session = '';
  let sequence = 0;
  let requestId = '';
  let pending = false;
  return {
    begin() {
      if (!session) session = makeSession();
      requestId = `${session}.${++sequence}`;
      pending = true;
      return requestId;
    },
    /** @param {unknown} detail @returns {boolean | null} */
    acknowledge(detail) {
      if (!pending || !detail || typeof detail !== 'object' || !('requestId' in detail) || !('saved' in detail)
        || detail.requestId !== requestId || typeof detail.saved !== 'boolean') return null;
      pending = false;
      return detail.saved;
    },
    /** @param {string} failedRequest */
    failed(failedRequest) {
      if (failedRequest === requestId) pending = false;
    },
  };
}

// A new document gets a new nonce. Late completions from its predecessor cannot
// acknowledge a new kingdom write, even when both documents start at sequence 1.
export const nativeSaveStatus = createNativeSaveStatus();
