package com.ureca.web.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.ureca.web.model.StarException;
import com.ureca.web.model.dto.Member;
import com.ureca.web.model.service.MemberService;
import com.ureca.web.util.JwtTokenProvider;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
public class LoginController {

	@Autowired
	MemberService memberService;

	@PostMapping("/staridTokenLogin")
	public Map<String, Object> staridLogin(@RequestBody Member m, HttpServletRequest request) {
		System.out.println(m);
		Map<String, Object> response = new HashMap();

		try {
			Member mem = memberService.staridLogin(m);
			System.out.println(mem);
			if (mem != null) {
				HttpSession session = request.getSession();
				session.setAttribute("mem", mem);
				response.put("msg", "success");
			} else {
				response.put("msg", "id와 pw를 확인해주세요");
			}

		} catch (Exception e) {
			response.put("msg", e.getMessage());
			// e.printStackTrace();
		}

		return response;
	}

	/**
	 * Refresh Token을 사용하여 새로운 Access Token 발급
	 */
	@PostMapping("/refresh")
	public Map<String, Object> refreshToken(@RequestHeader("Authorization") String authHeader) {
		Map<String, Object> response = new HashMap();
		
		try {
			// Authorization 헤더에서 토큰 추출
			if (authHeader == null || !authHeader.startsWith("Bearer ")) {
				response.put("msg", "Refresh Token이 필요합니다");
				return response;
			}
			
			String refreshToken = authHeader.substring(7);
			
			// Refresh Token 유효성 검증
			if (!JwtTokenProvider.validateToken(refreshToken)) {
				response.put("msg", "유효하지 않거나 만료된 Refresh Token입니다");
				return response;
			}
			
			// Refresh Token 타입 확인
			if (!JwtTokenProvider.isRefreshToken(refreshToken)) {
				response.put("msg", "Refresh Token이 아닙니다");
				return response;
			}
			
			// Refresh Token에서 사용자 정보 추출
			Claims claims = JwtTokenProvider.getInformation(refreshToken);
			String userId = claims.get("id", String.class);
			
			if (userId == null) {
				response.put("msg", "토큰에 사용자 정보가 없습니다");
				return response;
			}
			
			// 새로운 Access Token 발급
			String newAccessToken = JwtTokenProvider.createAccessToken("id", userId);
			
			response.put("msg", "success");
			response.put("accessToken", newAccessToken);
			
			System.out.println("Access Token 갱신 성공 - 사용자: " + userId);
			
		} catch (Exception e) {
			System.err.println("Refresh Token 처리 오류: " + e.getMessage());
			response.put("msg", "토큰 갱신에 실패했습니다");
		}
		
		return response;
	}

	@GetMapping("staridLogout")
	public String staridLogout(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.invalidate();
			return null;
		} else {
			// 침해 대응 코드
			return "Get out!";
		}
	}

}
