const state = { posts: [], channels: [], month: new Date(new Date().getFullYear(), new Date().getMonth(), 1), role: localStorage.getItem('content-desk-role') || 'administrator', view: 'calendar' };
const statusLabels = { draft: 'Черновик', pending_approval: 'На согласовании', approved: 'Одобрено', scheduled: 'Запланировано', published: 'Опубликовано', archived: 'В архиве' };
const platformLabels = { instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn', tiktok: 'TikTok', other: 'Другая платформа' };
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, { ...options, headers: { 'Content-Type': 'application/json', 'X-User-Role': state.role, ...(options.headers || {}) } });
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || 'Не удалось выполнить запрос.');
  return payload;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function platformClass(platform) { return ['instagram', 'facebook', 'linkedin', 'tiktok'].includes(platform) ? platform : 'other'; }
function displayDate(value, options = { day: 'numeric', month: 'short', year: 'numeric' }) { return value ? new Intl.DateTimeFormat('ru-RU', options).format(new Date(value)) : 'Не назначена'; }
function localDateKey(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
function toast(message, isError = false) {
  const item = document.createElement('div'); item.className = `toast${isError ? ' error' : ''}`; item.textContent = message;
  $('#toast-region').append(item); window.setTimeout(() => item.remove(), 3400);
}

async function refresh() {
  try {
    const [channels, posts] = await Promise.all([api('/channels'), api('/posts')]);
    state.channels = channels; state.posts = posts;
    $('#connection-label').textContent = 'База данных подключена'; $('#connection-label').parentElement.classList.add('online');
    render();
  } catch (error) {
    $('#connection-label').textContent = 'Нет соединения с API'; $('#connection-label').parentElement.classList.remove('online');
    toast(error.message, true);
  }
}

function render() {
  $('#today-label').textContent = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date());
  renderSummary(); renderCalendar(); renderPosts(); renderChannels(); fillChannelOptions();
}

function renderSummary() {
  const active = state.posts.filter((post) => post.status !== 'archived');
  const scheduled = active.filter((post) => post.status === 'scheduled' || post.status === 'approved').length;
  const review = active.filter((post) => post.status === 'pending_approval').length;
  const drafts = active.filter((post) => post.status === 'draft').length;
  const published = active.filter((post) => post.status === 'published').length;
  const cards = [
    ['Всего публикаций', active.length, 'В контент-плане', '▦', ''],
    ['Запланировано', scheduled, 'Одобрено к выходу', '◷', ''],
    ['На согласовании', review, review ? 'Требуют внимания' : 'Очередь согласования пуста', '◌', 'amber'],
    ['Черновики', drafts, `${published} опубликовано`, '✎', '']
  ];
  $('#summary-row').innerHTML = cards.map(([label, value, note, icon, tone]) => `<article class="summary-card"><div><span class="summary-label">${label}</span><strong class="summary-value">${value}</strong><span class="summary-note">${note}</span></div><span class="summary-icon ${tone}">${icon}</span></article>`).join('');
}

function filteredPosts() {
  const query = ($('#calendar-search')?.value || '').trim().toLocaleLowerCase('ru');
  const channel = $('#channel-filter')?.value || '';
  const status = $('#status-filter')?.value || '';
  return state.posts.filter((post) => post.status !== 'archived' && (!query || `${post.title} ${post.body || ''}`.toLocaleLowerCase('ru').includes(query)) && (!channel || String(post.channel_id) === channel) && (!status || post.status === status));
}

