const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { Pool } = require('pg');

const PORT = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, '..', 'frontend');
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgres://student:student_password@localhost:5432/practice_project' });
const allowedRoles = new Set(['administrator', 'standard_user', 'guest']);
const statuses = new Set(['draft', 'pending_approval', 'approved', 'scheduled', 'published']);
const platforms = new Set(['instagram', 'facebook', 'linkedin', 'tiktok', 'other']);
const contentTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };

class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }

function sendJson(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(data === null ? '' : JSON.stringify(data));
}

async function bodyJson(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 1024 * 1024) throw new HttpError(413, 'Размер запроса превышает 1 МБ.');
  }
  try { return body ? JSON.parse(body) : {}; }
  catch { throw new HttpError(400, 'Некорректный формат JSON.'); }
}

function requireRole(request, roles) {
  const role = request.headers['x-user-role'] || 'guest';
  if (!allowedRoles.has(role)) throw new HttpError(400, 'Указана неизвестная роль пользователя.');
  if (!roles.includes(role)) throw new HttpError(403, 'У вашей роли нет разрешения на это действие.');
  return role;
}

function validatePost(data) {
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const body = typeof data.body === 'string' ? data.body.trim() : '';
  const channelId = Number(data.channel_id);
  const status = data.status || 'draft';
  if (!title) throw new HttpError(400, 'Укажите название публикации.');
  if (title.length > 180) throw new HttpError(400, 'Название не должно превышать 180 символов.');
  if (body.length > 5000) throw new HttpError(400, 'Текст публикации не должен превышать 5000 символов.');
  if (!Number.isInteger(channelId) || channelId < 1) throw new HttpError(400, 'Выберите канал публикации.');
  if (!statuses.has(status)) throw new HttpError(400, 'Выбран неизвестный статус публикации.');
  let scheduledAt = null;
  if (data.scheduled_at) {
    scheduledAt = new Date(data.scheduled_at);
    if (Number.isNaN(scheduledAt.getTime())) throw new HttpError(400, 'Укажите корректную дату публикации.');
  }
  const assignee = typeof data.assignee === 'string' ? data.assignee.trim() : '';
  if (assignee.length > 120) throw new HttpError(400, 'Имя ответственного не должно превышать 120 символов.');
  return { title, body, channelId, status, scheduledAt, assignee: assignee || null };
}

