'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('redacts Cookie and Set-Cookie headers embedded in quoted command arguments', () => {
  const inputs = [
    ['curl -H "Cookie: session=' + 'Ab3_'.repeat(8) + '; theme=light" https://example.invalid',
     'curl -H "Cookie: [cookie value removed]" https://example.invalid'],
    ["curl -H 'Set-Cookie: sid=abcdef012345; HttpOnly' https://example.invalid",
     "curl -H 'Set-Cookie: [cookie value removed]' https://example.invalid"],
  ];
  for (const [raw, expected] of inputs) {
    const result = inspect(raw);
    assert.equal(result.text, expected);
    assert.deepEqual(result.secrets, ['HTTP cookie header']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('leaves shell arguments without cookie assignments unchanged', () => {
  for (const raw of ['curl -H "Cookie: no-pair-here"', 'curl -H "Cookie: =bad"',
    'echo "A Cookie header may contain a session cookie"']) {
    assert.equal(inspect(raw).text, raw);
  }
});
