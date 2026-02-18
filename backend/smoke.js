const http = require('http');

function post(path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = http.request(options, (res) => {
      let chunks = '';
      res.on('data', (c) => chunks += c);
      res.on('end', () => {
        try {
          const parsed = chunks ? JSON.parse(chunks) : {};
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: chunks });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(body);
    req.end();
  });
}

(async () => {
  try {
    console.log('Running smoke tests against http://localhost:5000');

    const registerData = {
      username: 'smoke',
      email: 'smoke@example.com',
      password: 'password123',
      firstName: 'Smoke',
      lastName: 'Test'
    };

    const reg = await post('/api/auth/register', registerData);
    console.log('REGISTER:', reg.statusCode, JSON.stringify(reg.body));

    const loginData = {
      email: 'smoke@example.com',
      password: 'password123'
    };

    const log = await post('/api/auth/login', loginData);
    console.log('LOGIN:', log.statusCode, JSON.stringify(log.body));

    process.exit(0);
  } catch (err) {
    console.error('Smoke test error:', err);
    process.exit(1);
  }
})();
