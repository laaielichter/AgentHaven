'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('guard: redact complete Supabase scoped PAT values', () => {
  const tokens = [
    "sbp_fc_Ab2_A" + "b2_Ab2_Ab2_A" + "b2_Ab2_Ab2_A" + "b2_Ab2_Ab2_",
    "sbp_fcAb2_Ab" + "2_Ab2_Ab2_Ab" + "2_Ab2_Ab2_Ab" + "2_Ab2_Ab2_"
  ];
  for (const token of tokens) {
    const result = inspect('credential ' + token + ' done');
    assert.equal(result.text, 'credential [Supabase scoped PAT removed] done');
    assert.deepEqual(result.secrets, ['Supabase scoped PAT']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: ignore incomplete Supabase scoped PAT values and unrelated identifiers', () => {
  const nearMisses = [
    "sbp_fc",
    "sbp_fc_Ab2_A" + "b2_Ab2_Ab2_A" + "b2_",
    "prefixsbp_fc" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_Ab2_Ab2" + "_Ab2_",
    "Scoped token" + "s use the sb" + "p_fc prefix."
  ];
  for (const text of nearMisses) assert.deepEqual(inspect(text).secrets, [], text.slice(0, 24));
});
