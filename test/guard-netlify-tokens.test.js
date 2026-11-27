'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('guard: redact complete Netlify authentication token values', () => {
  const tokens = [
    "nfp_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_",
    "nfc_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_",
    "nfo_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_",
    "nfu_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_",
    "nfb_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_"
  ];
  for (const token of tokens) {
    const result = inspect('credential ' + token + ' done');
    assert.equal(result.text, 'credential [Netlify authentication token removed] done');
    assert.deepEqual(result.secrets, ['Netlify authentication token']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: ignore incomplete Netlify authentication token values and unrelated identifiers', () => {
  const nearMisses = [
    "nfz_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_",
    "nfp_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_Ab2_Ab2_",
    "nfp_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_Z",
    "xnfp_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_",
    "nfp_ is a pr" + "efix for Net" + "lify PATs."
  ];
  for (const text of nearMisses) assert.deepEqual(inspect(text).secrets, [], text.slice(0, 24));
});
