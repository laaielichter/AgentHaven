'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('guard: redact complete Fly.io macaroon token values', () => {
  const tokens = [
    "fm2_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_Ab2_Ab2_" + "Ab2_Ab2_",
    "fm2_Az0+Az0+" + "Az0+Az0+Az0+" + "Az0+Az0+Az0+" + "Az0+Az0+Az0+" + "Az0+Az0+Az0+" + "Az0+Az0+Az0+" + "Az0+"
  ];
  for (const token of tokens) {
    const result = inspect('credential ' + token + ' done');
    assert.equal(result.text, 'credential [Fly.io macaroon token removed] done');
    assert.deepEqual(result.secrets, ['Fly.io macaroon token']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: ignore incomplete Fly.io macaroon token values and unrelated identifiers', () => {
  const nearMisses = [
    "fm2_AAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAA",
    "prefixfm2_Ab" + "2_Ab2_Ab2_Ab" + "2_Ab2_Ab2_Ab" + "2_Ab2_Ab2_Ab" + "2_Ab2_Ab2_Ab" + "2_Ab2_Ab2_Ab" + "2_",
    "fm2.+Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_",
    "FlyV1 fm2_ d" + "enotes a sco" + "ped Fly.io t" + "oken."
  ];
  for (const text of nearMisses) assert.deepEqual(inspect(text).secrets, [], text.slice(0, 24));
});
