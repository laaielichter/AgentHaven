'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const BEGIN = '-----BEGIN PGP PRIVATE KEY BLOCK-----';
const END = '-----END PGP PRIVATE KEY BLOCK-----';

test('guard: mask the full OpenPGP private-key armor', () => {
  const secret = BEGIN + '\nVersion: TestFixture\n\n' + 'FakePrivatePayload'.repeat(8) + '\n' + END;
  const content = 'Key follows:\n' + secret + '\nDone';
  const result = inspect(content);
  assert.equal(result.text, 'Key follows:\n[OpenPGP private key removed]\nDone');
  assert.deepEqual(result.secrets, ['OpenPGP private key']);
  assert.equal(result.text.includes('FakePrivatePayload'), false);
  assert.deepEqual(inspect(result.text).secrets, []);
});

test('guard: a truncated OpenPGP private block is masked through end-of-input', () => {
  const content = BEGIN + '\n' + 'IncompleteSecret'.repeat(5);
  const result = inspect(content);
  assert.equal(result.text, '[OpenPGP private key removed]');
  assert.deepEqual(result.secrets, ['OpenPGP private key']);
});

test('guard: do not mask public PGP armor', () => {
  const content = '-----BEGIN PGP PUBLIC KEY BLOCK-----\npublic material\n-----END PGP PUBLIC KEY BLOCK-----';
  assert.equal(inspect(content).text, content);
  assert.deepEqual(inspect(content).secrets, []);
});
