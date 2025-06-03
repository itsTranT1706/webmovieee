document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    // const loginArea = document.getElementById('login-area');
    const commentFormArea = document.getElementById('comment-form-area');
    const logoutBtn = document.getElementsByClassName('logout');
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment-input');
    const commentsList = document.getElementById('comments-list');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const loadMoreBtn = document.getElementById('load-more');
    

    // User state
    let currentUser = null;
    let accessToken = null;
    let movieId = '10a55f345c206822c64a07d7728aef73'; // Thay bằng movie_id thực tế, có thể lấy từ URL hoặc biến khác
    
    // Base API URL
    const API_BASE_URL = 'http://localhost:8000'; // Thay bằng URL API thực tế, ví dụ: 'https://api.example.com'

    // Check if user is already logged in
    const savedUser = localStorage.getItem('userData');
    accessToken = localStorage.getItem('access_token');
    console.log(accessToken);
    if (savedUser && accessToken) {
        currentUser = JSON.parse(savedUser);
        // loginArea.style.display = 'none';
        commentFormArea.style.display = 'block';
        userAvatar.src = currentUser.avatar || '/api/placeholder/32/32';
        userName.textContent = currentUser.name || currentUser.username;
    }

   
    // Fetch comments from API
    async function fetchComments() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/comment/${movieId}`);
            const comments = await response.json();
            renderComments(comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
            commentsList.innerHTML = '<div class="error">Không thể tải bình luận. Vui lòng thử lại sau.</div>';
        }
    }

    // Fetch replies for a comment
    async function fetchReplies(parentId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/comment/replyList/${parentId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching replies:', error);
            return [];
        }
    }

    // Render comments
    function renderComments(comments) {
        commentsList.innerHTML = '';
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<div class="no-comments">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</div>';
            return;
        }

        comments.forEach(async comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.dataset.id = comment.id;
            
            commentEl.innerHTML = `
                <div class="comment-header">
                    <div class="comment-author">
                        <img src="${comment.avatar || '/api/placeholder/32/32'}" alt="${comment.user.username}" class="user-avatar">
                        <div>
                            <div class="user-name">${comment.user.username}</div>
                            <div class="comment-time">${(new Date(comment.createdAt)).toLocaleDateString('vi-VN')}</div>
                        </div>
                    </div>
                    ${currentUser && currentUser.id === comment.userId ? `
                        <button class="action-btn delete-btn" data-action="delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
                <div class="comment-content">${comment.content}</div>
                <div class="comment-actions">
                    <button class="action-btn upvote-btn ${comment.userVoted === 'up' ? 'active' : ''}" data-action="upvote">
                        <i class="fas fa-thumbs-up"></i>
                        <span>${comment.upvotes || 0}</span>
                    </button>
                    <button class="action-btn downvote-btn ${comment.userVoted === 'down' ? 'active' : ''}" data-action="downvote">
                        <i class="fas fa-thumbs-down"></i>
                        <span>${comment.downvotes || 0}</span>
                    </button>
                    <button class="action-btn reply-btn" data-action="reply">
                        <i class="fas fa-reply"></i>
                        <span>Trả lời</span>
                    </button>
                </div>
                
                <div class="reply-form" id="reply-form-${comment.id}">
                    ${currentUser ? `
                        <form class="comment-form reply-comment-form" data-parent="${comment.id}">
                            <textarea class="comment-input" placeholder="Viết trả lời..."></textarea>
                            <div class="form-actions" style="justify-content: flex-end;">
                                <div>
                                    <button type="button" class="btn-cmt btn-secondary-cmt cancel-reply">Hủy</button>
                                    <button type="submit" class="btn-cmt btn-primary-cmt">Trả lời</button>
                                </div>
                            </div>
                        </form>
                    ` : `
                        <div class="login-prompt" style="margin: 10px 0;">
                            <p class="login-text">Đăng nhập để trả lời bình luận</p>
                        </div>
                    `}
                </div>
            `;
            
            // Fetch and add replies
            const replies = await fetchReplies(comment.id);
            if (replies && replies.length > 0) {
                const repliesContainer = document.createElement('div');
                repliesContainer.className = 'replies';
                
                replies.forEach(reply => {
                    const replyEl = document.createElement('div');
                    replyEl.className = 'reply';
                    replyEl.dataset.id = reply.id;
                    
                    replyEl.innerHTML = `
                        <div class="comment-header">
                            <div class="comment-author">
                                <img src="${reply.avatar || '/api/placeholder/32/32'}" alt="${reply.user.username}" class="user-avatar">
                                <div>
                                    <div class="user-name">${reply.user.username}</div>
                                    <div class="comment-time">${(new Date(reply.createdAt)).toLocaleDateString('vi-VN')}</div>
                                </div>
                            </div>
                            ${currentUser && currentUser.id === reply.userId ? `
                                <button class="action-btn delete-btn" data-action="delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : ''}
                        </div>
                        <div class="comment-content">${reply.content}</div>
                        <div class="comment-actions">
                            <button class="action-btn upvote-btn ${reply.userVoted === 'up' ? 'active' : ''}" data-action="upvote">
                                <i class="fas fa-thumbs-up"></i>
                                <span>${reply.upvotes || 0}</span>
                            </button>
                            <button class="action-btn downvote-btn ${reply.userVoted === 'down' ? 'active' : ''}" data-action="downvote">
                                <i class="fas fa-thumbs-down"></i>
                                <span>${reply.downvotes || 0}</span>
                            </button>
                        </div>
                    `;
                    
                    repliesContainer.appendChild(replyEl);
                });
                
                commentEl.appendChild(repliesContainer);
            }
            
            commentsList.appendChild(commentEl);



             // Add event listeners
        document.querySelectorAll('.reply-btn').forEach(btn => {
            console.log("eyyyy")
            btn.addEventListener('click', handleReplyClick);
        });
        
        document.querySelectorAll('.cancel-reply').forEach(btn => {
            btn.addEventListener('click', handleCancelReply);
        });
        
        document.querySelectorAll('.reply-comment-form').forEach(form => {
            form.addEventListener('submit', handleReplySubmit);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteComment);
        });
        });
        
    }

    // Handle comment form submission
    async function handleCommentSubmit(e) {
        e.preventDefault();
        
        if (!currentUser || !accessToken) {
            alert('Vui lòng đăng nhập để bình luận!');
            return;
        }
        
        const content = commentInput.value.trim();
        if (!content) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/comment/${currentUser.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    movie_id: movieId,
                    content: content
                })
            });
            
            if (response.ok) {
                commentInput.value = '';
                fetchComments();
                // Update comment count
                const countElement = document.querySelector('.comment-count');
                const currentCount = parseInt(countElement.textContent.match(/\d+/)[0]);
                countElement.textContent = `(${currentCount + 1})`;
            } else {
                alert('Không thể gửi bình luận. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Đã có lỗi xảy ra khi gửi bình luận.');
        }
    }

    // Handle reply button click
    function handleReplyClick(e) {
        const commentEl = e.target.closest('.comment');
        const replyForm = commentEl.querySelector('.reply-form');
        
        // Hide all other reply forms
        document.querySelectorAll('.reply-form').forEach(form => {
            if (form !== replyForm) {
                form.style.display = 'none';
            }
        });
        
        // Toggle this reply form
        replyForm.style.display = replyForm.style.display === 'block' ? 'none' : 'block';
    }

    // Handle cancel reply button
    function handleCancelReply(e) {
        const replyForm = e.target.closest('.reply-form');
        replyForm.style.display = 'none';
    }

    // Handle reply form submission
    async function handleReplySubmit(e) {
        e.preventDefault();
        
        if (!currentUser || !accessToken) {
            alert('Vui lòng đăng nhập để bình luận!');
            return;
        }
        
        const form = e.target;
        const commentId = parseInt(form.dataset.parent);
        const content = form.querySelector('textarea').value.trim();
        
        if (!content) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/comment/${currentUser.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    movie_id: movieId,
                    content: content,
                    parent_id: commentId
                })
            });
            
            if (response.ok) {
                form.querySelector('textarea').value = '';
                fetchComments();
                // Update comment count
                const countElement = document.querySelector('.comment-count');
                const currentCount = parseInt(countElement.textContent.match(/\d+/)[0]);
                countElement.textContent = `(${currentCount + 1})`;
            } else {
                alert('Không thể gửi trả lời. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error posting reply:', error);
            alert('Đã có lỗi xảy ra khi gửi trả lời.');
        }
    }

    // Handle delete comment
    async function handleDeleteComment(e) {
        if (!currentUser || !accessToken) {
            alert('Vui lòng đăng nhập để xóa bình luận!');
            return;
        }
        
        const commentEl = e.target.closest('.comment, .reply');
        const commentId = parseInt(commentEl.dataset.id);
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/comment/${currentUser.id}/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if (response.ok) {
                fetchComments();
                // Update comment count
                const countElement = document.querySelector('.comment-count');
                const currentCount = parseInt(countElement.textContent.match(/\d+/)[0]);
                countElement.textContent = `(${currentCount - 1})`;
            } else {
                alert('Không thể xóa bình luận. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Đã có lỗi xảy ra khi xóa bình luận.');
        }
    }

    

    // Event listeners
    // loginBtn.addEventListener('click', login);
    // logoutBtn.addEventListener('click', logout);
    commentForm.addEventListener('submit', handleCommentSubmit);
    
    // Initial render
    fetchComments();
});

