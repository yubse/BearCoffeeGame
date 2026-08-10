(function () {
  const page = document.body.dataset.sitePage || 'game';
  const isFile = window.location.protocol === 'file:';
  const depth = page === 'game' ? '.' : '..';
  const routes = {
    contact: isFile ? `${depth}/contact/index.html` : '/contact/',
    game: isFile ? `${depth}/index.html` : '/',
    test: isFile ? `${depth}/PBTI/index.html` : '/PBTI/'
  };
  const labels = {
    contact: { zh: '找到我们', en: 'Find Us' },
    game: { zh: '熊熊咖啡屋', en: 'Bear Coffee Club' },
    test: { zh: 'PBTI', en: 'PBTI' }
  };

  const nav = document.createElement('nav');
  nav.className = 'site-hub';
  nav.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Coffee world navigation' : '咖啡世界导航');
  nav.innerHTML = Object.entries(labels).map(([key, label]) =>
      `<a class="site-hub__link" data-route="${key}" href="${routes[key]}"${key === page ? ' aria-current="page"' : ''}><span class="site-hub__label site-hub__label--zh">${label.zh}</span><span class="site-hub__label site-hub__label--en">${label.en}</span></a>`
    ).join('');
  document.body.prepend(nav);

  function syncLanguage() {
    nav.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Coffee world navigation' : '咖啡世界导航');
  }

  new MutationObserver(syncLanguage).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
  });

  const cover = document.createElement('div');
  cover.className = 'site-route-cover';
  cover.setAttribute('aria-hidden', 'true');
  document.body.append(cover);

  function prefetch(link) {
    if (link.dataset.prefetched || isFile || link.origin !== window.location.origin ||
        link.getAttribute('aria-current') === 'page') return;
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
      // External destinations should use the browser's native navigation so
      // going back restores this page without a persisted transition cover.
      if (link.origin !== window.location.origin) return;
      event.preventDefault();
      // The game landing screen calculates its responsive size on first paint.
      // Navigate to it directly so an outgoing full-page cover cannot create a
      // false zoom frame while the new viewport is being established.
      if (link.dataset.route === 'game') {
        window.location.href = link.href;
        return;
      }
      document.documentElement.classList.add('site-is-leaving');
      window.setTimeout(() => { window.location.href = link.href; }, 140);
    });
  });

  window.addEventListener('pageshow', () => {
    document.documentElement.classList.remove('site-is-leaving');
  });
})();
