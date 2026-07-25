import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

export function formatTruncatedAddress(address: string | null): string {
  if (!address) return 'Not Connected';
  if (address.length < 18) return address;
  return `${address.slice(0, 12)}...${address.slice(-6)}`;
}

describe('Survey Formatting & Helper Functions', () => {
  it('truncates Bech32 Midnight wallet address for navbar display', () => {
    const full = 'mn_addr_undeployed1h3ssm5ru2t6eqy4g3she78zlxn96e36ms6pq996aduvmateh9p9sk96u7s';
    const truncated = formatTruncatedAddress(full);
    assert.equal(truncated, 'mn_addr_unde...k96u7s');
    assert.equal(formatTruncatedAddress(null), 'Not Connected');
  });
});
