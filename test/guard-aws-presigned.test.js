'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('guard: removes AWS SigV4 signatures from presigned URLs', () => {
  const signature = 'a1'.repeat(32); // Synthetic, not a credential.
  const raw = 'https://example-bucket.s3.amazonaws.com/object?' +
    'X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=' + signature +
    '&X-Amz-Expires=120';
  const result = inspect(raw);
  assert.deepEqual(result.secrets, ['AWS presigned URL signature']);
  assert.equal(result.text, raw.replace(signature, '[AWS presigned URL signature removed]'));
  assert.ok(!result.text.includes(signature));
  assert.deepEqual(inspect(result.text).secrets, [], 'must be idempotent');
});

test('guard: SigV4 rule rejects truncated, nonhex and extended signatures', () => {
  const value = 'ab'.repeat(32);
  for (const ordinary of [
    'X-Amz-Signature=' + 'a'.repeat(63),
    'X-Amz-Signature=' + 'a'.repeat(65),
    'X-Amz-Signature=' + 'z'.repeat(64),
    'X-Amz-Signature=' + value + '_suffix',
    'X-Amz-SignedHeaders=host',
    'git commit ' + 'b'.repeat(40),
  ]) {
    assert.deepEqual(inspect(ordinary).secrets, [], ordinary.slice(0, 90));
  }
});

test('guard: SigV4 parameter matching ignores case', () => {
  const signature = 'f'.repeat(64);
  assert.equal(inspect('https://example.com/?x-amz-signature=' + signature).text,
    'https://example.com/?x-amz-signature=[AWS presigned URL signature removed]');
});
