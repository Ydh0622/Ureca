// 로그인 화면
function renderStarid() {
	return `
    <div class="starid-card">
      <h2>로그인</h2>
      <form id="staridForm">
        <div class="form-group">
          <label for="starid">아이디</label>
          <input type="text" id="starid" name="starid" placeholder="아이디 입력" required>
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" name="password" placeholder="비밀번호 입력" required>
        </div>
        <button type="submit" class="btn-primary" >로그인</button>
      </form>
      <div class="links">
        <a href="#">아이디/비밀번호 찾기</a> | 
        <a href="/signup" data-link>회원가입</a>
      </div>
	  
	  <div id="messageArea" style="margin-top: 1rem; text-align: center;"></div>
    </div>
  `;
}

// 이벤트 핸들러 등록
function attachStaridFormHandler() {
	const form = document.getElementById("staridForm");
	if (form) {
		form.addEventListener("submit", async e => {
			e.preventDefault();;
			// 실제 로그인 처리 로직 추가 
			// 서버로 POST 요청 전송

			// 폼 데이터 수집
			const formData = new FormData(event.target);
			const id = formData.get('starid');
			const pw = formData.get('password');
			console.log(id, pw);
			const url = 'http://localhost:8080/staridTokenLogin';
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					id,
					pw
				})
			});

			const result = await response.json();

			if (result.msg == "success") {
				// 성공 처리
				showSuccessMessage(messageArea, 'login이 완료되었습니다!');

				sessionStorage.setItem("id", id);

				// Access Token과 Refresh Token 저장
				if (result.accessToken) {
					sessionStorage.setItem("accessToken", result.accessToken);
					console.log("Access Token 저장됨");
				}

				if (result.refreshToken) {
					sessionStorage.setItem("refreshToken", result.refreshToken);
					console.log("Refresh Token 저장됨");
				}
				// 2초 후 홈 페이지로 이동
				setTimeout(() => {
					location.href = "/";
				}, 2000);

			} else {
				// 서버 에러 처리
				showErrorMessage(messageArea, result.msg || 'login에 실패했습니다.');
			}

		});
	}
}

// DOM 변경 감지 → 핸들러 부착
function setupStaridObserver() {
	const observer = new MutationObserver(() => {
		const form = document.getElementById("staridForm");
		if (form && !form.hasAttribute("data-handler-attached")) {
			attachStaridFormHandler();
			form.setAttribute("data-handler-attached", "true");
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", setupStaridObserver);
} else {
	setupStaridObserver();
}
