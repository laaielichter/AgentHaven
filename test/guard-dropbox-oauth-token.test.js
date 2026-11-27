'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('guard: redact complete Dropbox OAuth access token values', () => {
  const tokens = [
    "sl.Ab2_Ab2_A" + "b2_Ab2_Ab2_A" + "b2_Ab2_Ab2_A" + "b2_Ab2_Ab2_A" + "b2_Ab2_Ab2_A" + "b2_Ab2_Ab2_A" + "b2_Ab2_Ab2_",
    "sl.u.Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_"
  ];
  for (const token of tokens) {
    const result = inspect('credential ' + token + ' done');
    assert.equal(result.text, 'credential [Dropbox OAuth access token removed] done');
    assert.deepEqual(result.secrets, ['Dropbox OAuth access token']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: ignore incomplete Dropbox OAuth access token values and unrelated identifiers', () => {
  const nearMisses = [
    "sl.Ab2_Ab2_A" + "b2_Ab2_Ab2_A" + "b2_Ab2_Ab2_A" + "b2_Ab2_Ab2_A" + "b2_",
    "sl.u.Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_",
    "sl.x.Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_",
    "prefixsl.Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_",
    "Dropbox sl. " + "tokens are o" + "paque."
  ];
  for (const text of nearMisses) assert.deepEqual(inspect(text).secrets, [], text.slice(0, 24));
});
