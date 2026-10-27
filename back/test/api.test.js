const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

process.env.DB_HOST = '127.0.0.1';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'based_test';
process.env.DB_USER = 'based_test';
process.env.DB_PASSWORD = 'test-only-password';
process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');

const app = require('../src');

test('exposes health, protects private resources and returns JSON for unknown API routes', async () => {
    const server = app.listen(0);
    await new Promise(resolve => server.once('listening', resolve));
    const address = server.address();
    assert.ok(address && typeof address === 'object');
    const base = `http://127.0.0.1:${address.port}`;

    try {
        const [health, profile, registration, missing] = await Promise.all([
            fetch(`${base}/api`),
            fetch(`${base}/api/perfil`),
            fetch(`${base}/api/auth/cadastro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            }),
            fetch(`${base}/api/not-a-route`)
        ]);
        assert.equal(health.status, 200);
        assert.equal(profile.status, 401);
        assert.equal(registration.status, 400);
        assert.equal(missing.status, 404);
        assert.match(missing.headers.get('content-type'), /application\/json/);
    } finally {
        await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    }
});