function renderCalendar() {
  const month = state.month; const year = month.getFullYear();
  $('#month-title').textContent = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(month);
  const first = new Date(year, month.getMonth(), 1); const offset = (first.getDay() + 6) % 7; const start = new Date(year, month.getMonth(), 1 - offset);
  const days = Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
  const today = localDateKey(new Date()); const items = filteredPosts();
  const calendar = [...weekDays.map((day) => `<div class="weekday">${day}</div>`), ...days.map((date) => {
    const key = localDateKey(date); const dayItems = items.filter((post) => post.scheduled_at && localDateKey(new Date(post.scheduled_at)) === key).sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
    const visible = dayItems.slice(0, 3);
    const events = visible.map((post) => `<button class="event-pill ${platformClass(post.platform)}" data-post-id="${post.id}" title="${escapeHtml(post.title)}"><i class="status-mark ${post.status === 'pending_approval' ? 'review' : post.status}"></i><span class="event-time">${new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(new Date(post.scheduled_at))}</span><span class="event-title">${escapeHtml(post.title)}</span></button>`).join('');
    return `<div class="day-cell ${date.getMonth() === month.getMonth() ? '' : 'outside'} ${key === today ? 'is-today' : ''}"><span class="day-number">${date.getDate()}</span><div class="event-list">${events}${dayItems.length > visible.length ? `<button class="more-events" data-date="${key}">+ ещё ${dayItems.length - visible.length}</button>` : ''}</div></div>`;
  })];
  $('#calendar-grid').innerHTML = calendar.join('');
}

function renderPosts() {
  const query = ($('#posts-search')?.value || '').trim().toLocaleLowerCase('ru'); const status = $('#posts-status-filter')?.value || '';
  const posts = state.posts.filter((post) => post.status !== 'archived' && (!query || `${post.title} ${post.body || ''} ${post.channel_name}`.toLocaleLowerCase('ru').includes(query)) && (!status || post.status === status));
  $('#posts-table-body').innerHTML = posts.length ? posts.map((post) => `<tr><td><div class="post-name">${escapeHtml(post.title)}</div><span class="post-subtitle">${escapeHtml((post.body || '').slice(0, 85) || 'Без описания')}</span></td><td><span class="channel-badge"><i class="platform-dot ${platformClass(post.platform)}"></i>${escapeHtml(post.channel_name)}</span></td><td>${post.scheduled_at ? escapeHtml(displayDate(post.scheduled_at, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })) : 'Не назначена'}</td><td><span class="status-badge ${post.status}"><i class="status-mark ${post.status === 'pending_approval' ? 'review' : post.status}"></i>${statusLabels[post.status] || post.status}</span></td><td>${escapeHtml(post.assignee || 'Не назначен')}</td><td><div class="row-actions"><button class="row-action" data-details-id="${post.id}" aria-label="Открыть детали" title="Открыть детали">↗</button><button class="row-action" data-edit-id="${post.id}" aria-label="Редактировать" title="Редактировать">✎</button><button class="row-action" data-delete-id="${post.id}" aria-label="Удалить" title="Удалить">×</button></div></td></tr>`).join('') : '<tr><td class="empty-row" colspan="6">Публикаций не найдено. Создайте первую запись или измените фильтры.</td></tr>';
}

function renderChannels() {
  $('#channel-list').innerHTML = state.channels.length ? state.channels.map((channel) => {
    const count = state.posts.filter((post) => post.channel_id === channel.id && post.status !== 'archived').length;
    return `<article class="channel-row"><span class="channel-icon ${platformClass(channel.platform)}">${escapeHtml((platformLabels[channel.platform] || channel.name).slice(0, 1))}</span><div class="channel-info"><strong>${escapeHtml(channel.name)}</strong><small>${escapeHtml(platformLabels[channel.platform] || 'Другая платформа')} · ${channel.is_active ? 'Активен' : 'Неактивен'}</small></div><span class="channel-count">${count} публикаций</span><div class="channel-actions"><button class="row-action" data-channel-edit="${channel.id}" title="Переименовать канал" aria-label="Переименовать канал">✎</button><button class="row-action" data-channel-delete="${channel.id}" title="Удалить канал" aria-label="Удалить канал">×</button></div></article>`;
  }).join('') : '<div class="empty-row">Каналов пока нет. Добавьте социальную платформу.</div>';
}

