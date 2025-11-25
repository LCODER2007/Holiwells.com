// Admin password (you should change this!)
const ADMIN_PASSWORD = 'holiwells2024';

// Check if already logged in
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('blogAdmin') === 'true';
  if (isLoggedIn) {
    showAdminPanel();
  }
}

// Login function
function login(event) {
  event.preventDefault();
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');

  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('blogAdmin', 'true');
    showAdminPanel();
    errorDiv.style.display = 'none';
  } else {
    errorDiv.textContent = 'Incorrect password. Please try again.';
    errorDiv.style.display = 'block';
  }
  return false;
}

// Logout function
function logout() {
  sessionStorage.removeItem('blogAdmin');
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('password').value = '';
}

// Show admin panel
function showAdminPanel() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  loadPostsList();
}

// Save post
function savePost(event) {
  event.preventDefault();
  
  const title = document.getElementById('postTitle').value;
  const content = document.getElementById('postContent').value;

  const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
  
  const newPost = {
    id: Date.now(),
    title: title,
    content: content,
    date: new Date().toISOString()
  };

  posts.push(newPost);
  localStorage.setItem('blogPosts', JSON.stringify(posts));

  // Clear form
  document.getElementById('postForm').reset();

  // Show success message
  showMessage('Post published successfully!', 'success');

  // Reload posts list
  loadPostsList();

  return false;
}

// Delete post
function deletePost(postId) {
  if (!confirm('Are you sure you want to delete this post?')) {
    return;
  }

  let posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
  posts = posts.filter(post => post.id !== postId);
  localStorage.setItem('blogPosts', JSON.stringify(posts));

  showMessage('Post deleted successfully!', 'success');
  loadPostsList();
}

// Load posts list in admin
function loadPostsList() {
  const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
  const postsListContainer = document.getElementById('postsList');

  if (posts.length === 0) {
    postsListContainer.innerHTML = '<p style="color: #666;">No posts yet.</p>';
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    html += `
      <div class="post-item">
        <h4>${escapeHtml(post.title)}</h4>
        <div class="post-meta">Published: ${formattedDate}</div>
        <p>${escapeHtml(post.content.substring(0, 150))}${post.content.length > 150 ? '...' : ''}</p>
        <button onclick="deletePost(${post.id})" class="btn-danger">Delete</button>
      </div>
    `;
  });

  postsListContainer.innerHTML = html;
}

// Show message
function showMessage(text, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = text;
  messageDiv.className = type === 'success' ? 'alert alert-success' : 'alert alert-error';
  messageDiv.style.display = 'block';

  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Check auth on page load
document.addEventListener('DOMContentLoaded', checkAuth);
