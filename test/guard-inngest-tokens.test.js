'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = ['signkey-prod-' + 'a1b2'.repeat(16), 'signkey-test-' + 'a1b2'.repeat(16)];
const invalid = ["signkey-prod-a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2","signkey-preview-a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2a1b2"];

test('guard: redact complete Inngest signing key values', () => {
  for (const token of tokens) {
    const result = inspect('credential ' + token + ' end');
    assert.equal(result.text, 'credential [Inngest signing key removed] end');
    assert.deepEqual(result.secrets, ['Inngest signing key']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: reject malformed Inngest signing key values or prefixed identifiers', () => {
  for (const value of [...invalid, ...tokens.map(t => 'prefix_' + t)]) {
    assert.deepEqual(inspect(value).secrets, [], value.slice(0, 35));
  }
});
