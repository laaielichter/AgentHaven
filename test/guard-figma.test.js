'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('guard: redact figd_-prefixed Figma personal access tokens', () => {
  for (const length of [40, 44, 48, 160, 200]) {
    const token = 'figd_' + 'Ab3x'.repeat(length / 4); // Entirely synthetic.
    for (const text of [token, 'Use Figma token ' + token + ' privately']) {
      const result = inspect(text);
      assert.deepEqual(result.secrets, ['Figma personal access token']);
      assert.equal(result.text, text.replace(token, '[Figma personal access token removed]'));
      assert.deepEqual(inspect(result.text).secrets, [], 'redaction should be idempotent');
    }
  }
});

test('guard: Figma PAT rule does not consume adjacent identifiers or partial keys', () => {
  const token = 'figd_' + 'Ab3x'.repeat(10);
  for (const text of [
    'figd_', 'figd_' + 'A'.repeat(39), 'figd_' + 'A'.repeat(201),
    'figx_' + 'A'.repeat(40), 'prefix_' + token,
    'not' + token, 'figd_' + 'A'.repeat(100_000),
    'A Figma token is generated under Settings > Security',
  ]) {
    const result = inspect(text);
    assert.deepEqual(result.secrets, [], text.slice(0, 80));
    assert.equal(result.text, text);
  }
});

test('guard: redact an opaque Figma token including underscore suffix', () => {
  const token = 'figd_' + 'Ab3x'.repeat(10) + '_suffix';
  const result = inspect(token);
  assert.deepEqual(result.secrets, ['Figma personal access token']);
  assert.equal(result.text, '[Figma personal access token removed]');
});
