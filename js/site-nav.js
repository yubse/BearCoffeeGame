(function () {
  const page = document.body.dataset.sitePage || 'game';
  const isFile = window.location.protocol === 'file:';
  const depth = page === 'game' ? '.' : '..';
  const routes = {
    game: isFile ? `${depth}/index.html` : '/',
    map: isFile ? `${depth}/map/index.html` : '/map/',
    test: isFile ? `${depth}/coffee-ti/index.html` : '/coffee-ti/'
  };
  const labels = {
    game: ['☕', '咖啡屋'],
    test: ['✦', '熊格测试'],
    map: ['⌖', '咖啡地图']
  };

  const nav = document.createElement('nav');
  nav.className = 'site-hub';
  nav.setAttribute('aria-label', '咖啡世界导航');
  nav.innerHTML = `<a class="site-hub__brand" href="${routes.game}" aria-label="熊熊咖啡世界">☕</a>` +
    Object.entries(labels).map(([key, [, label]]) => key === 'map'
      ? `<span class="site-hub__link site-hub__link--disabled" data-route="${key}" aria-disabled="true"><span>${label}</span><small>未开放</small></span>`
      : `<a class="site-hub__link" data-route="${key}" href="${routes[key]}"${key === page ? ' aria-current="page"' : ''}>${label}</a>`
    ).join('');
  document.body.prepend(nav);

  const cover = document.createElement('div');
  cover.className = 'site-route-cover';
  cover.setAttribute('aria-hidden', 'true');
  document.body.append(cover);

  function prefetch(link) {
    if (link.dataset.prefetched || isFile || link.getAttribute('aria-current') === 'page') return;
    link.dataset.prefetched = 'true';
    const hint = document.createElement('link');
    hint.rel = 'prefetch';
    hint.href = link.href;
    document.head.append(hint);
  }

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('pointerenter', () => prefetch(link), { once: true, passive: true });
    link.addEventListener('touchstart', () => prefetch(link), { once: true, passive: true });
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey ||
          link.target === '_blank' || link.getAttribute('aria-current') === 'page') return;
      event.preventDefault();
      document.documentElement.classList.add('site-is-leaving');
      window.setTimeout(() => { window.location.href = link.href; }, 140);
    });
  });
})();
