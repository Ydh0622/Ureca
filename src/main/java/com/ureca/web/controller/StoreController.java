package com.ureca.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ureca.web.model.dto.StoreDto;
import com.ureca.web.model.service.StoreService;

@RestController
@RequestMapping("/api") // URL 경로의 공통부분을 지정
public class StoreController { // 클래스 이름은 대문자로 시작하는 것이 관례입니다 (Storecontroller -> StoreController)
	
	@Autowired
	private StoreService storeService; // 비즈니스 로직을 처리할 서비스 클래스

    /**
     * 프론트엔드(store.js)에서 호출할 API 엔드포인트
     * @param lat 위도
     * @param lon 경도
     * @return 주변 매장 목록 (JSON)
     */
    @GetMapping("/stores") // 최종 경로는 /api/stores
    public ResponseEntity<List<StoreDto>> getNearbyStores(
            @RequestParam("lat") double lat,
            @RequestParam("lon") double lon) {
        
        try {
            // 반경 5km (5000m) 내의 매장을 검색합니다.
            List<StoreDto> stores = storeService.findNearbyStores(lat, lon, 5000);
            return ResponseEntity.ok(stores); // 성공 시 200 OK 상태와 함께 매장 목록 반환
        } catch (Exception e) {
            // 오류 발생 시 서버 로그를 남기고, 500 Internal Server Error를 반환합니다.
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
