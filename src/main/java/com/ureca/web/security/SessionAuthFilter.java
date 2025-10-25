package com.ureca.web.security; // 필터 클래스 전용 패키지로 변경하는 것을 권장합니다.

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ureca.web.model.dto.Member; // Member DTO의 정확한 패키지 경로를 유지해주세요.
import jakarta.servlet.Filter;          // jakarta.servlet.Filter 인터페이스 임포트
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;    // FilterConfig 임포트
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;  // ServletRequest 임포트
import jakarta.servlet.ServletResponse; // ServletResponse 임포트
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

// @Component 애너테이션을 제거합니다. 이제 Spring Security가 아닌 FilterRegistrationBean으로 등록됩니다.
public class SessionAuthFilter implements Filter { // jakarta.servlet.Filter 인터페이스를 구현합니다.

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 필터 초기화 시 필요한 로직을 추가할 수 있습니다.
        // 예를 들어, filterConfig.getInitParameter()를 통해 web.xml(혹은 FilterRegistrationBean)에
        // 설정된 초기화 파라미터를 읽어올 수 있습니다.
        System.out.println("SessionAuthFilter initialized.");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {
    	System.out.println("SessionAuthFilter 작동중...");
        // HttpServletRequest 및 HttpServletResponse로 캐스팅하여 HTTP 관련 기능을 사용합니다.
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // --- 기존 `getPhones` 메소드에서 가져온 검증 로직 ---

        HttpSession session = httpRequest.getSession(false); // 기존 세션이 없으면 새로 생성하지 않습니다.

        // 1. 세션 존재 여부 확인
        if (session == null) {
            handleUnauthorized(httpResponse, "세션이 존재하지 않습니다. 다시 로그인해주세요.");
            return;
        }

        // 2. 세션에 저장된 Member 정보 확인
        Member mem = (Member) session.getAttribute("mem");
        if (mem == null) {
            handleUnauthorized(httpResponse, "로그인 정보가 유효하지 않습니다.");
            return;
        }

        // 3. 세션에 저장된 User-Agent와 현재 요청의 User-Agent 일치 여부 확인
        String storedUserAgent = (String) session.getAttribute("UA");
        String currentUserAgent = httpRequest.getHeader("User-Agent");

        if (storedUserAgent == null || !storedUserAgent.equals(currentUserAgent)) {
            handleUnauthorized(httpResponse, "사용자 환경 정보가 일치하지 않습니다. 비정상적인 접근일 수 있습니다.");
            return;
        }

        // 모든 검증을 통과했다면, 요청을 다음 필터 체인으로 전달합니다.
        filterChain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // 필터가 소멸될 때 필요한 리소스 정리 로직을 추가할 수 있습니다.
        System.out.println("SessionAuthFilter destroyed.");
    }

    // 인증 실패 시 클라이언트에게 JSON 형태로 응답을 보냅니다.
    private void handleUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value()); // HTTP 401 Unauthorized 상태 코드 설정
        response.setContentType(MediaType.APPLICATION_JSON_VALUE); // 응답 타입을 JSON으로 설정
        response.setCharacterEncoding("UTF-8");

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("status", "error");
        errorResponse.put("message", message);

        response.getWriter().write(objectMapper.writeValueAsString(errorResponse)); // JSON 메시지 작성
    }
}