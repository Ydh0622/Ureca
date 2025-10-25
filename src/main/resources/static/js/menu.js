
let menus;

async function renderMenu() {

	if(!menus){
		  const response = await fetch('http://localhost:8080/getMenus');
		  
			menus = await response.json();
			console.log(menus);
		}

	// 카드 아이템 템플릿
	const cardItem = (item) => {
		const title = item.title ?? 'Untitled';
		const price = item.price ?? 0;
		const img = item.img ?? 'https://via.placeholder.com/480x600?text=no+Image';
		const link = item.link ?? '/menu/';
		const no = item.no ?? 0;

		return `
		      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
		        <div class="card h-100">
		          <img class="card-img-top" src="${img}" alt="${title}">
		          <div class="card-body">
		            <h5 class="card-title">${title}</h5>
		            <p class="card-text">${price}</p>
		            <a href="${link}${no}" class="btn btn-primary" data-link>상세 정보 보기</a>
		          </div>
		        </div>
		      </div>
		    `;
		  };

		  // forEach로 누적
		  let itemsHtml = '';
		  menus.forEach((it) => {
		    itemsHtml += cardItem(it);
		  });

		  // 행 래퍼로 감싸서 반환
		  return `
		    <div class="row g-3">
		      ${itemsHtml}
		    </div>
		  `;
		}


