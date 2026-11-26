'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const token = 'pat' + 'A1b2C3d4E5f6G7' + '.' + 'aB3_'.repeat(16);

test('guard: redact entire Airtable PAT including its ID and secret', () => {
  const result = inspect('Airtable credential ' + token + ' end');
  assert.equal(result.text, 'Airtable credential [Airtable personal access token removed] end');
  assert.deepEqual(result.secrets, ['Airtable personal access token']);
  assert.deepEqual(inspect(result.text).secrets, []);
});

test('guard: do not redact partial Airtable PATs or unrelated identifiers', () => {
  for (const value of [
    token.slice(0, -1), token + '_suffix', 'prefix_' + token,
    'pat' + 'A1b2C3d4E5f6G' + '.' + 'aB3_'.repeat(16),
    'Airtable PATs consist of an ID and a secret',
  ]) assert.deepEqual(inspect(value).secrets, [], value.slice(0, 24));
});
