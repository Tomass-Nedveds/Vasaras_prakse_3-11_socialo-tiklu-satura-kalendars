const test = require('node:test');
const assert = require('node:assert/strict');

const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:8081';
const roleHeaders = (role = 'administrator') => ({ 'content-type': 'application/json', 'x-user-role': role });

test('Lietotnes sākumlapa tiek ielādēta', async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.match(await response.text(), /Kalendar|kalend|Календар/i);
});

test('Veselības pārbaude apstiprina savienojumu ar datubāzi', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', database: 'connected' });
});

test('Sākuma dati satur kanālus un publikācijas', async () => {
  const [channelsResponse, postsResponse] = await Promise.all([
    fetch(`${baseUrl}/api/channels`, { headers: roleHeaders('guest') }),
    fetch(`${baseUrl}/api/posts`, { headers: roleHeaders('guest') })
  ]);
  assert.equal(channelsResponse.status, 200);
  assert.equal(postsResponse.status, 200);
  assert.ok((await channelsResponse.json()).length >= 3);
  assert.ok((await postsResponse.json()).length >= 5);
});

test('Publikācijas nosaukums ir obligāts', async () => {
  const channels = await (await fetch(`${baseUrl}/api/channels`)).json();
  const response = await fetch(`${baseUrl}/api/posts`, {
    method: 'POST',
    headers: roleHeaders(),
    body: JSON.stringify({ title: ' ', channel_id: channels[0].id, status: 'draft' })
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, 'Укажите название публикации.');
});

test('Nezināms publikācijas statuss tiek noraidīts', async () => {
  const channels = await (await fetch(`${baseUrl}/api/channels`)).json();
  const response = await fetch(`${baseUrl}/api/posts`, {
    method: 'POST',
    headers: roleHeaders(),
    body: JSON.stringify({ title: 'Testa publikācija', channel_id: channels[0].id, status: 'unknown' })
  });
  assert.equal(response.status, 400);
});

test('Viesim ir liegta publikāciju izveide', async () => {
  const channels = await (await fetch(`${baseUrl}/api/channels`)).json();
  const response = await fetch(`${baseUrl}/api/posts`, {
    method: 'POST',
    headers: roleHeaders('guest'),
    body: JSON.stringify({ title: 'Nedrīkst izveidot', channel_id: channels[0].id, status: 'draft' })
  });
  assert.equal(response.status, 403);
});

test('Neeksistējošas publikācijas detaļas atgriež 404', async () => {
  const response = await fetch(`${baseUrl}/api/posts/2147483647`, { headers: roleHeaders('guest') });
  assert.equal(response.status, 404);
  const payload = await response.json();
  assert.equal(typeof payload.error, 'string');
  assert.equal(JSON.stringify(payload).includes('at '), false);
});

test('Administratora loma var izveidot, atjaunināt un arhivēt publikāciju', async () => {
  const channels = await (await fetch(`${baseUrl}/api/channels`)).json();
  const marker = `Testa publikācija ${Date.now()}`;
  let postId;

  try {
    const created = await fetch(`${baseUrl}/api/posts`, {
      method: 'POST',
      headers: roleHeaders(),
      body: JSON.stringify({ title: marker, body: 'Automātiskā testa ieraksts.', channel_id: channels[0].id, status: 'draft' })
    });
    assert.equal(created.status, 201);
    postId = (await created.json()).id;

    const updated = await fetch(`${baseUrl}/api/posts/${postId}`, {
      method: 'PUT',
      headers: roleHeaders(),
      body: JSON.stringify({ title: `${marker} atjaunināts`, body: 'Pārbaudīts.', channel_id: channels[0].id, status: 'approved' })
    });
    assert.equal(updated.status, 200);
    assert.equal((await updated.json()).status, 'approved');

    const archived = await fetch(`${baseUrl}/api/posts/${postId}`, { method: 'DELETE', headers: roleHeaders() });
    assert.equal(archived.status, 204);
  } finally {
    if (postId) {
      await fetch(`${baseUrl}/api/posts/${postId}`, { method: 'DELETE', headers: roleHeaders() });
    }
  }
});
