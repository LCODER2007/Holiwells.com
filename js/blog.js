// Load and display blog posts
function loadPosts() {
  const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
  const blogPostsContainer = document.getElementById('blogPosts');

  if (posts.length === 0) {
    blogPostsContainer.innerHTML = `
      <div class="col-12">
        <div class="no-posts">
          <p>No blog posts yet. Check back soon!</p>
        </div>
      </div>
    `;
    return;
  }

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  let html = '';
  posts.forEach(post => {
    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    html += `
      <div class="col-12">
        <div class="blog-post">
          <h3>${escapeHtml(post.title)}</h3>
          <div class="blog-meta">
            <i class="fa fa-calendar" aria-hidden="true"></i> ${formattedDate}
          </div>
          <div class="blog-content">
            ${escapeHtml(post.content).replace(/\n/g, '<br>')}
          </div>
        </div>
      </div>
    `;
  });

  blogPostsContainer.innerHTML = html;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Load posts when page loads
document.addEventListener('DOMContentLoaded', loadPosts);
