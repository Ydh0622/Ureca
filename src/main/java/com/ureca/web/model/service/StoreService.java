package com.ureca.web.model.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ureca.web.model.dto.StoreDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class StoreService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";

    public List<StoreDto> findNearbyStores(double lat, double lon, int radius) throws Exception {
        
        String query = String.format(
            "[out:json];" +
            "(" +
            "  node[~\"brand|name\"~\"Starbucks\",i](around:%d,%.6f,%.6f);" +
            "  way[~\"brand|name\"~\"Starbucks\",i](around:%d,%.6f,%.6f);" +
            "  relation[~\"brand|name\"~\"Starbucks\",i](around:%d,%.6f,%.6f);" +
            ");" +
            "out center;",
            radius, lat, lon, radius, lat, lon, radius, lat, lon
        );

        String responseBody = restTemplate.postForObject(OVERPASS_API_URL, query, String.class);

        // ✅ [디버깅 추가 1] OpenStreetMap API의 원본 응답을 STS 콘솔에 출력합니다.
        System.out.println("================ Overpass API Raw Response ================");
        System.out.println(responseBody);
        System.out.println("==========================================================");

        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode elements = root.path("elements");
        
        List<StoreDto> stores = new ArrayList<>();
        if (elements.isArray()) {
            for (JsonNode element : elements) {
                JsonNode tags = element.path("tags");
                String name = tags.path("name").asText("이름 없음");

                // ✅ [디버깅 추가 2] 스타벅스 필터링을 잠시 비활성화하고 모든 결과를 추가합니다.
                // if (name.contains("스타벅스") || name.toLowerCase().contains("starbucks")) {
                    StoreDto store = new StoreDto();
                    store.setName(name);

                    String address = String.format("%s %s %s",
                        tags.path("addr:city").asText(""),
                        tags.path("addr:street").asText(""),
                        tags.path("addr:housenumber").asText("")
                    ).trim();
                    store.setAddress(address.isEmpty() ? "주소 정보 없음" : address);

                    if (element.has("lat")) {
                        store.setLat(element.path("lat").asDouble());
                        store.setLon(element.path("lon").asDouble());
                    } else if (element.has("center")) {
                        JsonNode center = element.path("center");
                        store.setLat(center.path("lat").asDouble());
                        store.setLon(center.path("lon").asDouble());
                    }
                    stores.add(store);
                // } // 필터링 조건 끝
            }
        }
        return stores;
    }
}

