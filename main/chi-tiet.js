// COMMENT 
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const loginArea = document.getElementById('login-area');
    const commentFormArea = document.getElementById('comment-form-area');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment-input');
    const commentsList = document.getElementById('comments-list');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const loadMoreBtn = document.getElementById('load-more');
    
    // User state
    let currentUser = null;
    
    // Sample comments data
    const initialComments = [
        {
            id: 1,
            author: 'Minh Tuấn',
            avatar: '/api/placeholder/32/32',
            content: 'Phim hay quá! Pedro Pascal và Bella Ramsey diễn xuất tuyệt vời. Tập đầu tiên đã làm tôi nghẹn ngào rồi.',
            time: '3 giờ trước',
            upvotes: 15,
            downvotes: 2,
            replies: [
                {
                    id: 101,
                    author: 'Thu Hà',
                    avatar: '/api/placeholder/32/32',
                    content: 'Đồng ý! Cảnh mở đầu làm tôi khóc luôn.',
                    time: '2 giờ trước',
                    upvotes: 8,
                    downvotes: 0
                }
            ]
        },
        {
            id: 2, 
            author: 'Ngọc Anh',
            avatar: '/api/placeholder/32/32',
            content: 'Game of Thrones làm tôi thất vọng, nhưng series này thì tuyệt vời. HBO đã làm rất tốt việc chuyển thể từ game.',
            time: '1 ngày trước',
            upvotes: 27,
            downvotes: 3,
            replies: []
        },
        {
            id: 3,
            author: 'Hoàng Nam',
            avatar: '/api/placeholder/32/32',
            content: 'Chất lượng hình ảnh và âm thanh đỉnh cao. Cảm giác như đang xem một bộ phim điện ảnh dài tập.',
            time: '2 ngày trước',
            upvotes: 12,
            downvotes: 1,
            replies: [
                {
                    id: 201,
                    author: 'Thanh Tùng',
                    avatar: '/api/placeholder/32/32',
                    content: 'Đúng vậy! Họ đã đầu tư rất nhiều cho series này.',
                    time: '1 ngày trước',
                    upvotes: 5,
                    downvotes: 0
                },
                {
                    id: 202,
                    author: 'Phương Linh',
                    avatar: '/api/placeholder/32/32',
                    content: 'Tôi đặc biệt thích phần nhạc nền, rất hay!',
                    time: '1 ngày trước',
                    upvotes: 4,
                    downvotes: 0
                }
            ]
        }
    ];
    
    // Mock login/logout functionality
    function login() {
        // In a real app, this would be replaced with actual OAuth flow
        currentUser = {
            name: 'Quang Minh',
            avatar: '/api/placeholder/32/32'
        };
        
        // Update UI
        loginArea.style.display = 'none';
        commentFormArea.style.display = 'block';
        userAvatar.src = currentUser.avatar;
        userName.textContent = currentUser.name;
        
        // Save to local storage
        localStorage.setItem('user', JSON.stringify(currentUser));
    }
    
    function logout() {
        currentUser = null;
        
        // Update UI
        loginArea.style.display = 'block';
        commentFormArea.style.display = 'none';
        
        // Clear from local storage
        localStorage.removeItem('user');
    }
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        loginArea.style.display = 'none';
        commentFormArea.style.display = 'block';
        userAvatar.src = currentUser.avatar;
        userName.textContent = currentUser.name;
    }
    
    // Render comments
    function renderComments(comments) {
        commentsList.innerHTML = '';
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<div class="no-comments">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</div>';
            return;
        }
        
        comments.forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.dataset.id = comment.id;
            
            commentEl.innerHTML = `
                <div class="comment-header">
                    <div class="comment-author">
                        <img src="${comment.avatar}" alt="${comment.author}" class="user-avatar">
                        <div>
                            <div class="user-name">${comment.author}</div>
                            <div class="comment-time">${comment.time}</div>
                        </div>
                    </div>
                </div>
                <div class="comment-content">${comment.content}</div>
                <div class="comment-actions">
                    <button class="action-btn upvote-btn ${comment.userVoted === 'up' ? 'active' : ''}" data-action="upvote">
                        <i class="fas fa-thumbs-up"></i>
                        <span>${comment.upvotes}</span>
                    </button>
                    <button class="action-btn downvote-btn ${comment.userVoted === 'down' ? 'active' : ''}" data-action="downvote">
                        <i class="fas fa-thumbs-down"></i>
                        <span>${comment.downvotes}</span>
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
            
            // Add replies if any
            if (comment.replies && comment.replies.length > 0) {
                const repliesContainer = document.createElement('div');
                repliesContainer.className = 'replies';
                
                comment.replies.forEach(reply => {
                    const replyEl = document.createElement('div');
                    replyEl.className = 'reply';
                    replyEl.dataset.id = reply.id;
                    
                    replyEl.innerHTML = `
                        <div class="comment-header">
                            <div class="comment-author">
                                <img src="${reply.avatar}" alt="${reply.author}" class="user-avatar">
                                <div>
                                    <div class="user-name">${reply.author}</div>
                                    <div class="comment-time">${reply.time}</div>
                                </div>
                            </div>
                        </div>
                        <div class="comment-content">${reply.content}</div>
                        <div class="comment-actions">
                            <button class="action-btn upvote-btn ${reply.userVoted === 'up' ? 'active' : ''}" data-action="upvote">
                                <i class="fas fa-thumbs-up"></i>
                                <span>${reply.upvotes}</span>
                            </button>
                            <button class="action-btn downvote-btn ${reply.userVoted === 'down' ? 'active' : ''}" data-action="downvote">
                                <i class="fas fa-thumbs-down"></i>
                                <span>${reply.downvotes}</span>
                            </button>
                        </div>
                    `;
                    
                    repliesContainer.appendChild(replyEl);
                });
                
                commentEl.appendChild(repliesContainer);
            }
            
            commentsList.appendChild(commentEl);
        });
        
        // Add event listeners to the newly created buttons
        document.querySelectorAll('.reply-btn').forEach(btn => {
            btn.addEventListener('click', handleReplyClick);
        });
        
        document.querySelectorAll('.cancel-reply').forEach(btn => {
            btn.addEventListener('click', handleCancelReply);
        });
        
        document.querySelectorAll('.reply-comment-form').forEach(form => {
            form.addEventListener('submit', handleReplySubmit);
        });
        
        document.querySelectorAll('.upvote-btn, .downvote-btn').forEach(btn => {
            btn.addEventListener('click', handleVote);
        });
    }
    
    // Handle comment form submission
    function handleCommentSubmit(e) {
        e.preventDefault();
        
        if (!currentUser) {
            alert('Vui lòng đăng nhập để bình luận!');
            return;
        }
        
        const content = commentInput.value.trim();
        if (!content) return;
        
        // Create new comment object
        const newComment = {
            id: Date.now(),
            author: currentUser.name,
            avatar: currentUser.avatar,
            content: content,
            time: 'Vừa xong',
            upvotes: 0,
            downvotes: 0,
            replies: []
        };
        
        // Add to comments list
        initialComments.unshift(newComment);
        
        // Update UI
        renderComments(initialComments);
        commentInput.value = '';
        
        // Update comment count
        const countElement = document.querySelector('.comment-count');
        const currentCount = parseInt(countElement.textContent.match(/\d+/)[0]);
        countElement.textContent = `(${currentCount + 1})`;
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
    function handleReplySubmit(e) {
        e.preventDefault();
        
        if (!currentUser) {
            alert('Vui lòng đăng nhập để bình luận!');
            return;
        }
        
        const form = e.target;
        const commentId = parseInt(form.dataset.parent);
        const content = form.querySelector('textarea').value.trim();
        
        if (!content) return;
        
        // Create new reply object
        const newReply = {
            id: Date.now(),
            author: currentUser.name,
            avatar: currentUser.avatar,
            content: content,
            time: 'Vừa xong',
            upvotes: 0,
            downvotes: 0
        };
        
        // Add to parent comment's replies
        const parentComment = initialComments.find(c => c.id === commentId);
        if (parentComment) {
            parentComment.replies.push(newReply);
        }
        
        // Update UI
        renderComments(initialComments);
        
        // Update comment count
        const countElement = document.querySelector('.comment-count');
        const currentCount = parseInt(countElement.textContent.match(/\d+/)[0]);
        countElement.textContent = `(${currentCount + 1})`;
    }
    
    // Handle vote (upvote/downvote)
    function handleVote(e) {
        if (!currentUser) {
            alert('Vui lòng đăng nhập để đánh giá bình luận!');
            return;
        }
        
        const button = e.target.closest('.action-btn');
        const action = button.dataset.action;
        const commentEl = button.closest('.comment, .reply');
        const commentId = parseInt(commentEl.dataset.id);
        
        // Find the comment or reply
        let targetComment = null;
        let isReply = commentEl.classList.contains('reply');
        
        if (isReply) {
            // It's a reply
            for (const comment of initialComments) {
                const reply = comment.replies.find(r => r.id === commentId);
                if (reply) {
                    targetComment = reply;
                    break;
                }
            }
        } else {
            // It's a main comment
            targetComment = initialComments.find(c => c.id === commentId);
        }
        
        if (!targetComment) return;
        
        // Handle voting
        if (action === 'upvote') {
            if (targetComment.userVoted === 'up') {
                // Cancel upvote
                targetComment.upvotes--;
                targetComment.userVoted = null;
            } else {
                // Add upvote
                targetComment.upvotes++;
                
                // Remove downvote if exists
                if (targetComment.userVoted === 'down') {
                    targetComment.downvotes--;
                }
                
                targetComment.userVoted = 'up';
            }
        } else if (action === 'downvote') {
            if (targetComment.userVoted === 'down') {
                // Cancel downvote
                targetComment.downvotes--;
                targetComment.userVoted = null;
            } else {
                // Add downvote
                targetComment.downvotes++;
                
                // Remove upvote if exists
                if (targetComment.userVoted === 'up') {
                    targetComment.upvotes--;
                }
                
                targetComment.userVoted = 'down';
            }
        }
        
        // Update UI
        renderComments(initialComments);
    }
    
    // Event listeners
    loginBtn.addEventListener('click', login);
    logoutBtn.addEventListener('click', logout);
    commentForm.addEventListener('submit', handleCommentSubmit);
    
    loadMoreBtn.addEventListener('click', function() {
        // In a real app, this would load more comments from the server
        alert('Tính năng này sẽ tải thêm bình luận trong ứng dụng thực tế!');
    });
    
    // Initial render
    renderComments(initialComments);
}); document.addEventListener('DOMContentLoaded', function() {
            // DOM elements
            const loginArea = document.getElementById('login-area');
            const commentFormArea = document.getElementById('comment-form-area');
            const loginBtn = document.getElementById('login-btn');
            const logoutBtn = document.getElementById('logout-btn');
            const commentForm = document.getElementById('comment-form');
            const commentInput = document.getElementById('comment-input');
            const commentsList = document.getElementById('comments-list');
            const userAvatar = document.getElementById('user-avatar');
            const userName = document.getElementById('user-name');
            const loadMoreBtn = document.getElementById('load-more');
            
            // User state
            let currentUser = null;
            
            // Sample comments data
            const initialComments = [
                {
                    id: 1,
                    author: 'Minh Tuấn',
                    avatar: 'https://gravatar.com/avatar/ae95d7696e7ddfda5f77becec1b6275e?s=400&d=robohash&r=x',
                    content: 'Phim hay quá! Pedro Pascal và Bella Ramsey diễn xuất tuyệt vời. Tập đầu tiên đã làm tôi nghẹn ngào rồi.',
                    time: '3 giờ trước',
                    upvotes: 15,
                    downvotes: 2,
                    replies: [
                        {
                            id: 101,
                            author: 'Thu Hà',
                            avatar: 'https://gravatar.com/avatar/747ab229cffabcc974ff0127fb22dcef?s=400&d=robohash&r=x',
                            content: 'Đồng ý! Cảnh mở đầu làm tôi khóc luôn.',
                            time: '2 giờ trước',
                            upvotes: 8,
                            downvotes: 0
                        }
                    ]
                },
                {
                    id: 2, 
                    author: 'Ngọc Anh',
                    avatar: 'https://robohash.org/97f12d8012b7284d4c763ab05b9aeffe?set=set4&bgset=&size=400x400',
                    content: 'Game of Thrones làm tôi thất vọng, nhưng series này thì tuyệt vời. HBO đã làm rất tốt việc chuyển thể từ game.',
                    time: '1 ngày trước',
                    upvotes: 27,
                    downvotes: 3,
                    replies: []
                },
                {
                    id: 3,
                    author: 'Hoàng Nam',
                    avatar: 'https://robohash.org/589e9146cfb85e7ff64fc930adc7f886?set=set4&bgset=&size=400x400',
                    content: 'Chất lượng hình ảnh và âm thanh đỉnh cao. Cảm giác như đang xem một bộ phim điện ảnh dài tập.',
                    time: '2 ngày trước',
                    upvotes: 12,
                    downvotes: 1,
                    replies: [
                        {
                            id: 201,
                            author: 'Thanh Tùng',
                            avatar: 'https://robohash.org/6449ffbdc997c734ce720ef77d1c788e?set=set4&bgset=&size=400x400',
                            content: 'Đúng vậy! Họ đã đầu tư rất nhiều cho series này.',
                            time: '1 ngày trước',
                            upvotes: 5,
                            downvotes: 0
                        },
                        {
                            id: 202,
                            author: 'Phương Linh',
                            avatar: 'https://robohash.org/61a6bfe695f4b1d183e3fd20dc9b0899?set=set4&bgset=&size=400x400',
                            content: 'Tôi đặc biệt thích phần nhạc nền, rất hay!',
                            time: '1 ngày trước',
                            upvotes: 4,
                            downvotes: 0
                        }
                    ]
                }
            ];
            
            // Mock login/logout functionality
            function login() {
                // In a real app, this would be replaced with actual OAuth flow
                currentUser = {
                    name: 'Quang Minh',
                    avatar: 'https://gravatar.com/avatar/93007cbdfc4dbb1f94eaad2ceb2411e0?s=400&d=robohash&r=x'
                };
                
                // Update UI
                loginArea.style.display = 'none';
                commentFormArea.style.display = 'block';
                userAvatar.src = currentUser.avatar;
                userName.textContent = currentUser.name;
                
                // Save to local storage
                localStorage.setItem('user', JSON.stringify(currentUser));
            }
            
            function logout() {
                currentUser = null;
                
                // Update UI
                loginArea.style.display = 'block';
                commentFormArea.style.display = 'none';
                
                // Clear from local storage
                localStorage.removeItem('user');
            }
            
            // Check if user is already logged in
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                loginArea.style.display = 'none';
                commentFormArea.style.display = 'block';
                userAvatar.src = currentUser.avatar;
                userName.textContent = currentUser.name;
            }
            
            // Render comments
            function renderComments(comments) {
                commentsList.innerHTML = '';
                
                if (comments.length === 0) {
                    commentsList.innerHTML = '<div class="no-comments">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</div>';
                    return;
                }
                
                comments.forEach(comment => {
                    const commentEl = document.createElement('div');
                    commentEl.className = 'comment';
                    commentEl.dataset.id = comment.id;
                    
                    commentEl.innerHTML = `
                        <div class="comment-header">
                            <div class="comment-author">
                                <img src="${comment.avatar}" alt="${comment.author}" class="user-avatar">
                                <div>
                                    <div class="user-name">${comment.author}</div>
                                    <div class="comment-time">${comment.time}</div>
                                </div>
                            </div>
                        </div>
                        <div class="comment-content">${comment.content}</div>
                        <div class="comment-actions">
                            <button class="action-btn upvote-btn ${comment.userVoted === 'up' ? 'active' : ''}" data-action="upvote">
                                <i class="fas fa-thumbs-up"></i>
                                <span>${comment.upvotes}</span>
                            </button>
                            <button class="action-btn downvote-btn ${comment.userVoted === 'down' ? 'active' : ''}" data-action="downvote">
                                <i class="fas fa-thumbs-down"></i>
                                <span>${comment.downvotes}</span>
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
                    
                    // Add replies if any
                    if (comment.replies && comment.replies.length > 0) {
                        const repliesContainer = document.createElement('div');
                        repliesContainer.className = 'replies';
                        
                        comment.replies.forEach(reply => {
                            const replyEl = document.createElement('div');
                            replyEl.className = 'reply';
                            replyEl.dataset.id = reply.id;
                            
                            replyEl.innerHTML = `
                                <div class="comment-header">
                                    <div class="comment-author">
                                        <img src="${reply.avatar}" alt="${reply.author}" class="user-avatar">
                                        <div>
                                            <div class="user-name">${reply.author}</div>
                                            <div class="comment-time">${reply.time}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="comment-content">${reply.content}</div>
                                <div class="comment-actions">
                                    <button class="action-btn upvote-btn ${reply.userVoted === 'up' ? 'active' : ''}" data-action="upvote">
                                        <i class="fas fa-thumbs-up"></i>
                                        <span>${reply.upvotes}</span>
                                    </button>
                                    <button class="action-btn downvote-btn ${reply.userVoted === 'down' ? 'active' : ''}" data-action="downvote">
                                        <i class="fas fa-thumbs-down"></i>
                                        <span>${reply.downvotes}</span>
                                    </button>
                                </div>
                            `;
                            
                            repliesContainer.appendChild(replyEl);
                        });
                        
                        commentEl.appendChild(repliesContainer);
                    }
                    
                    commentsList.appendChild(commentEl);
                });
                
                // Add event listeners to the newly created buttons
                document.querySelectorAll('.reply-btn').forEach(btn => {
                    btn.addEventListener('click', handleReplyClick);
                });
                
                document.querySelectorAll('.cancel-reply').forEach(btn => {
                    btn.addEventListener('click', handleCancelReply);
                });
                
                document.querySelectorAll('.reply-comment-form').forEach(form => {
                    form.addEventListener('submit', handleReplySubmit);
                });
                
                document.querySelectorAll('.upvote-btn, .downvote-btn').forEach(btn => {
                    btn.addEventListener('click', handleVote);
                });
            }
            
            // Handle comment form submission
            function handleCommentSubmit(e) {
                e.preventDefault();
                
                if (!currentUser) {
                    alert('Vui lòng đăng nhập để bình luận!');
                    return;
                }
                
                const content = commentInput.value.trim();
                if (!content) return;
                
                // Create new comment object
                const newComment = {
                    id: Date.now(),
                    author: currentUser.name,
                    avatar: currentUser.avatar,
                    content: content,
                    time: 'Vừa xong',
                    upvotes: 0,
                    downvotes: 0,
                    replies: []
                };
                
                // Add to comments list
                initialComments.unshift(newComment);
                
                // Update UI
                renderComments(initialComments);
                commentInput.value = '';
                
                // Update comment count
                const countElement = document.querySelector('.comment-count');
                const currentCount = parseInt(countElement.textContent.match(/\d+/)[0]);
                countElement.textContent = `(${currentCount + 1})`;
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
            function handleReplySubmit(e) {
                e.preventDefault();
                
                if (!currentUser) {
                    alert('Vui lòng đăng nhập để bình luận!');
                    return;
                }
                
                const form = e.target;
                const commentId = parseInt(form.dataset.parent);
                const content = form.querySelector('textarea').value.trim();
                
                if (!content) return;
                
                // Create new reply object
                const newReply = {
                    id: Date.now(),
                    author: currentUser.name,
                    avatar: currentUser.avatar,
                    content: content,
                    time: 'Vừa xong',
                    upvotes: 0,
                    downvotes: 0
                };
                
                // Add to parent comment's replies
                const parentComment = initialComments.find(c => c.id === commentId);
                if (parentComment) {
                    parentComment.replies.push(newReply);
                }
                
                // Update UI
                renderComments(initialComments);
                
                // Update comment count
                const countElement = document.querySelector('.comment-count');
                const currentCount = parseInt(countElement.textContent.match(/\d+/)[0]);
                countElement.textContent = `(${currentCount + 1})`;
            }
            
            // Handle vote (upvote/downvote)
            function handleVote(e) {
                if (!currentUser) {
                    alert('Vui lòng đăng nhập để đánh giá bình luận!');
                    return;
                }
                
                const button = e.target.closest('.action-btn');
                const action = button.dataset.action;
                const commentEl = button.closest('.comment, .reply');
                const commentId = parseInt(commentEl.dataset.id);
                
                // Find the comment or reply
                let targetComment = null;
                let isReply = commentEl.classList.contains('reply');
                
                if (isReply) {
                    // It's a reply
                    for (const comment of initialComments) {
                        const reply = comment.replies.find(r => r.id === commentId);
                        if (reply) {
                            targetComment = reply;
                            break;
                        }
                    }
                } else {
                    // It's a main comment
                    targetComment = initialComments.find(c => c.id === commentId);
                }
                
                if (!targetComment) return;
                
                // Handle voting
                if (action === 'upvote') {
                    if (targetComment.userVoted === 'up') {
                        // Cancel upvote
                        targetComment.upvotes--;
                        targetComment.userVoted = null;
                    } else {
                        // Add upvote
                        targetComment.upvotes++;
                        
                        // Remove downvote if exists
                        if (targetComment.userVoted === 'down') {
                            targetComment.downvotes--;
                        }
                        
                        targetComment.userVoted = 'up';
                    }
                } else if (action === 'downvote') {
                    if (targetComment.userVoted === 'down') {
                        // Cancel downvote
                        targetComment.downvotes--;
                        targetComment.userVoted = null;
                    } else {
                        // Add downvote
                        targetComment.downvotes++;
                        
                        // Remove upvote if exists
                        if (targetComment.userVoted === 'up') {
                            targetComment.upvotes--;
                        }
                        
                        targetComment.userVoted = 'down';
                    }
                }
                
                // Update UI
                renderComments(initialComments);
            }
            
            // Event listeners
            loginBtn.addEventListener('click', login);
            logoutBtn.addEventListener('click', logout);
            commentForm.addEventListener('submit', handleCommentSubmit);
            
            loadMoreBtn.addEventListener('click', function() {
                // In a real app, this would load more comments from the server
                alert('Tính năng này sẽ tải thêm bình luận trong ứng dụng thực tế!');
            });
            
            // Initial render
            renderComments(initialComments);
        });






