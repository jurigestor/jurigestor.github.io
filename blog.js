(async () => {
  const list = document.querySelector('#post-list');
  if (!list) return;
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const base = 'https://jurigestor.github.io';
  try {
    const response = await fetch('blog/posts.json');
    if (!response.ok) throw new Error('Falha ao carregar artigos');
    const posts = await response.json();
    const slug = new URLSearchParams(location.search).get('post');
    const post = posts.find(item => item.slug === slug);
    if (post) {
      document.title = `${post.title} | JurisGestor`;
      document.querySelector('meta[name="description"]')?.setAttribute('content', post.description);
      document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${base}/blog.html?post=${encodeURIComponent(post.slug)}`);
      list.className = 'article';
      const sections = post.content.map(([heading, text]) => `<section><h2>${esc(heading)}</h2><p>${esc(text)}</p></section>`).join('');
      list.innerHTML = `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Início</a><span>›</span><a href="blog.html">Blog</a><span>›</span><span>${esc(post.title)}</span></nav><div class="post-meta">${esc(post.category)} · ${post.date}</div><h1>${esc(post.title)}</h1><p class="article-lead">${esc(post.description)}</p><img src="${esc(post.image)}" alt="${esc(post.title)}" width="390" height="768" loading="eager">${sections}<aside class="article-cta"><h2>Organize seu escritório com o JurisGestor</h2><p>Controle prazos, clientes, honorários, audiências e financeiro em um só lugar. Acesso vitalício, funcionamento offline e dados no seu dispositivo.</p><a class="btn-primary" href="index.html#comprar">Conhecer e comprar o JurisGestor</a></aside>`;
      return;
    }
    list.innerHTML = posts.map(item => `<article class="post-card"><img src="${esc(item.image)}" alt="${esc(item.title)}" width="390" height="768" loading="lazy"><div class="post-body"><div class="post-meta">${esc(item.category)} · ${item.date}</div><h2>${esc(item.title)}</h2><p>${esc(item.description)}</p><a class="read" aria-label="Ler artigo: ${esc(item.title)}" href="blog.html?post=${encodeURIComponent(item.slug)}">Ler artigo completo →</a></div></article>`).join('');
  } catch (error) { list.innerHTML = '<p class="empty">Não foi possível carregar os artigos agora.</p>'; console.error(error); }
})();
