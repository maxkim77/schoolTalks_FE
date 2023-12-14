document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('access_token');

    // accessToken 만료 확인은 하지 않았습니다.
    if (accessToken) {
        document.querySelector('.loginfield').innerHTML = `
            <button id="logoutButton">Logout</button>
            <button id="createpost">Create</button>
            <button id="profile">Profile</button>
        `;
    }

    // 로그아웃 버튼 클릭 이벤트 리스너
    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = 'login.html'; // 로그인 페이지로 리디렉트
    });

    // 게시물 생성 버튼 클릭 이벤트 리스너
    document.getElementById('createpost').addEventListener('click', function() {
        window.location.href = 'create-post.html';
    });

    // 프로필 버튼 클릭 이벤트 리스너
    document.getElementById('profile').addEventListener('click', function() {
        window.location.href = 'profile.html';
    });
});

// check1. access token이 없으면 로그인 페이지로 리디렉트
// check2. access token이 있는데 만료되었다면 refresh token으로 재발급 시도
// chekc3. access token이 있고 유효하다면 게시물을 불러옵니다.
document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        refreshToken(); // 액세스 토큰이 없으면 리프레시 토큰으로 재발급 시도
    } else {
        fetchPosts();
    }
});

function fetchPosts() {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        // 토큰이 없으면 로그인 페이지로 리디렉트
        window.location.href = 'login.html';
        return;
    }

    fetch('http://127.0.0.1:8000/posts/list/', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(response => {
        if (!response.ok) {
            // 응답이 유효하지 않으면 리프레시 토큰으로 재발급 시도
            refreshToken()
            return;
        }

        let res = response.json();
        return res;
    })
    .then(data => {
        const postsContainer = document.getElementById('posts');
        console.log(data);
        if (data && data.length > 0) {
            data.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `
                
                <div class="post-content">
                    <h3>${post.title}</h3>  <!-- 게시물 제목 -->
                    <p>${post.caption}</p>   <!-- 게시물 내용 -->
                </div>
                <div class="post-footer">
                    <a href="#" class="post-link">더보기</a>  <!-- '더보기' 링크 (상세 페이지로 연결해야 함) -->
                </div>
            `;
                postElement.addEventListener('click', () => {
                    // 게시물 클릭 시 post.html로 이동하며, 게시물 ID를 URL에 포함
                    window.location.href = `post.html?postId=${post.id}`;
                });
                //<img src="${post.image}" alt="Post image">
                postsContainer.appendChild(postElement);
            });
        } else {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `<p>게시물이 없습니다.</p>`;
            postsContainer.appendChild(postElement);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // window.location.href = 'login.html';
    });
}

function refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
        window.location.href = 'login.html';
        return;
    }

    fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: refreshToken })
    })
    .then(response => response.json())
    .then(data => {
        if (data.access) {
            localStorage.setItem('access_token', data.access);
            fetchPosts(); // 액세스 토큰 재발급 후 게시물 다시 불러오기
        } else {
            window.location.href = 'login.html'; // 리프레시 토큰 만료 시 로그인 페이지로
        }
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.href = 'login.html';
    });
}