async function routeApi(request, response, url) {
  const method = request.method; const pathname = url.pathname;
  if (pathname === '/api/health' && method === 'GET') {
    await pool.query('SELECT 1');
    return sendJson(response, 200, { status: 'ok', database: 'connected' });
  }
  if (pathname === '/api/posts' && method === 'GET') {
    requireRole(request, ['administrator', 'standard_user', 'guest']);
    const { rows } = await pool.query(`SELECT p.id, p.title, p.body, p.status, p.scheduled_at, p.assignee, p.created_at, p.updated_at, p.channel_id, c.name AS channel_name, c.platform
      FROM posts p JOIN channels c ON c.id = p.channel_id WHERE p.status <> 'archived' ORDER BY p.scheduled_at NULLS LAST, p.updated_at DESC`);
    return sendJson(response, 200, rows);
  }
  if (pathname === '/api/posts' && method === 'POST') {
    requireRole(request, ['administrator', 'standard_user']);
    const data = validatePost(await bodyJson(request));
    const result = await pool.query(`INSERT INTO posts (title, body, channel_id, status, scheduled_at, assignee, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, 1) RETURNING *`, [data.title, data.body, data.channelId, data.status, data.scheduledAt, data.assignee]);
    const post = result.rows[0];
    await pool.query('INSERT INTO audit_logs (user_id, action, entity_name, entity_id) VALUES (1, $1, $2, $3)', ['created', 'posts', post.id]);
    return sendJson(response, 201, post);
  }
  const postMatch = pathname.match(/^\/api\/posts\/(\d+)$/);
  if (postMatch) {
    const id = Number(postMatch[1]);
    if (method === 'GET') {
      requireRole(request, ['administrator', 'standard_user', 'guest']);
      const result = await pool.query(`SELECT p.id, p.title, p.body, p.status, p.scheduled_at, p.assignee, p.created_at, p.updated_at, p.channel_id, c.name AS channel_name, c.platform FROM posts p JOIN channels c ON c.id=p.channel_id WHERE p.id=$1 AND p.status <> 'archived'`, [id]);
      if (!result.rowCount) throw new HttpError(404, 'Публикация не найдена.');
      return sendJson(response, 200, result.rows[0]);
    }
    if (method === 'PUT') {
      requireRole(request, ['administrator', 'standard_user']); const data = validatePost(await bodyJson(request));
      const result = await pool.query(`UPDATE posts SET title=$1, body=$2, channel_id=$3, status=$4, scheduled_at=$5, assignee=$6, updated_at=NOW() WHERE id=$7 AND status <> 'archived' RETURNING *`, [data.title, data.body, data.channelId, data.status, data.scheduledAt, data.assignee, id]);
      if (!result.rowCount) throw new HttpError(404, 'Публикация не найдена.');
      await pool.query('INSERT INTO audit_logs (user_id, action, entity_name, entity_id) VALUES (1, $1, $2, $3)', ['updated', 'posts', id]);
      return sendJson(response, 200, result.rows[0]);
    }
    if (method === 'DELETE') {
      requireRole(request, ['administrator', 'standard_user']);
      const result = await pool.query(`UPDATE posts SET status='archived', updated_at=NOW() WHERE id=$1 AND status <> 'archived' RETURNING id`, [id]);
      if (!result.rowCount) throw new HttpError(404, 'Публикация не найдена.');
      await pool.query('INSERT INTO audit_logs (user_id, action, entity_name, entity_id) VALUES (1, $1, $2, $3)', ['archived', 'posts', id]);
      response.writeHead(204); return response.end();
    }
  }
  if (pathname === '/api/channels' && method === 'GET') {
    requireRole(request, ['administrator', 'standard_user', 'guest']);
    const { rows } = await pool.query('SELECT id, name, platform, is_active, created_at, updated_at FROM channels ORDER BY name');
    return sendJson(response, 200, rows);
  }
  if (pathname === '/api/channels' && method === 'POST') {
    requireRole(request, ['administrator']); const data = await bodyJson(request);
    const name = typeof data.name === 'string' ? data.name.trim() : ''; const platform = data.platform;
    if (!name || name.length > 100) throw new HttpError(400, 'Название канала обязательно и не должно превышать 100 символов.');
    if (!platforms.has(platform)) throw new HttpError(400, 'Выберите корректную платформу.');
    const result = await pool.query('INSERT INTO channels (name, platform) VALUES ($1, $2) RETURNING *', [name, platform]);
    return sendJson(response, 201, result.rows[0]);
  }
  const channelMatch = pathname.match(/^\/api\/channels\/(\d+)$/);
  if (channelMatch) {
    requireRole(request, ['administrator']); const id = Number(channelMatch[1]);
    if (method === 'PATCH') {
      const data = await bodyJson(request); const name = typeof data.name === 'string' ? data.name.trim() : '';
      if (!name || name.length > 100) throw new HttpError(400, 'Название канала обязательно и не должно превышать 100 символов.');
      const result = await pool.query('UPDATE channels SET name=$1, updated_at=NOW() WHERE id=$2 RETURNING *', [name, id]);
      if (!result.rowCount) throw new HttpError(404, 'Канал не найден.');
      return sendJson(response, 200, result.rows[0]);
    }
    if (method === 'DELETE') {
      const used = await pool.query('SELECT 1 FROM posts WHERE channel_id=$1 LIMIT 1', [id]);
      if (used.rowCount) throw new HttpError(409, 'Нельзя удалить канал, в котором уже есть публикации.');
      const result = await pool.query('DELETE FROM channels WHERE id=$1 RETURNING id', [id]);
      if (!result.rowCount) throw new HttpError(404, 'Канал не найден.');
      response.writeHead(204); return response.end();
    }
  }
  throw new HttpError(404, 'Маршрут не найден.');
}

async function serveStatic(response, pathname) {
  let requested = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
  const filePath = path.resolve(publicDir, `.${requested}`);
  if (!filePath.startsWith(`${publicDir}${path.sep}`) && filePath !== path.join(publicDir, 'index.html')) throw new HttpError(403, 'Доступ запрещён.');
  let actualPath = filePath;
  try { if (!(await fs.promises.stat(actualPath)).isFile()) actualPath = path.join(publicDir, 'index.html'); }
  catch { actualPath = path.join(publicDir, 'index.html'); }
  try {
    const content = await fs.promises.readFile(actualPath);
    response.writeHead(200, { 'Content-Type': contentTypes[path.extname(actualPath)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }); response.end(content);
  } catch { throw new HttpError(404, 'Файл не найден.'); }
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) await routeApi(request, response, url);
    else await serveStatic(response, url.pathname);
  } catch (error) {
    if (response.headersSent) return response.end();
    const status = error instanceof HttpError ? error.status : (error.code === '23503' ? 400 : error.code === '23505' ? 409 : 500);
    if (status === 500) console.error('Request failed:', error.message);
    sendJson(response, status, { error: status === 500 ? 'Внутренняя ошибка сервера.' : error.message });
  }
});

server.listen(PORT, '0.0.0.0', () => console.log(`Content Desk listening on ${PORT}`));
async function shutdown() { server.close(); await pool.end(); process.exit(0); }
process.on('SIGTERM', shutdown); process.on('SIGINT', shutdown);
