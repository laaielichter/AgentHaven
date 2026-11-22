'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('guard: GitLab CI job and pipeline trigger tokens are redacted', () => {
  for (const [prefix, kind] of [
    ['glcbt-', 'GitLab CI job token'],
    ['glptt-', 'GitLab pipeline trigger token'],
  ]) {
    const token = prefix + 'Ab3x'.repeat(8); // Synthetic credential-shaped string.
    for (const raw of [token, `Credential: ${token} ready`]) {
      const scanned = inspect(raw);
      assert.deepEqual(scanned.secrets, [kind]);
      assert.equal(scanned.text, raw.replace(token, `[${kind} removed]`));
      assert.deepEqual(inspect(scanned.text).secrets, [], 'redaction must be idempotent');
    }
    for (const harmless of [
      prefix + 'Ab3x'.repeat(4), // Too short to be a token.
      'prefix_' + token,
      'Use ' + prefix + ' in documentation',
    ]) {
      assert.deepEqual(inspect(harmless).secrets, [], harmless);
    }
  }
});
