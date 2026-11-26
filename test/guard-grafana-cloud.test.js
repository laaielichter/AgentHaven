'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = [
  "glc_Ab3+Ab3+" + "Ab3+Ab3+Ab3+" + "Ab3+Ab3+Ab3+",
  "glc_Zb7/Zb7/" + "Zb7/Zb7/Zb7/" + "Zb7/Zb7/Zb7/" + "Zb7/Zb7/Zb7/" + "Zb7/Zb7/Zb7/" + "Zb7/Zb7/=="
];
const nearMisses = [
  "glc_AAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAA",
  "glc_AAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAA",
  "_glc_Ab3+Ab3" + "+Ab3+Ab3+Ab3" + "+Ab3+Ab3+Ab3" + "+",
  "glc_Ab3+Ab3+" + "Ab3+Ab3+Ab3+" + "Ab3+Ab3+Ab3+" + "_",
  "glc_Zb7/Zb7/" + "Zb7/Zb7/Zb7/" + "Zb7/Zb7/Zb7/" + "Zb7/Zb7/Zb7/" + "Zb7/Zb7/Zb7/" + "Zb7/Zb7/===="
];

test('guard: redact complete Grafana Cloud API token values', () => {
  for (const token of tokens) {
    for (const input of [token, 'credential ' + token + ' done']) {
      const result = inspect(input);
      assert.equal(result.text, input.replace(token, '[Grafana Cloud API token removed]'));
      assert.deepEqual(result.secrets, ['Grafana Cloud API token']);
      assert.deepEqual(inspect(result.text).secrets, [], 'redaction must be idempotent');
    }
  }
});

test('guard: preserve malformed and embedded Grafana Cloud API token lookalikes', () => {
  for (const input of nearMisses) {
    const result = inspect(input);
    assert.equal(result.text, input, input.slice(0, 32));
    assert.deepEqual(result.secrets, [], input.slice(0, 32));
  }
});
