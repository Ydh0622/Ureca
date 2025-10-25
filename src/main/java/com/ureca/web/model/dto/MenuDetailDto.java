	package com.ureca.web.model.dto;
	
	import java.time.LocalDate;
	import java.util.List;
	
	import lombok.AllArgsConstructor;
	import lombok.Builder;
	import lombok.Data;
	import lombok.NoArgsConstructor;
	
	@Data // Getter, Setter, toString, equals, hashCode 자동 생성
	@NoArgsConstructor // 기본 생성자 자동 생성
	@AllArgsConstructor // 모든 필드를 인자로 받는 생성자 자동 생성
	@Builder // 빌더 패턴 사용 가능하게 함
	public class MenuDetailDto {
	    private int no;
	    private String title;
	    private int price; 
	    private String img;
	    private String cgy;
	    private String description;
	    private List<ApplicableOffer> offers;
	
	    // 내부 클래스로 적용 가능한 요금제/프로모션 조합 정보를 정의합니다.
	    @Data
	    @NoArgsConstructor
	    @AllArgsConstructor
	    @Builder
	    public static class ApplicableOffer {
	    	// item 정보
	    	private int itemId;                     // 메뉴 고유 ID
	    	private String itemName;                // 메뉴 이름 (예: '돌체 콜드 브루')
	    	private String category;                // 카테고리 (예: '콜드 브루', '프라푸치노', '디저트')
	    	private int itemprice;                  // 가격 (예: 5300)
	    	private String sizeOptions;             // 사이즈 옵션 (예: 'Tall / Grande / Venti')
	    	private String calories;                // 칼로리 정보 (예: '200 kcal')
	    	private String ingredients;             // 주요 재료 (예: '콜드 브루 커피, 연유, 우유')
	    	private String allergens;               // 알레르기 정보 (예: '우유 포함')
	   
	    	// Promotion 정보 관련 정보 (시즌 한정, 할인, 이벤트 등)
	    	private Integer promoId;                // 프로모션 ID (null 가능)
	    	private String promoName;               // 프로모션 이름 (예: '겨울 시즌 한정')
	    	private String promoType;               // 프로모션 유형 (예: '신제품', '할인', '시즌 한정')
	    	private Integer discountValue;         // 할인 금액 (null 가능)
	    	private Double discountRate;            // 할인율 (null 가능)
	    	private String promoDescription;        // 프로모션 상세 설명 (예: '돌체 콜드 브루 구매 시 베이커리 20% 할인')
	    	private LocalDate promoStartDate;       // 프로모션 시작일
	    	private LocalDate promoEndDate;         // 프로모션 종료일
	
	    	// menu_item_promotion 테이블의 추가 정보
	    	private int discountAmount;          // 이 조합으로 적용 시 메뉴 할인 금액
	    	private LocalDate offerApplicableStartDate;    // 출시일
	    	private LocalDate offerApplicableEndDate;      // 단종일 (null 가능)
	
	    }
	}