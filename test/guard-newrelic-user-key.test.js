'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('guard: redact complete New Relic user API key values', () => {
  const tokens = [
    "NRAK-Ab2Ab2A" + "b2Ab2Ab2Ab2A" + "b2Ab2Ab2"
  ];
  for (const token of tokens) {
    const result = inspect('credential ' + token + ' done');
    assert.equal(result.text, 'credential [New Relic user API key removed] done');
    assert.deepEqual(result.secrets, ['New Relic user API key']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: ignore incomplete New Relic user API key values and unrelated identifiers', () => {
  const nearMisses = [
    "NRAK-Ab2Ab2A" + "b2Ab2Ab2Ab2A" + "b2Ab2",
    "NRAK-Ab2Ab2A" + "b2Ab2Ab2Ab2A" + "b2Ab2Ab2Z",
    "xNRAK-Ab2Ab2" + "Ab2Ab2Ab2Ab2" + "Ab2Ab2Ab2",
    "NRAK keys au" + "thenticate N" + "erdGraph API" + " calls."
  ];
  for (const text of nearMisses) assert.deepEqual(inspect(text).secrets, [], text.slice(0, 24));
});