function fillChannelOptions() {
  const options = state.channels.filter((channel) => channel.is_active).map((channel) => `<option value="${channel.id}">${escapeHtml(channel.name)}</option>`).join('');
  $('#post-form [name="channel_id"]').innerHTML = options || '<option value="">Сначала добавьте канал</option>';
  const selected = $('#channel-filter').value;
  $('#channel-filter').innerHTML = `<option value="">Все каналы</option>${options}`;
  $('#channel-filter').value = selected;
}

function showView(view) {
  state.view = view;
  for (const name of ['calendar', 'posts', 'channels']) $(`#${name}-view`).classList.toggle('hidden', name !== view);
  $$('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === view));
  $('#breadcrumb-current').textContent = { calendar: 'Календарь', posts: 'Все публикации', channels: 'Каналы' }[view];
  if (location.hash !== `#${view}`) history.replaceState(null, '', `#${view}`);
}

function openPostForm(post = null) {
  const form = $('#post-form'); form.reset(); $('#post-form-error').textContent = '';
  $('#post-modal-title').textContent = post ? 'Редактировать публикацию' : 'Новая публикация';
  form.elements.id.value = post?.id || '';
  if (post) {
    form.elements.title.value = post.title; form.elements.body.value = post.body || ''; form.elements.channel_id.value = post.channel_id;
    form.elements.status.value = post.status; form.elements.assignee.value = post.assignee || '';
    if (post.scheduled_at) { const date = new Date(post.scheduled_at); form.elements.scheduled_at.value = `${localDateKey(date)}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`; }
  }
  $('#post-modal').showModal();
}

function openDetails(post) {
  const status = `<span class="status-badge ${post.status}"><i class="status-mark ${post.status === 'pending_approval' ? 'review' : post.status}"></i>${statusLabels[post.status]}</span>`;
  $('#detail-content').innerHTML = `<div class="detail-inner"><div class="detail-topline">${status}<button class="icon-button close-button" data-close-modal aria-label="Закрыть">×</button></div><h2 class="detail-title">${escapeHtml(post.title)}</h2><p class="detail-description">${escapeHtml(post.body || 'Описание не добавлено.')}</p><div class="detail-meta"><div><span>КАНАЛ</span><strong>${escapeHtml(post.channel_name)}</strong></div><div><span>ДАТА ПУБЛИКАЦИИ</span><strong>${post.scheduled_at ? escapeHtml(displayDate(post.scheduled_at, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })) : 'Не назначена'}</strong></div><div><span>ОТВЕТСТВЕННЫЙ</span><strong>${escapeHtml(post.assignee || 'Не назначен')}</strong></div><div><span>ОБНОВЛЕНО</span><strong>${escapeHtml(displayDate(post.updated_at))}</strong></div></div><div class="detail-actions"><button class="secondary-button" data-close-modal>Закрыть</button><button class="primary-button" data-detail-edit="${post.id}">Редактировать</button></div></div>`;
  $('#detail-modal').showModal();
}

async function deletePost(id) {
  if (state.role === 'guest') return toast('Гостевой доступ не позволяет удалять записи.', true);
  if (!window.confirm('Удалить эту публикацию? Это действие нельзя отменить.')) return;
  try { await api(`/posts/${id}`, { method: 'DELETE' }); toast('Публикация удалена.'); await refresh(); }
  catch (error) { toast(error.message, true); }
}

document.addEventListener('click', async (event) => {
  const nav = event.target.closest('[data-view]'); if (nav) { event.preventDefault(); showView(nav.dataset.view); }
  if (event.target.closest('#create-post, [data-create-post]')) openPostForm();
  if (event.target.closest('#create-channel')) { $('#channel-form').reset(); $('#channel-form-error').textContent = ''; $('#channel-modal').showModal(); }
  const details = event.target.closest('[data-post-id], [data-details-id]');
  if (details) { const id = Number(details.dataset.postId || details.dataset.detailsId); const post = state.posts.find((item) => item.id === id); if (post) openDetails(post); }
  const edit = event.target.closest('[data-edit-id], [data-detail-edit]');
  if (edit) { const id = Number(edit.dataset.editId || edit.dataset.detailEdit); const post = state.posts.find((item) => item.id === id); $('#detail-modal').close(); if (post) openPostForm(post); }
  const remove = event.target.closest('[data-delete-id]'); if (remove) deletePost(Number(remove.dataset.deleteId));
  if (event.target.closest('[data-close-modal]')) event.target.closest('dialog').close();
  const more = event.target.closest('[data-date]'); if (more) { const date = new Date(`${more.dataset.date}T12:00:00`); state.month = new Date(date.getFullYear(), date.getMonth(), 1); renderCalendar(); }
  const channelEdit = event.target.closest('[data-channel-edit]');
  if (channelEdit) {
    if (state.role === 'guest') return toast('Гостевой доступ не позволяет изменять каналы.', true);
    const channel = state.channels.find((item) => item.id === Number(channelEdit.dataset.channelEdit)); const name = window.prompt('Новое название канала:', channel?.name || '');
    if (name?.trim()) { try { await api(`/channels/${channel.id}`, { method: 'PATCH', body: JSON.stringify({ name: name.trim() }) }); toast('Канал обновлён.'); await refresh(); } catch (error) { toast(error.message, true); } }
  }
  const channelDelete = event.target.closest('[data-channel-delete]');
  if (channelDelete) {
    const channel = state.channels.find((item) => item.id === Number(channelDelete.dataset.channelDelete));
    if (!window.confirm(`Удалить канал «${channel?.name}»?`)) return;
    try { await api(`/channels/${channel.id}`, { method: 'DELETE' }); toast('Канал удалён.'); await refresh(); } catch (error) { toast(error.message, true); }
  }
});

$('#post-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget; const id = form.elements.id.value;
  const scheduledAt = form.elements.scheduled_at.value ? new Date(form.elements.scheduled_at.value).toISOString() : null;
  const payload = { title: form.elements.title.value.trim(), body: form.elements.body.value.trim(), channel_id: Number(form.elements.channel_id.value), status: form.elements.status.value, scheduled_at: scheduledAt, assignee: form.elements.assignee.value.trim() };
  try { await api(id ? `/posts/${id}` : '/posts', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) }); $('#post-modal').close(); toast(id ? 'Изменения сохранены.' : 'Публикация добавлена.'); await refresh(); }
  catch (error) { $('#post-form-error').textContent = error.message; }
});

