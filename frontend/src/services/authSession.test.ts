import { describe, expect, it } from 'vitest';

import { clearStoredAuthTokens } from './authSession.ts';

describe('clearStoredAuthTokens', () => {
  it('removes all known auth keys from storage', () => {
    const removedKeys: string[] = [];
    const storage = {
      removeItem: (key: string) => {
        removedKeys.push(key);
      },
    };

    clearStoredAuthTokens(storage);

    expect(removedKeys).toEqual(['access_token', 'refresh_token', 'token']);
  });
});
