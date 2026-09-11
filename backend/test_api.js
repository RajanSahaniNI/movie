const http = require('http');

const request = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- STARTING COMPREHENSIVE BACKEND API TESTS ---');

  // 1. Health check
  const health = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
  });
  console.log('1. Health check status:', health.status, health.data);
  if (health.status !== 200) throw new Error('Health check failed');

  // 2. User login
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'user@moviebooking.com', password: 'user123' }
  );
  console.log('2. User login status:', loginRes.status, 'User:', loginRes.data.user?.name);
  if (!loginRes.data.success) throw new Error('Login failed');
  const token = loginRes.data.user.token;

  // 3. Admin login
  const adminLogin = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@moviebooking.com', password: 'admin123' }
  );
  console.log('3. Admin login status:', adminLogin.status, 'Role:', adminLogin.data.user?.role);
  if (adminLogin.data.user?.role !== 'admin') throw new Error('Admin login failed');

  // 4. Fetch movies
  const moviesRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/movies',
    method: 'GET',
  });
  console.log('4. Movies count:', moviesRes.data.count);

  // 5. Fetch shows
  const showsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/shows',
    method: 'GET',
  });
  console.log('5. Shows count:', showsRes.data.count);
  const targetShow = showsRes.data.shows[1] || showsRes.data.shows[0];

  // 6. Hold Seats (e.g. B5, B6)
  const holdRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/bookings/hold',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    { showId: targetShow._id, seats: ['B5', 'B6'] }
  );
  console.log('6. Hold seats status:', holdRes.status, 'Message:', holdRes.data.message, 'Expires in:', holdRes.data.expiresInSeconds);
  if (!holdRes.data.success) throw new Error('Hold seats failed');

  // 7. Concurrent Booking / Collision Test: Attempting to hold same seat from another user
  const otherUserRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/bookings/hold',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminLogin.data.user.token}`,
      },
    },
    { showId: targetShow._id, seats: ['B5'] }
  );
  console.log('7. Concurrency collision prevention status:', otherUserRes.status, 'Expected Error Message:', otherUserRes.data.message);
  if (otherUserRes.status !== 400) throw new Error('Collision check failed - expected 400');

  // 8. Pay at Counter
  const payRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/bookings/pay-counter',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    { showId: targetShow._id, seats: ['B5', 'B6'] }
  );
  console.log('8. Pay at Counter status:', payRes.status, 'Booking Code:', payRes.data.booking?.bookingCode);
  if (!payRes.data.success || !payRes.data.booking?.bookingCode?.startsWith('MVB-')) {
    throw new Error('Pay at counter failed or invalid booking code');
  }

  const bookingId = payRes.data.booking._id;

  // 9. Verify PDF receipt generation endpoint
  const receiptRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/bookings/${bookingId}/receipt`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('9. Receipt endpoint status:', receiptRes.status, 'Content-Type:', receiptRes.headers['content-type']);
  if (receiptRes.status !== 200 || !receiptRes.headers['content-type']?.includes('application/pdf')) {
    throw new Error('Receipt generation failed');
  }

  console.log('\n✅ ALL 9 BACKEND ENDPOINT AND CONCURRENCY TESTS PASSED SUCCESSFULLY!');
};

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
