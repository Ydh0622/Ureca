// 라우터 네비게이션
const navigateTo = (url) => {
	history.pushState(null, '', url);
	router();
};

// 이벤트 위임으로 data-link 클릭 감지 (closest 사용)
document.addEventListener('DOMContentLoaded', () => {
	document.body.addEventListener('click', (e) => {
		const anchor = e.target.closest('a[data-link]');
		if (!anchor) return;

		const href = anchor.getAttribute('href');
		// 동일 경로 클릭 시 전체 리렌더를 피하고 싶으면 아래 조건 추가 가능
		// if (href === location.pathname) return;

		e.preventDefault();
		navigateTo(href);
	});

	router();
});

window.addEventListener('popstate', router);

// 라우터 (비동기 지원)
async function router() {
	const routes = [
		{ path: "/", view: renderHome },
		{ path: "/mypage", view: renderMyPage },
		{ path: "/signup", view: renderSignup },
		{ path: "/starid", view: renderStarid },
		{ path: "/menu", view: renderMenu },
		{ path: '/menu/:no', view: renderMenuDetail },
		{ path: "/store", view: renderStore },
		{ path: "/event", view: renderEvent },
		{ path: '/event/:no', view: renderEventDetail },
	];

	// 현재 경로와 일치하는 라우트 찾기
	const potentialMatches = routes.map(route => {
		const pathToRegex = new RegExp("^" + route.path.replace(/:([a-zA-Z0-9_]+)/g, '(?<$1>[a-zA-Z0-9_]+)') + "$");
		const match = location.pathname.match(pathToRegex);

		return {
			route: route,
			match: match,
			params: match ? match.groups : null // 매칭된 파라미터 추출
		};
	});

	let match = potentialMatches.find(potentialMatch => potentialMatch.match !== null);

	// 일치하는 라우트가 없으면 기본 경로(routes[0])로 설정
	if (!match) {
		match = {
			route: routes[0],
			match: [location.pathname],
			params: {} // 기본 경로는 파라미터 없음
		};
	}

	const app = document.querySelector('#app');
	if (!app) return;

	// 로딩 상태 표시
	app.innerHTML = '<div class="py-4 text-center text-muted">로딩 중...</div>';

	try {
		// view는 string 또는 Promise<string>을 반환하도록 통일
		const html = await match.route.view(match.params);
		app.innerHTML = html;

		if (match.route.path === "/store") {
			setTimeout(() => {
				initializeStorePage();
			}, 0);
		}


	} catch (err) {
		console.error(err);
		app.innerHTML = '<div class="py-4 text-center text-danger">화면을 불러오지 못했습니다.</div>';
	}
}





