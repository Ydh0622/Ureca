// 마이페이지 화면
function renderMyPage() {
  return `
    <div class="mypage-card">
      <h2>로그인</h2>
      <p class="subtitle">
        어떤 방법으로 로그인/회원가입 하시겠어요?<br>
      </p>

      <div class="login-grid">
	  <button class="login-btn starid">로그인</button>
        <button class="login-btn kakao">카카오</button>
        <button class="login-btn naver">네이버</button>
        <button class="login-btn google">구글</button>
      </div>

      <div class="keep-login">
        <label><input type="checkbox"> 로그인 상태 유지</label>
      </div>

	  <a href="/signup" data-link class="btn-outline">회원가입 하러 가기</a>

      <div class="links">
        <a href="#">ID / 비밀번호 찾기</a> | 
        <a href="#">비회원주문</a> / 
        <a href="#">주문조회</a>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", e => {
    if (e.target.classList.contains("login-btn") && e.target.classList.contains("starid")) {
      e.preventDefault();
      navigateTo("/starid");
    }
  });
});
