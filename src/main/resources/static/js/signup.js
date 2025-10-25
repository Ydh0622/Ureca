// 회원가입 화면
function renderSignup() {
  return `
    <div class="signup-card">
      <h2>회원가입</h2>
      <form id="signupForm">
        <div class="form-group">
          <label for="username">아이디</label>
          <input type="text" id="username" name="username" placeholder="아이디 입력" required>
        </div>
        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" name="email" placeholder="이메일 입력" required>
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" name="password" placeholder="비밀번호 입력" required>
        </div>
        <div class="form-group">
          <label for="confirmPassword">비밀번호 확인</label>
          <input type="password" id="confirmPassword" name="confirmPassword" placeholder="비밀번호 확인" required>
        </div>
        <button type="submit" class="btn-primary">가입하기</button>
      </form>
      <div id="messageArea" style="margin-top: 1rem; text-align: center;"></div>
      <p class="links">이미 계정이 있으신가요? <a href="/mypage" data-link>로그인하기</a></p>
    </div>
  `;
}

// 회원가입 폼 이벤트 핸들러 등록 함수
function attachSignupFormHandler() {
  const signupForm = document.getElementById('signupForm');
  const messageArea = document.getElementById('messageArea');
  
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignupSubmit);
  }
}

// 회원가입 폼 제출 핸들러
async function handleSignupSubmit(event) {
  event.preventDefault();
  
  const messageArea = document.getElementById('messageArea');
  const submitButton = event.target.querySelector('.btn-primary');
  
  // 폼 데이터 수집
  const formData = new FormData(event.target);
  const id = formData.get('username');
  const email = formData.get('email');
  const pw = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');
  
  // 클라이언트 사이드 유효성 검사
  if (!validateSignupForm(id, email, pw, confirmPassword, messageArea)) {
    return;
  }
  
  // 로딩 상태 표시
  showLoadingState(submitButton, messageArea);
  
  try {
    // 서버로 POST 요청 전송
    const response = await fetch('http://localhost:8080/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id,
        email,
        pw
      })
    });
    
    const result = await response.json();
    
    if (result.msg=="success") {
      // 성공 처리
      showSuccessMessage(messageArea, '회원가입이 완료되었습니다!');
      
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigateTo('/mypage');
      }, 3000);
      
    } else {
      // 서버 에러 처리
      showErrorMessage(messageArea, result.msg || '회원가입에 실패했습니다.');
    }
    
  } catch (error) {
    // 네트워크 에러 처리
    console.error('Signup error:', error);
    showErrorMessage(messageArea, '서버와의 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    
  } finally {
    // 로딩 상태 해제
    hideLoadingState(submitButton);
  }
}

// 클라이언트 사이드 유효성 검사
function validateSignupForm(username, email, password, confirmPassword, messageArea) {
  // 아이디 검사 (4-20자, 영문자/숫자만)
  if (username.length < 4 || username.length > 20) {
    showErrorMessage(messageArea, '아이디는 4-20자 사이여야 합니다.');
    return false;
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    showErrorMessage(messageArea, '아이디는 영문자와 숫자만 사용할 수 있습니다.');
    return false;
  }
  
  // 이메일 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showErrorMessage(messageArea, '올바른 이메일 형식을 입력해주세요.');
    return false;
  }
  
  // 비밀번호 검사 (최소 8자, 영문/숫자 조합)
  if (password.length < 8) {
    showErrorMessage(messageArea, '비밀번호는 최소 8자 이상이어야 합니다.');
    return false;
  }
  
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    showErrorMessage(messageArea, '비밀번호는 영문자와 숫자를 모두 포함해야 합니다.');
    return false;
  }
  
  // 비밀번호 확인 검사
  if (password !== confirmPassword) {
    showErrorMessage(messageArea, '비밀번호가 일치하지 않습니다.');
    return false;
  }
  
  return true;
}

// UI 상태 관리 함수들
function showLoadingState(button, messageArea) {
  button.disabled = true;
  button.innerHTML = '<span style="opacity: 0.7;">가입 중...</span>';
  messageArea.innerHTML = '<p style="color: #6b7280; font-size: 0.9rem;">회원가입을 처리하고 있습니다...</p>';
}

function hideLoadingState(button) {
  button.disabled = false;
  button.innerHTML = '가입하기';
}

function showSuccessMessage(messageArea, message) {
  messageArea.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    ">
      ✅ ${message}
      <br><small style="opacity: 0.9; font-weight: 400;">잠시 후 로그인 페이지로 이동합니다...</small>
    </div>
  `;
}

function showErrorMessage(messageArea, message) {
  messageArea.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      padding: 1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    ">
      ❌ ${message}
    </div>
  `;
}

// DOM 변경 감지를 위한 MutationObserver 설정
function setupSignupObserver() {
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        const signupForm = document.getElementById('signupForm');
        if (signupForm && !signupForm.hasAttribute('data-handler-attached')) {
          attachSignupFormHandler();
          signupForm.setAttribute('data-handler-attached', 'true');
        }
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// 페이지 로드 시 옵저버 설정
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupSignupObserver);
} else {
  setupSignupObserver();
}