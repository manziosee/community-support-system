package om.community.supportsystem.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory rate limiter for sensitive auth endpoints.
 * Allows MAX_REQUESTS per IP per WINDOW_SECONDS before returning 429.
 * Entries are evicted lazily once the window expires.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);

    private static final int MAX_REQUESTS = 10;
    private static final long WINDOW_SECONDS = 60;

    private static final Set<String> RATE_LIMITED_PATHS = Set.of(
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/forgot-password"
    );

    // key = ip + path, value = [count, windowStartEpochSeconds]
    private final Map<String, long[]> buckets = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return RATE_LIMITED_PATHS.stream().noneMatch(path::startsWith);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String ip = resolveClientIp(request);
        String key = ip + "|" + request.getRequestURI();

        long now = Instant.now().getEpochSecond();
        long[] bucket = buckets.compute(key, (k, existing) -> {
            if (existing == null || now - existing[1] >= WINDOW_SECONDS) {
                return new long[]{1, now};
            }
            existing[0]++;
            return existing;
        });

        long count = bucket[0];
        if (count > MAX_REQUESTS) {
            log.warn("Rate limit exceeded for IP={} path={} count={}", ip, request.getRequestURI(), count);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\",\"status\":429}");
            return;
        }

        chain.doFilter(request, response);
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}