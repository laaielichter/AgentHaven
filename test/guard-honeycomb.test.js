'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('guard: redact complete Honeycomb ingest API keys', () => {
  for (const prefix of ['hcaik_', 'hcbic_']) {
    const credential = prefix + 'ab12cd'.repeat(9) + 'abcd';
    for (const value of [credential, 'Ingest: ' + credential + ' here']) {
      const result = inspect(value);
      assert.deepEqual(result.secrets, ['Honeycomb ingest API key']);
      assert.equal(result.text, value.replace(credential, '[Honeycomb ingest API key removed]'));
      assert.deepEqual(inspect(result.text).secrets, []);
    }
  }
});

test('guard: preserve public Honeycomb IDs and incomplete lookalikes', () => {
  const key = 'hcaik_' + 'ab12cd'.repeat(9) + 'abcd';
  for (const value of [
    'hcaik_' + '01hj41kvak3fg7y0295rzfh4bf',
    'hcaik_' + 'a'.repeat(57),
    'hcaik_' + 'a'.repeat(59),
    'prefix_' + key,
    key + '_suffix',
  ]) {
    const result = inspect(value);
    assert.ok(!result.secrets.includes('Honeycomb ingest API key'), value.slice(0, 100));
  }
});
