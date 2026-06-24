const data = window.IP_DATA || [];

const grid = document.querySelector('#grid');
const stats = document.querySelector('#stats');
const topicBar = document.querySelector('#topicBar');
const matchFilter = document.querySelector('#matchFilter');
const priorityFilter = document.querySelector('#priorityFilter');
const dialog = document.querySelector('#detailDialog');
const detailRoot = document.querySelector('#detailRoot');
const closeDialog = document.querySelector('#closeDialog');

const analysisFields = [
  '核心判断（新版）',
  '角色类型', '风格', '是否有固定主角', '是否已有周边', '是否已有毛绒',
  '评论区是否有人求周边', '联系方式', '是否适合做毛绒', '商业化空白',
  '白熊百货匹配度', '合作优先级', '入池状态', '获赞与收藏总量',
  '账号简介', 'IP类型方向（新版）', '角色稳定性（新版）',
  '玩偶化/实体化潜力（新版）', '适合产品类型', '商业化潜力（新版）',
  '合作空间判断（新版）', '明显不适合原因（新版）', '店铺入口',
  '备注'
];
const topicLabels = ['全部', '表情包头像', '动画剧情', '打工人情绪', '动物萌宠', '文创周边', '治愈陪伴', '其他'];
let activeTopic = '全部';

function uniqueValues(field) {
  return [...new Set(data.map(x => x[field]).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

function fillSelect(select, values) {
  values.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  });
}

fillSelect(matchFilter, uniqueValues('白熊百货匹配度'));
fillSelect(priorityFilter, uniqueValues('合作优先级'));

function topicMatches(item, label) {
  if (label === '全部') return true;
  const tags = item._topicTags || [];
  if (label === '其他') return tags.includes('其他') || tags.length <= 1;
  return tags.includes(label);
}

function topicCount(label) {
  return data.filter(item => topicMatches(item, label)).length;
}

function renderTopicBar() {
  topicBar.innerHTML = topicLabels.map(label => `
    <button class="topicBtn ${label === activeTopic ? 'active' : ''}" data-topic="${escapeHtml(label)}">
      ${escapeHtml(label)}<span class="topicCount">${topicCount(label)}</span>
    </button>
  `).join('');
}

function escapeHtml(text = '') {
  return String(text).replace(/[&<>"']/g, s => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[s]));
}

function image(src, cls = '') {
  return src ? `<img class="${cls}" src="${escapeHtml(src)}" loading="lazy" />` : '';
}

function avatarHtml(item) {
  const initial = (item['IP名称'] || item['账号名'] || '?').slice(0, 1);
  const inner = item._avatar
    ? `<img class="avatar" src="${escapeHtml(item._avatar)}" loading="lazy" />`
    : `<div class="avatar avatarPlaceholder">${escapeHtml(initial)}</div>`;
  const href = item['主页链接'] || '#';
  return `<a class="avatarLink" href="${escapeHtml(href)}" target="_blank" rel="noreferrer" title="打开主页" onclick="event.stopPropagation()">${inner}</a>`;
}

function card(item) {
  const cover = item._cover
    ? `<img class="cover" src="${escapeHtml(item._cover)}" loading="lazy" />`
    : `<div class="noCover">暂无图片</div>`;
  const summary = item['核心判断（新版）'] || item['备注'] || item['账号简介'] || '';
  return `<article class="card" data-row="${item._row}">
    <div class="coverWrap">
      ${cover}
      <span class="badge">${escapeHtml(item['合作优先级'] || '未评级')}</span>
    </div>
    <div class="body">
      <div class="author">
        ${avatarHtml(item)}
        <div>
          <h3 class="title">${escapeHtml(item['IP名称'] || item['账号名'])}</h3>
          <div class="handle">${escapeHtml(item['账号名'] || '')} · ${escapeHtml(item['粉丝数'] || '粉丝待补')}</div>
        </div>
      </div>
      <div class="meta">
        ${item['白熊百货匹配度'] ? `<span class="tag">匹配度 ${escapeHtml(item['白熊百货匹配度'])}</span>` : ''}
        ${item['是否适合做毛绒'] ? `<span class="tag">毛绒：${escapeHtml(item['是否适合做毛绒'])}</span>` : ''}
      </div>
    </div>
  </article>`;
}

function matches(item) {
  const m = matchFilter.value;
  const p = priorityFilter.value;
  if (!topicMatches(item, activeTopic)) return false;
  if (m && item['白熊百货匹配度'] !== m) return false;
  if (p && item['合作优先级'] !== p) return false;
  return true;
}

function render() {
  const items = data.filter(matches);
  renderTopicBar();
  grid.innerHTML = items.map(card).join('');
  stats.innerHTML = `
    <span class="pill">总计 ${data.length} 个 IP</span>
    <span class="pill">当前 ${items.length} 个</span>
    <span class="pill">S/A类 ${data.filter(x => /^S|^A/.test(x['合作优先级'] || '')).length} 个</span>
  `;
}

function openDetail(item) {
  const photos = [...(item._posts || [])].filter(Boolean);
  const fieldsHtml = analysisFields
    .filter(f => item[f])
    .map(f => `<div class="field ${f.includes('核心判断') || f.includes('备注') ? 'wide' : ''}"><b>${escapeHtml(f)}</b><span>${escapeHtml(item[f])}</span></div>`)
    .join('');
  detailRoot.innerHTML = `<section class="detail">
    <div class="detailHead">
      <div>
        <h2>${escapeHtml(item['IP名称'] || item['账号名'])}</h2>
        <p class="subtitle">${escapeHtml(item['账号名'] || '')} · 粉丝 ${escapeHtml(item['粉丝数'] || '-')} · 获赞收藏 ${escapeHtml(item['获赞与收藏总量'] || '-')}</p>
      </div>
      ${item['主页链接'] ? `<a class="homeLink" href="${escapeHtml(item['主页链接'])}" target="_blank" rel="noreferrer">打开小红书主页 ↗</a>` : ''}
    </div>
    <div class="photoStrip">
      ${photos.length ? photos.map(src => image(src, '')).join('') : '<div class="noCover">暂无图片</div>'}
    </div>
    <h3 class="sectionTitle">Excel 分析</h3>
    <div class="analysisGrid">${fieldsHtml}</div>
  </section>`;
  dialog.showModal();
}

grid.addEventListener('click', e => {
  const cardEl = e.target.closest('.card');
  if (!cardEl) return;
  const row = Number(cardEl.dataset.row);
  const item = data.find(x => Number(x._row) === row);
  if (item) openDetail(item);
});

closeDialog.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => {
  if (e.target === dialog) dialog.close();
});
topicBar.addEventListener('click', e => {
  const btn = e.target.closest('.topicBtn');
  if (!btn) return;
  activeTopic = btn.dataset.topic;
  render();
});
[matchFilter, priorityFilter].forEach(el => el.addEventListener('input', render));

render();
