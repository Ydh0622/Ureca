// menuDetail.js

/**
 * 특정 메뉴 상세 페이지를 렌더링합니다.
 * @param {object} params - URL에서 추출된 파라미터 (예: { no: '101' })
 * @returns {Promise<string>} 렌더링된 HTML 문자열
 */
async function renderMenuDetail(params) {
	const menuNo = params.no;

	if (!menuNo) {
		return `<div class="container py-5 text-center text-danger">유효한 메뉴 ID가 없습니다.</div>`;
	}

	try {
		// 백엔드 API 호출: http://localhost:8080/phone/{no}
		const response = await fetch(`http://localhost:8080/menu/${menuNo}`);

		if (!response.ok) {
			if (response.status === 404) {
				return `
          <div class="container py-5 text-center">
            <h2 class="text-warning">죄송합니다, 메뉴 #${menuNo}를 찾을 수 없습니다.</h2>
            <p>잘못된 접근이거나 해당 메뉴가 더 이상 제공되지 않을 수 있습니다.</p>
            <p><a href="/menu" data-link class="btn btn-secondary mt-3">메뉴 목록으로 돌아가기</a></p>
          </div>
        `;
			}
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const menuDetail = await response.json();
		console.log("백엔드에서 받은 메뉴 상세 정보:", menuDetail);

		// 메뉴 기본 정보 렌더링
		const menuBasicInfoHtml = `
      <div class="row align-items-center">
        <div class="col-md-5 text-center">
          <img src="${menuDetail.img || 'https://via.placeholder.com/480x600?text=No+Image'}"
               alt="${menuDetail.title || '메뉴명 없음'}" class="img-fluid rounded shadow-sm" style="max-height: 400px; object-fit: contain;">
        </div>
        <div class="col-md-7 mt-4 mt-md-0">
          <h1 class="mb-3 display-4">${menuDetail.title || '메뉴명 없음'}</h1>
          <p class="lead text-muted">${menuDetail.cgy || '카테고리 없음'}</p>
          <hr class="my-4">
          <h4 class="text-primary mb-3">가격: ${menuDetail.price ? menuDetail.price.toLocaleString() + '원' : '정보 없음'}</h4>
		  <p class="item-description">${menuDetail.description || '메뉴 상세 설명이 없습니다.'}</p>
        </div>
      </div>
    `;

		// 적용 가능한 프로모션 정보 렌더링
		let offersHtml = '<h3 class="mt-5 mb-4 border-bottom pb-2">적용 가능한 할인 및 혜택</h3>';
		if (menuDetail.offers && menuDetail.offers.length > 0) {
			offersHtml += `
	  <div class="accordion" id="promotionsAccordion">
	  `;
			menuDetail.offers.forEach((offer, index) => {
				const collapsedId = `collapsePromo${index}`;
				const headingId = `headingPromo${index}`;
				const isFirst = index === 0;

				const discountSummary = [];
				if (offer.discountAmount && offer.discountAmount > 0) {
					discountSummary.push(`${offer.discountAmount.toLocaleString()}원 할인`);
				}

				const promoPeriod = (offer.promoStartDate && offer.promoEndDate) ?
					`${offer.promoStartDate} ~ ${offer.promoEndDate}` :
					(offer.promoStartDate ? `${offer.promoStartDate} 부터` : '기간 제한 없음');


				offersHtml += `
          <div class="accordion-item">
            <h2 class="accordion-header" id="${headingId}">
              <button class="accordion-button ${isFirst ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapsedId}" aria-expanded="${isFirst ? 'true' : 'false'}" aria-controls="${collapsedId}">
                <strong>${offer.itemName || '메뉴상세설명 없음'}</strong>
				<span class="ms-3 badge ${offer.promoId ? 'bg-success' : 'bg-secondary'}">
					${offer.promoName || (offer.promoId ? '혜택 적용' : '기본 메뉴')} 
				</span>
                ${discountSummary.length > 0 ? `<span class="ms-2 text-danger">(${discountSummary.join(', ')})</span>` : ''}
              </button>
            </h2>
            <div id="${collapsedId}" class="accordion-collapse collapse ${isFirst ? 'show' : ''}" aria-labelledby="${headingId}" data-bs-parent="#promotionsAccordion">
              <div class="accordion-body">
                <ul class="list-group list-group-flush mb-3">
				<li class="list-group-item"><strong>가격:</strong> ${offer.itemprice ? offer.itemprice.toLocaleString() + '원' : '정보 없음'}</li>
				<li class="list-group-item"><strong>카테고리:</strong> ${offer.category || '정보 없음'}</li>
				<li class="list-group-item"><strong>용량/사이즈:</strong> ${offer.sizeOptions || '정보 없음'}</li>
				<li class="list-group-item"><strong>주요 재료:</strong> ${offer.ingredients || '정보 없음'}</li>
				<li class="list-group-item"><strong>알레르기 정보:</strong> ${offer.allergens || '정보 없음'}</li>

				${offer.promoId ? `
					<li class="list-group-item"><strong>적용 혜택:</strong> ${offer.promoName || '혜택명 없음'}</li>
					<li class="list-group-item"><strong>혜택 유형:</strong> ${offer.promoType || '정보 없음'}</li>
				    ${offer.discountValue ? `<li class="list-group-item"><strong>할인 금액:</strong> ${offer.discountValue.toLocaleString()}원</li>` : ''}
				    ${offer.discountRate ? `<li class="list-group-item"><strong>할인율:</strong> ${offer.discountRate}%</li>` : ''}
				    <li class="list-group-item"><strong>혜택 설명:</strong> ${offer.promoDescription || '설명 없음'}</li>
				    <li class="list-group-item"><strong>혜택 기간:</strong> ${promoPeriod}</li>
					` : ''}
					${offer.offerApplicableStartDate ? `<li class="list-group-item"><strong>혜택 적용 기간:</strong> ${offer.offerApplicableStartDate || ''} ~ ${offer.offerApplicableEndDate || '제한 없음'}</li>` : ''}
					</ul>
              </div>
            </div>
          </div>
        `;
			});
			offersHtml += `</div>`;
		} else {
			offersHtml += `<p class="text-muted">현재 이 제품에 적용 가능한 할인 및 혜택 정보가 없습니다..</p>`;
		}

		// 최종 HTML 구성
		return `
      <div class="container py-5">
        ${menuBasicInfoHtml}
        ${offersHtml}

        <div class="mt-5 text-center">
          <a href="/menu" data-link class="btn btn-outline-primary btn-lg me-3">
            <i class="bi bi-list"></i> 목록으로 돌아가기
          </a>
          <a href="/" data-link class="btn btn-outline-secondary btn-lg">
            <i class="bi bi-house-door"></i> 홈으로 가기
          </a>
        </div>
      </div>
    `;

	} catch (error) {
		console.error('메뉴 상세 정보 로드 중 오류 발생:', error);
		return `
      <div class="container py-5 text-center text-danger">
        <h2>오류 발생!</h2>
        <p>메뉴 상세 정보를 불러오는 중 문제가 발생했습니다.</p>
        <p>잠시 후 다시 시도해 주세요.</p>
        <p><a href="/menu" data-link class="btn btn-secondary mt-3">메뉴 목록으로 돌아가기</a></p>
      </div>
    `;
	}
}
