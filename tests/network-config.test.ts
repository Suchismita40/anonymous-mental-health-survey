import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveNetwork, NETWORK_CONFIGS } from '../src/network.js';

describe('Network Configuration & Endpoints', () => {
  it('defaults to undeployed network configuration when no flags passed', () => {
    const res = resolveNetwork({ argv: ['node', 'script.js'] });
    assert.equal(res.network, 'undeployed');
    assert.equal(res.config.node, 'ws://127.0.0.1:9944');
    assert.equal(res.config.indexer, 'http://127.0.0.1:8088/api/v4/graphql');
    assert.equal(res.config.proofServer, 'http://127.0.0.1:6300');
  });

  it('correctly resolves network from --network flag', () => {
    const res = resolveNetwork({ argv: ['node', 'script.js', '--network', 'preview'] });
    assert.equal(res.network, 'preview');
    assert.equal(res.config.faucet, 'https://midnight-tmnight-preview.nethermind.dev');
  });

  it('contains valid configuration entries for all supported networks', () => {
    assert.ok(NETWORK_CONFIGS.undeployed);
    assert.ok(NETWORK_CONFIGS.preview);
    assert.ok(NETWORK_CONFIGS.preprod);
  });
});
