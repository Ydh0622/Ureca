package com.ureca.web.util;

import java.util.Base64;
import java.util.Date;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtTokenProvider {
	private static String salt = Base64.getEncoder().encodeToString("솔트".getBytes());
	
	// Access Token 만료 시간: 30분
	private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000L * 60 * 30;
	
	// Refresh Token 만료 시간: 7일
	private static final long REFRESH_TOKEN_EXPIRE_TIME = 1000L * 60 * 60 * 24 * 7;

	/**
	 * Access Token 생성
	 */
	public static String createAccessToken(String key, String value) {
		Claims claims = Jwts.claims();
		claims.put(key, value);
		claims.put("type", "access"); // 토큰 타입 구분

		Date now = new Date();

		return Jwts.builder()
				.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
				.setClaims(claims)
				.setIssuedAt(now)
				.setExpiration(new Date(now.getTime() + ACCESS_TOKEN_EXPIRE_TIME))
				.signWith(SignatureAlgorithm.HS256, salt)
				.compact();
	}

	/**
	 * Refresh Token 생성
	 */
	public static String createRefreshToken(String key, String value) {
		Claims claims = Jwts.claims();
		claims.put(key, value);
		claims.put("type", "refresh"); // 토큰 타입 구분

		Date now = new Date();

		return Jwts.builder()
				.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
				.setClaims(claims)
				.setIssuedAt(now)
				.setExpiration(new Date(now.getTime() + REFRESH_TOKEN_EXPIRE_TIME))
				.signWith(SignatureAlgorithm.HS256, salt)
				.compact();
	}

	/**
	 * 기존 호환성을 위한 메서드 (Access Token 생성)
	 */
	public static String createToken(String key, String value) {
		return createAccessToken(key, value);
	}

	/**
	 * 토큰 유효성 검증
	 */
	public static boolean validateToken(String jwtToken) {
		try {
			Claims claims = getInformation(jwtToken);
			return !claims.getExpiration().before(new Date());
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * 토큰에서 정보 추출
	 */
	public static Claims getInformation(String jwtToken) {
		return Jwts.parser()
				.setSigningKey(salt)
				.parseClaimsJws(jwtToken)
				.getBody();
	}

	/**
	 * 토큰 타입 확인 (access or refresh)
	 */
	public static String getTokenType(String jwtToken) {
		try {
			Claims claims = getInformation(jwtToken);
			return claims.get("type", String.class);
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * Access Token인지 확인
	 */
	public static boolean isAccessToken(String jwtToken) {
		return "access".equals(getTokenType(jwtToken));
	}

	/**
	 * Refresh Token인지 확인
	 */
	public static boolean isRefreshToken(String jwtToken) {
		return "refresh".equals(getTokenType(jwtToken));
	}
}