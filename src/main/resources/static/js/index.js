// Refresh Token을 사용하여 새로운 Access Token 발급
async function refreshAccessToken() {
	const refreshToken = sessionStorage.getItem('refreshToken');

	if (!refreshToken) {
		console.log("Refresh Token이 없습니다. 로그인이 필요합니다.");
		// 로그인 페이지로 리다이렉트
		sessionStorage.clear();
		window.location.href = '/login';
		return null;
	}

	try {
		const response = await fetch('http://localhost:8080/refresh', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${refreshToken}`
			}
		});

		const result = await response.json();

		if (result.msg === 'success' && result.accessToken) {
			// 새로운 Access Token 저장
			sessionStorage.setItem('accessToken', result.accessToken);
			console.log("Access Token이 갱신되었습니다.");
			return result.accessToken;
		} else {
			console.log("Refresh Token이 만료되었습니다. 재로그인이 필요합니다.");
			sessionStorage.clear();
			window.location.href = '/login';
			return null;
		}
	} catch (error) {
		console.error("Token refresh 오류:", error);
		sessionStorage.clear();
		window.location.href = '/login';
		return null;
	}
}

// 원본 fetch 함수를 저장
const originalFetch = window.fetch;

// 전역 fetch 함수를 덮어씌움
window.fetch = async function(resource, options) {
	// 세션 스토리지에서 Access Token을 가져옴
	let token = sessionStorage.getItem('accessToken');

	// 토큰이 존재하면 요청 헤더에 Authorization을 추가
	if (token) {
		options = options || {}; // options가 없을 경우 초기화
		options.headers = {
			...options.headers, // 기존 헤더들을 유지
			'Authorization': `Bearer ${token}` // 'Bearer' 접두사와 함께 토큰 추가
		};
	}

	// 원본 fetch 호출
	let response = await originalFetch(resource, options);

	// 401 Unauthorized 응답이고 needsRefresh가 true인 경우 토큰 갱신 시도
	if (response.status === 401) {
		try {
			const errorData = await response.clone().json();

			if (errorData.needsRefresh === true) {
				console.log("Access Token 만료 감지, 갱신 시도...");

				// 새로운 Access Token 발급
				const newToken = await refreshAccessToken();

				if (newToken) {
					// 새로운 토큰으로 원래 요청 재시도
					options.headers = {
						...options.headers,
						'Authorization': `Bearer ${newToken}`
					};

					console.log("갱신된 토큰으로 요청 재시도");
					response = await originalFetch(resource, options);
				}
			}
		} catch (e) {
			console.error("Token refresh 처리 중 오류:", e);
		}
	}

	return response;
};
;


document.addEventListener('DOMContentLoaded', function() {
	console.log("스타벅스 클론 페이지가 로드되었습니다.");

	if (sessionStorage.getItem("id")) {
		console.log("logined");
		const logoutBtn = document.getElementById("logoutBtn");

		logoutBtn.innerText = "로그아웃";
		logoutBtn.classList.add("btn", "btn-danger");
		logoutBtn.style.cursor = "pointer";
		logoutBtn.style.display = "inline-block";  // 추가
	}

	const navLinks = document.querySelectorAll('.nav .nav-link');

	function setActiveLink(clickedLink) {
		navLinks.forEach(l => l.classList.remove('active'));
		clickedLink.classList.add('active');
	}

	navLinks.forEach(link => {
		link.addEventListener('click', function(event) {
			event.preventDefault();

			setActiveLink(this);

			const linkText = this.textContent.trim();
			console.log(`${linkText} 링크를 클릭했습니다.`);

			switch (linkText) {
				case '메뉴':
					renderMenu();
					break;
				case '매장찾기':
					renderStores();
					break;
				case '이벤트':
					renderEvents();
					break;
				case '주문하기':
					renderOrder();
					break;
				case '로그인':
					renderLogin();
					break;
				default:
					renderHome();
			}
		});
	});



	// 초기 화면 로드 (초기엔 아무 메뉴도 active 아님)
	renderHome();
});

// '로그아웃' 버튼 클릭 이벤트
const logoutBtn = document.querySelector('#logoutBtn');
if (logoutBtn) {
	logoutBtn.addEventListener('click', function(event) {
		fetch('http://localhost:8080/staridLogout');
		sessionStorage.removeItem("id");
		location.href = "/";
	});
}

function renderHome() {
	return `
    <section class="home-banner" style="position: relative; background: url('https://www.starbucks.co.kr/common/img/main/main_visual_230601.jpg') no-repeat center/cover; height: 400px; border-radius: 12px; margin-bottom: 40px; display: flex; justify-content: center; align-items: center;">
      <div style="background: rgba(0, 0, 0, 0.5); padding: 20px; border-radius: 12px; text-align: center; color: #fff;">
        <h1 style="font-size: 3rem; font-weight: 700;">스타벅스에 오신 것을 환영합니다!</h1>
        <p style="font-size: 1.5rem; margin-top: 12px;">진심을 담은 한 잔, 특별한 하루를 만드세요.</p>
		<a href="/menu" data-link
		   style="margin-top: 20px; padding: 12px 32px; background-color: #00704a; border: none; border-radius: 8px; color: white; font-size: 1.1rem; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;">
		    메뉴 보러가기
		</a>
      </div>
    </section>

    <section class="home-features" style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">
      <div style="flex: 1 1 250px; background: #f7f7f7; border-radius: 12px; padding: 24px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center;">
        <h3 style="margin-bottom: 10px; color: #00704a;">신제품 커피</h3>
        <p>완벽한 아침을 위한 부드럽고 진한 아메리카노를 만나보세요.</p>
      </div>
      <div style="flex: 1 1 250px; background: #f7f7f7; border-radius: 12px; padding: 24px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center;">
        <h3 style="margin-bottom: 10px; color: #00704a;">시그니처 라떼</h3>
        <p>부드러운 우유와 진한 에스프레소의 완벽한 조화.</p>
      </div>
      <div style="flex: 1 1 250px; background: #f7f7f7; border-radius: 12px; padding: 24px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center;">
        <h3 style="margin-bottom: 10px; color: #00704a;">카라멜 마끼아또</h3>
        <p>달콤한 카라멜과 부드러운 에스프레소의 만남.</p>
      </div>
    </section>
  `;
}

function renderMenu() {
	return `
    <h2 class="text-center mb-4">대표 메뉴</h2>
    <div style="display:flex; justify-content:center; gap:30px; flex-wrap: wrap;">
      <div style="width:200px; text-align:center; padding: 10px;">
        <p style="font-weight:600; margin-top:10px;">아메리카노</p>
      </div>
      <div style="width:200px; text-align:center; padding: 10px;">
        <p style="font-weight:600; margin-top:10px;">카페 라떼</p>
      </div>
      <div style="width:200px; text-align:center; padding: 10px;">
        <p style="font-weight:600; margin-top:10px;">카라멜 마끼아또</p>
      </div>
    </div>
  `;
}

function renderStores() {
	return `
    <h2 class="text-center mb-4">매장찾기</h2>
    <p class="text-center">매장찾기 기능 구현 예정입니다.</p>
  `;
}

function renderEvents() {
	return `
    <h2 class="text-center mb-4">이벤트</h2>
    <div style="max-width: 600px; margin: 0 auto; border:1px solid #ddd; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
      <h3>2025 가을 맞이 커피 프로모션</h3>
      <p>2025-09-01 ~ 2025-10-31</p>
      <p>가을 시즌 한정 메뉴 및 다양한 혜택을 만나보세요!</p>
      <button onclick="alert('이벤트 상세 페이지 준비 중입니다.')">이벤트 상세 보기</button>
    </div>
  `;
}

function renderOrder() {
	return `
    <h2 class="text-center mb-4">주문하기</h2>
    <p class="text-center">온라인 주문 기능 준비 중입니다.</p>
  `;
}



