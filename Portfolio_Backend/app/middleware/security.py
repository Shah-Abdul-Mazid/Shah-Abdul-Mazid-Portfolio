import time
from typing import Dict, List, Tuple
from fastapi import Request, Response, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import logging

logger = logging.getLogger("security-middleware")

class SecurityMiddleware(BaseHTTPMiddleware):
    """
    Production-grade Security & Rate Limiting Middleware.
    Implements:
    - In-memory sliding-window IP rate limiting
    - OWASP Top 10 Security Headers
    """
    def __init__(self, app):
        super().__init__(app)
        # In-memory storage for rate limiting: { (ip, route_prefix): [timestamps] }
        self.request_history: Dict[Tuple[str, str], List[float]] = {}
        self.last_cleanup = time.time()

        # Specific rate limit rules: (path_prefix, method, max_requests, window_seconds)
        self.rules = [
            # Strict protection against login brute-forcing: 5 attempts per 5 minutes
            ("/api/admin/login", "POST", 5, 300),
            # Strict protection against contact form spam: 5 submissions per 10 minutes
            ("/api/messages", "POST", 5, 600),
            # SSRF / Scraping protection: 30 requests per minute
            ("/api/portfolio/credly-image", "GET", 30, 60),
            # File uploads: 20 per minute
            ("/api/upload", "POST", 20, 60),
            # AI generation: 15 per minute
            ("/api/agent/generate-project", "POST", 15, 60),
            # General fallback: 180 requests per minute
            ("", "*", 180, 60),
        ]

    def _cleanup_old_entries(self):
        """Purge entries older than 15 minutes to prevent memory leaks."""
        now = time.time()
        if now - self.last_cleanup < 300: # Clean every 5 mins
            return
        self.last_cleanup = now
        cutoff = now - 900
        keys_to_delete = []
        for key, timestamps in self.request_history.items():
            valid_ts = [t for t in timestamps if t > cutoff]
            if valid_ts:
                self.request_history[key] = valid_ts
            else:
                keys_to_delete.append(key)
        for k in keys_to_delete:
            del self.request_history[k]

    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP, taking into account X-Forwarded-For headers from reverse proxies (Render, Cloudflare, etc.)."""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            # First IP in the list is the original client IP
            return forwarded.split(",")[0].strip()
        client = request.client
        return client.host if client else "unknown"

    def _check_rate_limit(self, ip: str, path: str, method: str) -> Tuple[bool, int, int]:
        """
        Evaluates request against rate limit rules.
        Returns: (is_allowed, retry_after_seconds, limit)
        """
        now = time.time()
        self._cleanup_old_entries()

        # Find the most specific matching rule
        matched_rule = None
        for prefix, req_method, max_reqs, window_sec in self.rules:
            if (req_method == "*" or req_method == method) and (prefix == "" or path.startswith(prefix)):
                matched_rule = (prefix, max_reqs, window_sec)
                break

        if not matched_rule:
            return True, 0, 180

        prefix, max_reqs, window_sec = matched_rule
        key = (ip, prefix)
        history = self.request_history.setdefault(key, [])

        # Filter timestamps within current window
        cutoff = now - window_sec
        history = [t for t in history if t > cutoff]
        self.request_history[key] = history

        if len(history) >= max_reqs:
            # Exceeded limit
            oldest = history[0]
            retry_after = int(window_sec - (now - oldest)) + 1
            return False, max(1, retry_after), max_reqs

        history.append(now)
        return True, 0, max_reqs

    async def dispatch(self, request: Request, call_next) -> Response:
        # 1. Skip pre-flight OPTIONS requests from rate limiting
        if request.method == "OPTIONS":
            response = await call_next(request)
            self._inject_security_headers(response)
            return response

        # 2. Check Rate Limit
        client_ip = self._get_client_ip(request)
        path = request.url.path
        allowed, retry_after, limit = self._check_rate_limit(client_ip, path, request.method)

        if not allowed:
            logger.warning(f"🚫 [SECURITY] Rate limit exceeded by {client_ip} on {request.method} {path}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "success": False,
                    "error": "Too Many Requests",
                    "message": f"Rate limit exceeded. Please retry after {retry_after} seconds.",
                    "retry_after": retry_after
                },
                headers={"Retry-After": str(retry_after)}
            )

        # 3. Process Request
        response = await call_next(request)

        # 4. Inject OWASP Security Headers
        self._inject_security_headers(response)
        return response

    def _inject_security_headers(self, response: Response):
        """Applies essential defensive HTTP security headers to all responses."""
        headers = response.headers
        # Prevent MIME type sniffing
        headers["X-Content-Type-Options"] = "nosniff"
        # Prevent Clickjacking
        headers["X-Frame-Options"] = "SAMEORIGIN"
        # Enable browser XSS filtering
        headers["X-XSS-Protection"] = "1; mode=block"
        # Protect referrer privacy
        headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        # Restrict dangerous device permissions
        headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()"