$('#channel-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget;
  try { await api('/channels', { method: 'POST', body: JSON.stringify({ name: form.elements.name.value.trim(), platform: form.elements.platform.value }) }); $('#channel-modal').close(); toast('Канал добавлен.'); await refresh(); }
  catch (error) { $('#channel-form-error').textContent = error.message; }
});

$('#previous-month').addEventListener('click', () => { state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1); renderCalendar(); });
$('#next-month').addEventListener('click', () => { state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1); renderCalendar(); });
function goToday() { state.month = new Date(new Date().getFullYear(), new Date().getMonth(), 1); renderCalendar(); }
$('#today-button').addEventListener('click', goToday); $('#calendar-today').addEventListener('click', goToday);
for (const selector of ['#calendar-search', '#channel-filter', '#status-filter']) $(selector).addEventListener('input', renderCalendar);
for (const selector of ['#posts-search', '#posts-status-filter']) $(selector).addEventListener('input', renderPosts);
$('#role-select').value = state.role;
$('#role-select').addEventListener('change', (event) => { state.role = event.target.value; localStorage.setItem('content-desk-role', state.role); toast(`Роль изменена: ${event.target.options[event.target.selectedIndex].text}.`); });
const initialView = ['calendar', 'posts', 'channels'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'calendar'; showView(initialView);
refresh();
