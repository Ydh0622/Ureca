package com.ureca.web.model.dto;

/**
 * StoreDto (Data Transfer Object)
 * 서비스 계층과 컨트롤러, 프론트엔드 간에 매장 데이터를 전달하기 위한 클래스입니다.
 */
public class StoreDto {
    private String name;    // 매장 이름
    private String address; // 매장 주소
    private double lat;     // 위도
    private double lon;     // 경도

    // 기본 생성자
    public StoreDto() {}

    // --- Getters and Setters ---

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }
}
