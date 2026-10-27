const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
const { createToken, requireAuth } = require('../src/middleware/auth');

function invokeAuth(authorization) {
    const req = { get: name => name === 'authorization' ? authorization : undefined };
    const response = {
        statusCode: 200,
        body: undefined,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        }
    };
    let nextCalled = false;
    requireAuth(req, response, error => {
        if (error) throw error;
        nextCalled = true;
    });
    return { req, response, nextCalled };
}

test('accepts a valid session and exposes only its user id', () => {
    const token = createToken(42);
    const result = invokeAuth(`Bearer ${token}`);

    assert.equal(result.nextCalled, true);
    assert.deepEqual(result.req.user, { id: 42 });
});

test('rejects requests without a token', () => {
    const result = invokeAuth(undefined);

    assert.equal(result.nextCalled, false);
    assert.equal(result.response.statusCode, 401);
});

test('rejects malformed or forged tokens', () => {
    const token = createToken(42);
    const forged = `${token.slice(0, -1)}x`;
    const result = invokeAuth(`Bearer ${forged}`);

    assert.equal(result.nextCalled, false);
    assert.equal(result.response.statusCode, 401);
});
