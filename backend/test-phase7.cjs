const http = require('http');
const { io } = require('../frontend/node_modules/socket.io-client');

const API_BASE = 'http://localhost:5000';
const ORIGIN = 'http://localhost:5173';

function makeRequest(method, path, body = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const postData = body ? JSON.stringify(body) : null;

    const headers = {
      'Origin': ORIGIN,
    };

    if (postData) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    if (cookie) {
      headers['Cookie'] = cookie;
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: headers,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }

        const setCookie = res.headers['set-cookie'];
        let extractedCookie = null;
        if (setCookie) {
          const cookieStr = Array.isArray(setCookie) ? setCookie.join('; ') : setCookie;
          const match = cookieStr.match(/taskbuddy_token=[^;]+/);
          if (match) {
            extractedCookie = match[0];
          }
        }

        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          cookie: extractedCookie,
          body: json,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runSuite() {
  console.log('\n======================================================');
  console.log('   TASKBUDDY PHASE 7: AUTOMATED INTEGRATION TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(title, condition, extra = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${title}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${title} ${extra}`);
      failed++;
    }
  }

  const timestamp = Date.now();
  const userAEmail = `agent_a_${timestamp}@test.local`;
  const userBEmail = `agent_b_${timestamp}@test.local`;
  const password = 'StrongPassword123!';

  let cookieA = null;
  let cookieB = null;
  let userAId = null;
  let userBId = null;

  try {
    // -------------------------------------------------------------
    // SECTION 1: AUTHENTICATION FLOW
    // -------------------------------------------------------------
    console.log('\n--- 1. AUTHENTICATION & SESSION TESTS ---');

    // Test 1.1: Register User A
    const regARes = await makeRequest('POST', '/api/auth/register', {
      name: 'Agent A',
      email: userAEmail,
      password: password,
    });
    const regAUser = regARes.body?.data?.user || regARes.body?.data;
    assert('Register User A returns 201 and user payload', regARes.statusCode === 201 && regAUser?.email === userAEmail);
    cookieA = regARes.cookie;
    userAId = regAUser?.id;
    assert('User A received httpOnly auth cookie', !!cookieA);

    // Test 1.2: Register User B
    const regBRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Agent B',
      email: userBEmail,
      password: password,
    });
    const regBUser = regBRes.body?.data?.user || regBRes.body?.data;
    assert('Register User B returns 201 and user payload', regBRes.statusCode === 201 && regBUser?.email === userBEmail);
    cookieB = regBRes.cookie;
    userBId = regBUser?.id;
    assert('User B received distinct auth cookie', !!cookieB && cookieB !== cookieA);

    // Test 1.3: GET /api/auth/me with User A cookie
    const meRes = await makeRequest('GET', '/api/auth/me', null, cookieA);
    assert('GET /api/auth/me returns User A profile', meRes.statusCode === 200 && meRes.body?.data?.email === userAEmail);

    // Test 1.4: Login User A with correct credentials
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: userAEmail,
      password: password,
    });
    const loginUser = loginRes.body?.data?.user || loginRes.body?.data;
    assert('Login User A returns 200 OK', loginRes.statusCode === 200 && loginUser?.id === userAId);

    // Test 1.5: Logout User A
    const logoutRes = await makeRequest('POST', '/api/auth/logout', {}, cookieA);
    assert('Logout User A clears auth session', logoutRes.statusCode === 200);

    // -------------------------------------------------------------
    // SECTION 2: AUTHORIZATION & SECURITY BOUNDARIES
    // -------------------------------------------------------------
    console.log('\n--- 2. AUTHORIZATION & CROSS-TENANT ISOLATION TESTS ---');

    // Test 2.1: Unauthenticated request to /api/tasks returns 401
    const unauthRes = await makeRequest('GET', '/api/tasks');
    assert('Unauthenticated access to /api/tasks returns 401', unauthRes.statusCode === 401);

    // Test 2.2: Non-admin user accessing /api/admin/users returns 403
    const nonAdminUsersRes = await makeRequest('GET', '/api/admin/users', null, cookieA);
    assert('Non-admin user accessing /api/admin/users returns 403 Forbidden', nonAdminUsersRes.statusCode === 403);

    // Test 2.3: Non-admin user accessing /api/admin/tasks returns 403
    const nonAdminTasksRes = await makeRequest('GET', '/api/admin/tasks', null, cookieA);
    assert('Non-admin user accessing /api/admin/tasks returns 403 Forbidden', nonAdminTasksRes.statusCode === 403);

    // -------------------------------------------------------------
    // SECTION 3: CRUD, VALIDATION, STATS & FILTERS (USER A)
    // -------------------------------------------------------------
    console.log('\n--- 3. CRUD, VALIDATION & STATS TESTS (USER A) ---');

    // Test 3.1: Zod validation failure on invalid task creation returns 400
    const invalidTaskRes = await makeRequest('POST', '/api/tasks', {
      title: '', // empty title violates min(1)
      priority: 'ultra-mega', // invalid enum
    }, cookieA);
    assert('Invalid payload rejected with 400 Bad Request', invalidTaskRes.statusCode === 400);

    // Test 3.2: Create task for User A
    const createTaskRes = await makeRequest('POST', '/api/tasks', {
      title: 'Infiltrate Server Grid',
      description: 'Breach the mainframe and deploy real-time telemetry probes',
      priority: 'high',
      status: 'todo',
      dueDate: '2026-11-15',
    }, cookieA);
    assert('Create task for User A returns 201 Created', createTaskRes.statusCode === 201 && createTaskRes.body?.data?.title === 'Infiltrate Server Grid');
    const taskAId = createTaskRes.body?.data?.id;

    // Test 3.3: Cross-tenant isolation - User B cannot view User A's task (returns 404)
    const userBAccessTaskARes = await makeRequest('GET', `/api/tasks/${taskAId}`, null, cookieB);
    assert('User B accessing User A task returns 404 (zero enumeration leakage)', userBAccessTaskARes.statusCode === 404);

    // Test 3.4: Cross-tenant isolation - User B cannot update User A's task (returns 404)
    const userBUpdateTaskARes = await makeRequest('PUT', `/api/tasks/${taskAId}`, {
      title: 'Hacked by User B',
      priority: 'low',
      status: 'done',
    }, cookieB);
    assert('User B modifying User A task returns 404', userBUpdateTaskARes.statusCode === 404);

    // Test 3.5: User A updates own task
    const updateTaskRes = await makeRequest('PUT', `/api/tasks/${taskAId}`, {
      title: 'Infiltrate Server Grid [SECURE]',
      description: 'Updated payload description',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2026-11-20',
    }, cookieA);
    assert('User A updates own task returns 200 OK', updateTaskRes.statusCode === 200 && updateTaskRes.body?.data?.status === 'in-progress');

    // Test 3.6: Toggle task completion status
    const toggleRes = await makeRequest('PATCH', `/api/tasks/${taskAId}/toggle`, {}, cookieA);
    assert('Toggle task completion returns 200 OK (completed=true)', toggleRes.statusCode === 200 && toggleRes.body?.data?.completed === true);

    // Test 3.7: Query Stats for User A
    const statsRes = await makeRequest('GET', '/api/tasks/stats', null, cookieA);
    assert('Task stats returns correct counts', statsRes.statusCode === 200 && statsRes.body?.data?.completed >= 1);

    // Test 3.8: Search filter returns matching task
    const searchRes = await makeRequest('GET', '/api/tasks?search=Infiltrate', null, cookieA);
    assert('Search query finds matching task', searchRes.statusCode === 200 && searchRes.body?.data?.some(t => t.id === taskAId));

    // Test 3.9: Delete single task
    const deleteRes = await makeRequest('DELETE', `/api/tasks/${taskAId}`, null, cookieA);
    assert('Delete single task returns 200 OK', deleteRes.statusCode === 200);

    // Test 3.10: Clear all tasks
    await makeRequest('POST', '/api/tasks', { title: 'Temp Mission 1', priority: 'low', status: 'todo' }, cookieA);
    await makeRequest('POST', '/api/tasks', { title: 'Temp Mission 2', priority: 'medium', status: 'todo' }, cookieA);
    const clearRes = await makeRequest('DELETE', '/api/tasks', null, cookieA);
    assert('Clear all tasks returns 200 OK', clearRes.statusCode === 200 && clearRes.body?.data?.deletedCount >= 2);

    // -------------------------------------------------------------
    // SECTION 4: REAL-TIME SOCKET.IO TENANT ISOLATION
    // -------------------------------------------------------------
    console.log('\n--- 4. REAL-TIME SOCKET.IO MULTI-TAB & TENANT ISOLATION TESTS ---');

    await new Promise((resolveTimeout) => {
      let socketAEvents = [];
      let socketBEvents = [];

      // Connect Socket A with User A credentials
      const socketA = io(API_BASE, {
        extraHeaders: {
          Cookie: cookieA,
        },
        transports: ['websocket'],
      });

      // Connect Socket B with User B credentials
      const socketB = io(API_BASE, {
        extraHeaders: {
          Cookie: cookieB,
        },
        transports: ['websocket'],
      });

      let aConnected = false;
      let bConnected = false;

      function checkConnected() {
        if (aConnected && bConnected) {
          // Trigger a task creation for User A
          makeRequest('POST', '/api/tasks', {
            title: 'Real-Time Mission Test',
            priority: 'high',
            status: 'todo',
          }, cookieA).then((res) => {
            // Wait 500ms for socket events to deliver
            setTimeout(() => {
              assert('Socket A receives task:created event', socketAEvents.length === 1 && socketAEvents[0].title === 'Real-Time Mission Test');
              assert('Socket B receives ZERO events (tenant isolation verified)', socketBEvents.length === 0);

              socketA.disconnect();
              socketB.disconnect();
              resolveTimeout();
            }, 600);
          });
        }
      }

      socketA.on('connect', () => {
        aConnected = true;
        checkConnected();
      });

      socketB.on('connect', () => {
        bConnected = true;
        checkConnected();
      });

      socketA.on('task:created', (data) => {
        socketAEvents.push(data);
      });

      socketB.on('task:created', (data) => {
        socketBEvents.push(data);
      });

      // Timeout safety
      setTimeout(() => {
        if (!aConnected || !bConnected) {
          assert('Socket connection timeout', false, '(Sockets did not connect in 3s)');
          socketA.disconnect();
          socketB.disconnect();
          resolveTimeout();
        }
      }, 4000);
    });

  } catch (err) {
    console.error('Fatal suite error:', err);
    failed++;
  }

  console.log('\n======================================================');
  console.log(`SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runSuite();