function removeVietnameseTones(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d").replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .trim();
  }
  
// JavaScript for interactive elements
document.addEventListener('DOMContentLoaded', function () {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

});



async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}

async function renderDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const param1 = window.location.search.match(/\?([^=]*)=/)?.[1] || "";
    const param2 = urlParams.get(param1) || "";
    const apiBase = `https://phim.nguonc.com/api/film/${param2}`;
    console.log(apiBase);
    const data = await fetchData(apiBase);
    const movieDetail = data.movie;
    console.log(movieDetail);

    const heroBack = document.querySelector(".hero-container");
    const img = heroBack.querySelector("img");
    console.log(img);
    img.src = movieDetail.poster_url;

    const content = document.querySelector(".movie-info");
    console.log(content);
    const contentHTML = `
    <div class="poster">
                <img src="${movieDetail.thumb_url}" alt="Movie poster">
            </div>
            
            <div class="details">
                <h1 class="title">${movieDetail.name}</h1>
                <h2 class="english-title">${movieDetail.original_name}</h2>
                
                <div class="info-row">
                    <div class="info-item">
                        <i class="fas fa-star"></i>
                        <span>${movieDetail.quality}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-film"></i>
                        <span>${movieDetail.language}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${movieDetail.category["3"]["list"][0]["name"]}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-list"></i>
                        <span>${movieDetail.time}</span>
                    </div>
                </div>
                `;

    const cateHTML = ` <div class="genre-tags">` + movieDetail.category["2"]["list"].map((cate) => {
        return `<a href="../pages/danh-sach.html?the-loai=${removeVietnameseTones(cate.name)}" class="tag">${cate.name}</a>`;
    }).join("") + `</div>`;

    // console.log(contentHTML);

    let current_episode = "";

    if (movieDetail.category["1"]["list"][0]["name"] == "Phim bộ") {
        current_episode = ` <div class="info-item">
                    <i class="fas fa-play-circle"></i>
                    <span> ${movieDetail.current_episode} / ${movieDetail.total_episodes} </span>
                </div>`;
    }
    else {
        current_episode = `<div class="info-item">
                    <i class="fas fa-play-circle"></i>
                    <span> ${movieDetail.current_episode} </span>
                </div>`;
    }
    console.log(current_episode);
    const control = `<div class="action-buttons">
                    <button class="btn btn-primary" id= "xem-ngay">
                        <i class="fas fa-play"></i>
                        Xem Ngay
                    </button>
                    <button class="btn btn-secondary">
                        <i class="fas fa-heart"></i>
                        Yêu thích
                    </button>
                    <button class="btn btn-secondary">
                        <i class="fas fa-plus"></i>
                        Thêm vào
                    </button>
                    <button class="btn btn-secondary">
                        <i class="fas fa-share"></i>
                        Chia sẻ
                    </button>
                    <button class="btn btn-secondary">
                        <i class="fas fa-comment"></i>
                        Bình luận
                    </button>
                </div>
            </div>
            
            <div class="rating-display">
                <div class="rating">8.0</div>
                <div style="text-align: center; margin-top: 5px; font-size: 12px;">Đánh giá</div>
            </div>
        </div>        
    `;
    content.innerHTML = contentHTML + cateHTML + current_episode + control;

    const des = document.querySelector(".des");
    const description = des.querySelector("#description");
    description.innerHTML = movieDetail.description;

    // console.log(movieDetail.episode)
    const controlLang = document.querySelector(".controls-container")
    controlLang.innerHTML = movieDetail.episodes.map((server, index) => {

        return `<div class="control-btn" id ="${index}">
                        <span>${server["server_name"]}</span>
                    </div>`
    }).join("");

    controlLang.querySelector(".control-btn").classList.add("active");
    controlLang.querySelectorAll(".control-btn").forEach((controlBtn) => {
        controlBtn.addEventListener("click", () => {
            controlLang.querySelectorAll(".control-btn").forEach(ep => ep.classList.remove('active'));
            controlBtn.classList.add("active");

            const episode = document.querySelector(".episodes-grid");
            episode.innerHTML = movieDetail.episodes[controlBtn.id]["items"].map((episode) => {
                return `  <div class="episode">
                    <div class="episode-number" id = "${episode.name}">Tập ${episode.name}</div>
                </div>`
            }).join("");

            const episodes = document.querySelectorAll('.episode');

    episodes.forEach(episode => {
        episode.addEventListener('click', function () {
            console.log(episode);

            const episodeNumber = this.querySelector('.episode-number').id;
            console.log(episodeNumber);
            window.location = `/pages/watch.html?phim=${movieDetail.slug}&&tap=${episodeNumber}&&server=${controlBtn.id}`;

        });
    });
        })
    })

    //    controlLang.querySelectorAll(".control-btn").forEach(ep => ep.classList.remove('active'));


    const episode = document.querySelector(".episodes-grid");
    episode.innerHTML = movieDetail.episodes[0]["items"].map((episode) => {
        return `  <div class="episode">
                    <div class="episode-number" id = "${episode.name}">Tập ${episode.name}</div>
                </div>`
    }).join("");



    //demo
    const watch = document.querySelector("#xem-ngay");
    watch.addEventListener("click", () => {
        window.location = `/pages/watch.html?phim=${movieDetail.slug}&&tap=1&&server=0`;

    })

    const episodes = document.querySelectorAll('.episode');

    episodes.forEach(episode => {
        episode.addEventListener('click', function () {
            console.log(episode);

            const episodeNumber = this.querySelector('.episode-number').id;
            console.log(episodeNumber);
            window.location = `/pages/watch.html?phim=${movieDetail.slug}&&tap=${episodeNumber}&&server=0`;

        });
    });


}
document.addEventListener("DOMContentLoaded", renderDetail());


