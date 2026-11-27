'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');
const kind = "1Password Secret Key";
const positives = ["A3-ABC123-AAAAAAAAAAA-BBBBB-CCCCC-DDDDD","A3-ABC123-AAAAAA-BBBBB-CCCCC-DDDDD-EEEEE"];
const negatives = ["A3-ABC123-AAAAAAAAAA-BBBBB-CCCCC-DDDDD","xA3-ABC123-AAAAAAAAAAA-BBBBB-CCCCC-DDDDD","A3-ABC123-AAAAAAAAAAA-BBBBB-CCCCC-DDDDDA","A3-ABC123-AAAAAAAAAAA-BBBBB-CCCCC-DDDDD.suffix"];
test('redacts complete 1Password Secret Key values without retaining token bytes', () => {
  for (const value of positives) {
    const result = inspect('before ' + value + ' after');
    assert.equal(result.text, 'before [' + kind + ' removed] after');
    assert.deepEqual(result.secrets, [kind]);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});
test('ignores invalid or embedded 1Password Secret Key candidates', () => {
  for (const value of negatives) {
    const result = inspect(value);
    assert.equal(result.text, value);
    assert.equal(result.secrets.includes(kind), false);
  }
});
