(async () => {
  const list = document.querySelector('#post-list');
  if (!list) return;
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  // Old links used blog.html?post=slug. Redirect them to the new static article page
  // so any shared/indexed links keep working and SEO value isn't lost.
  const legacySlug = new URLSearchParams(location.search).get('post');
  if (legacySlug) {
    location.replace(`blog/${encodeURIComponent(legacySlug)}.html`);
    return;
  }

  try {
    const response = await fetch('blog/posts.json');
    if (!response.ok) throw new Error('Falha ao carregar artigos');
    const posts = await response.json();
    posts.sort((a, b) => (a.date < b.date ? 1 : -1));
    list.innerHTML = posts.map(item => `<article class="post-card"><img src="${esc(item.image)}" alt="${esc(item.title)}" width="390" height="768" loading="lazy"><div class="post-body"><div class="post-meta">${esc(item.category)} · ${item.date}</div><h2>${esc(item.title)}</h2><p>${esc(item.description)}</p><a class="read" aria-label="Ler artigo: ${esc(item.title)}" href="blog/${encodeURIComponent(item.slug)}.html">Ler artigo completo →</a></div></article>`).join('');
  } catch (error) { list.innerHTML = '<p class="empty">Não foi possível carregar os artigos agora.</p>'; console.error(error); }
})();
