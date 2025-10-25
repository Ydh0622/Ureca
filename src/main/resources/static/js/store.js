/**
 * store.js
 * '매장찾기' 페이지의 HTML 렌더링과 지도 로직을 담당합니다.
 * 좌측에는 매장 목록, 우측에는 지도가 표시되는 UI를 구현합니다.
 */

// 1. '매장찾기' 페이지의 HTML 구조를 반환하는 함수
function renderStore() {
  return `
    <div class="store-layout">
      <!-- A. 왼쪽: 매장 목록 및 검색 영역 -->
      <div class="store-list-container">
        <div class="store-search-box">
          <h2>매장찾기</h2>
        </div>
        <ul id="store-list" class="store-list-items">
          <!-- 초기 로딩 메시지 -->
          <li class="loading-text">사용자 위치를 확인하는 중...</li>
        </ul>
      </div>
      
      <!-- B. 오른쪽: 지도 영역 -->
      <div id="map" class="map-container"></div>
    </div>
  `;
}

// 2. HTML이 페이지에 삽입된 후, 지도와 목록 관련 로직을 실행하는 함수
function initializeStorePage() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error("지도 컨테이너(#map)를 찾을 수 없습니다.");
    return;
  }

  // 지도 초기화 (서울 중심)
  const map = L.map('map').setView([37.5665, 126.9780], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 3. 사용자의 현재 위치를 요청합니다.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      // 3-1. 위치 요청 성공 시
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        map.setView([lat, lon], 15); // 지도 중심을 현재 위치로 이동
        L.marker([lat, lon]).addTo(map).bindPopup("현재 위치").openPopup();

        // 4. 얻어온 좌표로 백엔드에 매장 정보를 요청합니다.
        fetchAndDisplayStores(lat, lon, map);
      },
      // 3-2. 위치 요청 실패(거부) 시
      () => {
        alert("위치 정보를 가져올 수 없습니다. 기본 위치(강남역)에서 검색합니다.");
        fetchAndDisplayStores(37.4981, 127.0276, map); // 기본 위치로 검색
      }
    );
  } else {
    alert("이 브라우저는 위치 정보 기능을 지원하지 않습니다.");
    document.getElementById('store-list').innerHTML = '<li class="loading-text">위치 정보를 지원하지 않는 브라우저입니다.</li>';
  }

  // SPA 환경에서 지도 크기 계산 오류를 방지하는 코드
  setTimeout(() => map.invalidateSize(), 0);
}

// 4. 백엔드 API를 호출하여 매장 데이터를 가져오고 화면에 표시하는 함수
async function fetchAndDisplayStores(lat, lon, map) {
  const storeList = document.getElementById('store-list');
  storeList.innerHTML = '<li class="loading-text">주변 매장 정보를 불러오는 중...</li>';

  try {
    // 5. Java/Spring으로 만든 백엔드 API 엔드포인트를 호출합니다.
    const response = await fetch(`/api/stores?lat=${lat}&lon=${lon}`);
    if (!response.ok) {
      throw new Error(`서버 응답 오류: ${response.status}`);
    }

    const stores = await response.json();
    
    // 기존 목록 초기화
    storeList.innerHTML = ''; 

    if (stores.length === 0) {
      storeList.innerHTML = '<li class="loading-text">주변에 검색된 매장이 없습니다.</li>';
      return;
    }

    // 6. 받아온 데이터로 목록과 마커를 생성합니다.
    stores.forEach(store => {
      // 목록 아이템 생성
      const listItem = document.createElement('li');
      listItem.className = 'store-list-item';
      listItem.innerHTML = `<h4>${store.name}</h4><p>${store.address || '주소 정보 없음'}</p>`;
      listItem.dataset.lat = store.lat;
      listItem.dataset.lon = store.lon;
      storeList.appendChild(listItem);

      // 지도 마커 생성
      const marker = L.marker([store.lat, store.lon]).addTo(map);
      marker.bindPopup(`<b>${store.name}</b><br>${store.address || ''}`);
    });

    // 목록 클릭 이벤트 추가
    storeList.addEventListener('click', (e) => {
      const clickedItem = e.target.closest('.store-list-item');
      if (clickedItem) {
        map.flyTo([clickedItem.dataset.lat, clickedItem.dataset.lon], 15);
      }
    });

  } catch (error) {
    console.error("매장 정보 로딩 중 오류:", error);
    storeList.innerHTML = `<li class="loading-text" style="color: red;">매장 정보를 불러오는 데 실패했습니다.</li>`;
  }
}

