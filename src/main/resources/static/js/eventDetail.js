/**
 * eventDetail.js
 * 특정 이벤트 상세 페이지를 렌더링합니다.
 * (menuDetail.js의 구조를 기반으로 작성됨)
 *
 * @param {object} params - URL에서 추출된 파라미터 (예: { no: '1' })
 * @returns {Promise<string>} 렌더링된 HTML 문자열
 */
async function renderEventDetail(params) {
	const eventNo = params.no;

	if (!eventNo) {
		return `<div class="container py-5 text-center text-danger">유효한 이벤트 ID가 없습니다.</div>`;
	}

	try {
		// 1. 백엔드 API 호출 (이벤트 번호로 조회)
		// (API 주소는 실제 백엔드에 맞게 수정하세요)
		const response = await fetch(`http://localhost:8080/api/event/${eventNo}`);

		// 2. 404 (찾을 수 없음) 처리
		if (!response.ok) {
			if (response.status === 404) {
				return `
          <div class="container py-5 text-center">
            <h2 class="text-warning">죄송합니다. 이벤트 #${eventNo}를 찾을 수 없습니다.</h2>
            <p>잘못된 접근이거나 해당 이벤트가 종료되었을 수 있습니다.</p>
            <p><a href="/event" data-link class="btn btn-secondary mt-3">이벤트 목록으로 돌아가기</a></p>
          </div>
        `;
			}
			// 404 외 다른 서버 에러 (500 등)
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		// 3. 성공: JSON 파싱
		const eventDetail = await response.json();
		console.log("백엔드에서 받은 이벤트 상세 정보:", eventDetail);

        // 4. 상태(status) 값에 따라 배지 HTML 결정
        let statusBadge = '';
        if (eventDetail.status === 'New') {
            statusBadge = '<span class="ms-3 badge bg-success">NEW</span>';
        } else if (eventDetail.status === 'Limited') {
            statusBadge = '<span class="ms-3 badge bg-danger">LIMITED</span>';
        } else if (eventDetail.status === 'Expired') {
            statusBadge = '<span class="ms-3 badge bg-secondary">종료</span>';
        }

		// 5. 기본 정보 HTML 생성 (menuDetail과 유사하게)
		const eventBasicInfoHtml = `
      <div class="row align-items-center">
        <div class="col-md-5 text-center">
          <img src="${eventDetail.imgUrl || 'https://via.placeholder.com/480x600?text=No+Image'}"
               alt="${eventDetail.title || '이벤트명 없음'}" class="img-fluid rounded shadow-sm" style="max-height: 500px; object-fit: contain;">
        </div>
        <div class="col-md-7 mt-4 mt-md-0">
          <h1 class="mb-3 display-4">
            ${eventDetail.title || '이벤트명 없음'}
            ${statusBadge} {/* <-- 상태 배지 삽입 */}
          </h1>
          <p class="lead text-muted">${eventDetail.category || '카테고리 없음'}</p>
          <hr class="my-4">
          <h4 class="text-primary mb-3">기간: ${eventDetail.period || '정보 없음'}</h4>
		  
          {/* (중요) white-space: pre-wrap;
            DB에 저장된 \n (줄바꿈) 문자를 HTML에 그대로 표시해 줍니다.
          */}
		  <p class="item-description" style="white-space: pre-wrap;">${eventDetail.description || '이벤트 상세 설명이 없습니다.'}</p>
        </div>
      </div>
    `;

		// 6. 최종 HTML 조립
		return `
      <div class="container py-5">
        ${eventBasicInfoHtml}

        {/* 페이지 하단 버튼 (목록으로/홈으로) */}
        <div class="mt-5 text-center">
          <a href="/event" data-link class="btn btn-outline-primary btn-lg me-3">
            <i class="bi bi-list"></i> 이벤트 목록으로 돌아가기
          </a>
          <a href="/" data-link class="btn btn-outline-secondary btn-lg">
            <i class="bi bi-house-door"></i> 홈으로 가기
          </a>
        </div>
      </div>
    `;

	} catch (error) {
		// 7. try...catch의 catch 블록 (네트워크 오류 등)
		console.error('이벤트 상세 정보 로드 중 오류 발생:', error);
		return `
      <div class="container py-5 text-center text-danger">
        <h2>오류 발생!</h2>
        <p>이벤트 상세 정보를 불러오는 중 문제가 발생했습니다.</p>
        <p>잠시 후 다시 시도해 주세요.</p>
        <p><a href="/event" data-link class="btn btn-secondary mt-3">이벤트 목록으로 돌아가기</a></p>
      </div>
    `;
	}
}