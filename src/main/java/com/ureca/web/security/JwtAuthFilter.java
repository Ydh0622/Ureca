package com.ureca.web.security; // 필터 전용 패키지로 설정합니다.

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ureca.web.util.JwtTokenProvider; // JwtTokenProvider 임포트
import io.jsonwebtoken.Claims;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class JwtAuthFilter implements Filter {

	private final ObjectMapper objectMapper = new ObjectMapper(); // JSON 응답을 위한 ObjectMapper

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		System.out.println("JwtAuthFilter initialized.");
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
			throws IOException, ServletException {
		System.out.println("JwtAuthFilter 작동중...");
		HttpServletRequest httpRequest = (HttpServletRequest) request;
		HttpServletResponse httpResponse = (HttpServletResponse) response;

		// 1. 요청 헤더에서 Authorization 필드를 가져옵니다.
		String authorizationHeader = httpRequest.getHeader("Authorization");

		// 2. Authorization 헤더가 존재하고 "Bearer "로 시작하는지 확인합니다.
		if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
			handleUnauthorized(httpResponse, "JWT 토큰이 없거나 유효하지 않습니다.", false);
			return;
		}

		// 3. "Bearer " 접두사를 제거하고 실제 JWT 토큰만 추출합니다.
		String jwtToken = authorizationHeader.substring(7); // "Bearer ".length() == 7
		System.out.println("가져온 jwt=" + jwtToken);
		try {
			// 4. JwtTokenProvider를 사용하여 토큰의 유효성을 검증합니다.
			// (getInformation 내부에서 서명 검증 및 만료 검증이 이루어집니다.)
			Claims claims = JwtTokenProvider.getInformation(jwtToken);

			// 5. Access Token인지 확인
			if (!JwtTokenProvider.isAccessToken(jwtToken)) {
				handleUnauthorized(httpResponse, "Access Token이 아닙니다.", false);
				return;
			}

			// 6. 토큰이 유효한지 확인
			if (!JwtTokenProvider.validateToken(jwtToken)) {
				// 토큰이 만료된 경우 - 클라이언트에게 refresh 필요함을 알림
				handleUnauthorized(httpResponse, "JWT 토큰이 만료되었습니다.", true);
				return;
			}

			// 7. 토큰에서 추출한 정보를 request 속성으로 저장합니다.
			String userId = claims.get("id", String.class);
			if (userId != null) {
				httpRequest.setAttribute("userId", userId);
			} else {
				handleUnauthorized(httpResponse, "JWT 토큰에 필수 사용자 정보가 누락되었습니다.", false);
				return;
			}
			// 모든 검증을 통과했다면, 요청을 다음 필터 체인으로 전달합니다.
			filterChain.doFilter(request, response);

		} catch (Exception e) {
			// 토큰 파싱 또는 유효성 검증 중 발생하는 모든 예외를 처리합니다.
			System.err.println("JWT authentication failed: " + e.getMessage());
			handleUnauthorized(httpResponse, "JWT 토큰 검증에 실패했습니다.", false);
		}
	}

	@Override
	public void destroy() {
		System.out.println("JwtAuthFilter destroyed.");
	}

	// 인증 실패 시 클라이언트에게 JSON 형태로 응답을 보냅니다.
	private void handleUnauthorized(HttpServletResponse response, String message, boolean needsRefresh)
			throws IOException {
		response.setStatus(HttpStatus.UNAUTHORIZED.value()); // HTTP 401 Unauthorized
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding("UTF-8");

		Map<String, Object> errorResponse = new HashMap<>();
		errorResponse.put("status", "error");
		errorResponse.put("msg", message);
		errorResponse.put("needsRefresh", needsRefresh); // 클라이언트에게 refresh 필요 여부 전달

		response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
	}
}