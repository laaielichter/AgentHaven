'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = [
  "rdme_ab3cab3" + "cab3cab3cab3" + "cab3cab3cab3" + "cab3cab3cab3" + "cab3cab3cab3" + "cab3cab3cab3" + "cab"
];
const nearMisses = [
  "rdme_aaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aa",
  "rdme_aaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaa",
  "_rdme_ab3cab" + "3cab3cab3cab" + "3cab3cab3cab" + "3cab3cab3cab" + "3cab3cab3cab" + "3cab3cab3cab" + "3cab",
  "rdme_ab3cab3" + "cab3cab3cab3" + "cab3cab3cab3" + "cab3cab3cab3" + "cab3cab3cab3" + "cab3cab3cab3" + "cab_",
  "rdma_aaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaa"
];

test('guard: redact complete ReadMe API token values', () => {
  for (const token of tokens) {
    for (const input of [token, 'credential ' + token + ' done']) {
      const result = inspect(input);
      assert.equal(result.text, input.replace(token, '[ReadMe API token removed]'));
      assert.deepEqual(result.secrets, ['ReadMe API token']);
      assert.deepEqual(inspect(result.text).secrets, [], 'redaction must be idempotent');
    }
  }
});

test('guard: preserve malformed and embedded ReadMe API token lookalikes', () => {
  for (const input of nearMisses) {
    const result = inspect(input);
    assert.equal(result.text, input, input.slice(0, 32));
    assert.deepEqual(result.secrets, [], input.slice(0, 32));
  }
});
