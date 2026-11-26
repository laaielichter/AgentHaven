'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = [
  "pscale_tkn_A" + "b3cAb3cAb3cA" + "b3cAb3cAb3cA" + "b3cAb3cAb3c",
  "pscale_oauth" + "_Ab3cAb3cAb3" + "cAb3cAb3cAb3" + "cAb3cAb3cAb3" + "c",
  "pscale_pw_Ab" + "3cAb3cAb3cAb" + "3cAb3cAb3cAb" + "3cAb3cAb3c"
];
const nearMisses = [
  "pscale_tkn_A" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAA",
  "pscale_pw_AA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAA",
  "pscale_team_" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA",
  "_pscale_tkn_" + "Ab3cAb3cAb3c" + "Ab3cAb3cAb3c" + "Ab3cAb3cAb3c",
  "pscale_tkn_A" + "b3cAb3cAb3cA" + "b3cAb3cAb3cA" + "b3cAb3cAb3c_" + "XXXXXXXXXXXX" + "XXXXXXXXXXXX" + "XXXXXXXXXXX"
];

test('guard: redact complete PlanetScale credential values', () => {
  for (const token of tokens) {
    for (const input of [token, 'credential ' + token + ' done']) {
      const result = inspect(input);
      assert.equal(result.text, input.replace(token, '[PlanetScale credential removed]'));
      assert.deepEqual(result.secrets, ['PlanetScale credential']);
      assert.deepEqual(inspect(result.text).secrets, [], 'redaction must be idempotent');
    }
  }
});

test('guard: preserve malformed and embedded PlanetScale credential lookalikes', () => {
  for (const input of nearMisses) {
    const result = inspect(input);
    assert.equal(result.text, input, input.slice(0, 32));
    assert.deepEqual(result.secrets, [], input.slice(0, 32));
  }
});
