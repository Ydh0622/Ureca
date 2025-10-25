
let events;

async function renderEvent() {

	if(!events){
		  const response = await fetch('http://localhost:8080/getEvents');
		  
			events = await response.json();
			console.log(events);
		}

		// (수정) '이벤트 카드' 아이템 템플릿
			const cardItem = (event) => {
				const title = event.title ?? '제목 없음';
				const period = event.period ?? '기간 미정';
				const img = event.img ?? 'https://via.placeholder.com/480x600?text=no+Image';
				const no = event.no ?? 0;
				const link = `/event/${no}`;
				const category = event.category ?? '미분류';
				const status = event.status ?? 'Ongoing';


				let badgeHtml = '';
				if (status === 'New') {
					badgeHtml = '<span class="event-badge new">NEW</span>';
				} else if (status === 'Limited') {
					badgeHtml = '<span class="event-badge limited">LIMITED</span>';
				} else if (status === 'Expired') {
					badgeHtml = '<span class="event-badge expired">종료</span>';
				}

				// (수정) HTML 구조를 'event-card'에 맞게 변경
				return `
				  <a href="${link}" class="event-card" data-link data-category="${category}">
					<div class="event-card-img">
					  <img src="${img}" alt="${title}">
					  ${badgeHtml}
					</div>
					<div class="event-card-info">
					  <h3>${title}</h3>
					  <p>${period}</p>
					</div>
				  </a>
				`;
			}; // cardItem 함수 끝

			// (수정) forEach로 누적 (진행/지난 이벤트 분리)
			let ongoingEventsHtml = '';
			let pastEventsHtml = '';

			// (수정) menus.forEach -> events.forEach
			if (events && events.length > 0) {
				events.forEach((event) => {
					if (event.status === 'Expired') {
						pastEventsHtml += cardItem(event);
					} else {
						ongoingEventsHtml += cardItem(event);
					}
				});
			}

			if (ongoingEventsHtml === '') {
				ongoingEventsHtml = `<p class="no-events-message">진행 중인 이벤트가 없습니다.</p>`;
			}
			if (pastEventsHtml === '') {
				pastEventsHtml = `<p class="no-events-message">지난 이벤트가 없습니다.</p>`;
			}

			// (수정) 행 래퍼가 아닌, 이벤트 페이지 전체 래퍼로 감싸서 반환
			return `
				<div class="event-page-container">
				  <div class="event-page-header">
					<h1>이벤트</h1>
					<div class="event-filters">
					  <button class="filter-btn active" data-filter="전체">전체</button>
					  <button class="filter-btn" data-filter="스타벅스 카드">스타벅스 카드</button>
					  <button class="filter-btn" data-filter="스타벅스 리워드">스타벅스 리워드</button>
					  <button class="filter-btn" data-filter="온라인">온라인</button>
					</div>
				  </div>
				  
				  <div class="event-list-section">
					<h2>진행 이벤트</h2>
					<div id="event-grid" class="event-grid">
					  ${ongoingEventsHtml} 
					</div>
				  </div>

				  <div class="event-list-section past-events">
					<h2>지난 이벤트</h2>
					<div id="past-event-grid" class="event-grid">
					  ${pastEventsHtml} 
					</div>
					<div class="load-more-container">
					  <button class="load-more-btn">지난 이벤트 더 보기</button>
					</div>
				  </div>
				</div>
			`;
		}