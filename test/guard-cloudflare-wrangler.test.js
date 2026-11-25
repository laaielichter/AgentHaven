'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('guard: Wrangler OAuth access tokens are removed before shared-memory writes', () => {
  for (const n of [24, 32, 48, 128]) {
    const token = 'cfoat_' + 'Ab3x'.repeat(n / 4);
    for (const value of [token, 'Wrangler OAuth token: ' + token + ' rotate']) {
      const scanned = inspect(value);
      assert.deepEqual(scanned.secrets, ['Cloudflare Wrangler OAuth token']);
      assert.equal(scanned.text, value.replace(token, '[Cloudflare Wrangler OAuth token removed]'));
      assert.deepEqual(inspect(scanned.text).secrets, []);
    }
  }
});

test('guard: Wrangler rule preserves non-tokens and avoids partial redaction', () => {
  const token = 'cfoat_' + 'Ab3x'.repeat(10);
  for (const value of [
    'cfoat_', 'cfoat_' + 'A'.repeat(23),
    'cfoat-' + 'A'.repeat(40),
    'prefix_' + token,
    'not' + token,
    'OAuth token prefix cfoat_ is private',
    'Cloudflare user tokens start cfut_, not cfoat_',
  ]) {
    assert.deepEqual(inspect(value).secrets, [], value.slice(0, 80));
  }
  const oversized = 'cfoat_' + 'A'.repeat(100_000);
  const redacted = inspect(oversized);
  assert.deepEqual(redacted.secrets, ['Cloudflare Wrangler OAuth token']);
  assert.equal(redacted.text, '[Cloudflare Wrangler OAuth token removed]', 'redact complete long payload');
});
