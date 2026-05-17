/* blog-post.js — renders an individual STEM Club blog post */

document.addEventListener('DOMContentLoaded', () => {
  const posts = window.BLOG_POSTS || [];
  const page = document.querySelector('[data-blog-post-page]');
  if (!page) return;

  const fallbackSlug = document.body.dataset.blogSlug;
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const pathSlug = pathParts[pathParts.length - 1] === 'index.html'
    ? pathParts[pathParts.length - 2]
    : pathParts[pathParts.length - 1];
  const querySlug = new URLSearchParams(window.location.search).get('slug');
  const slug = querySlug || fallbackSlug || pathSlug;
  const post = posts.find(item => item.slug === slug);

  if (!post) {
    renderMissingPost(page, slug);
    return;
  }

  document.title = `${post.title} — The STEM Club Blog`;

  const title = page.querySelector('[data-post-title]');
  const date = page.querySelector('[data-post-date]');
  const summary = page.querySelector('[data-post-summary]');
  const content = page.querySelector('[data-post-content]');
  const hero = page.querySelector('[data-post-hero]');

  if (title) title.textContent = post.title;
  if (date) date.textContent = post.date;
  if (summary) summary.textContent = post.summary;
  if (hero) hero.classList.add(`blog-post-hero-${post.theme}`);
  if (content) {
    content.textContent = '';
    post.content.forEach(block => content.appendChild(createContentBlock(block)));
  }
});

function createContentBlock(block) {
  if (block.type === 'heading') {
    const heading = document.createElement('h2');
    heading.textContent = block.text;
    return heading;
  }

  if (block.type === 'list') {
    const list = document.createElement('ul');
    block.items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      list.appendChild(listItem);
    });
    return list;
  }

  const paragraph = document.createElement('p');
  paragraph.textContent = block.text;
  return paragraph;
}

function renderMissingPost(page, slug) {
  document.title = 'Blog post not found — The STEM Club Blog';
  const title = page.querySelector('[data-post-title]');
  const date = page.querySelector('[data-post-date]');
  const summary = page.querySelector('[data-post-summary]');
  const content = page.querySelector('[data-post-content]');

  if (title) title.textContent = 'Blog post not found';
  if (date) date.textContent = '';
  if (summary) summary.textContent = slug
    ? `We could not find a blog post for “${slug}”.`
    : 'We could not find the blog post you requested.';
  if (content) {
    content.innerHTML = '<p>Please return to the blog list and choose another post.</p>';
  }
}
