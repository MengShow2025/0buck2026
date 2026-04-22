#!/bin/bash
echo "=== 1. CORS OPTIONS PRE-FLIGHT CHECK ==="
curl -s -I -X OPTIONS "https://www.0buck.com/api/v1/auth/me" \
  -H "Origin: https://www.0buck.com" \
  -H "Access-Control-Request-Method: GET" \
  | grep -i "access-control-allow-origin"

echo ""
echo "=== 2. AUTH REDIRECT CHAIN CHECK ==="
# Don't follow redirects, just print headers to see Location
curl -s -I "https://www.0buck.com/api/v1/auth/login/google?redirect=/" | grep -i "location"

echo ""
echo "=== 3. COOKIE & PROFILE PASSTHROUGH CHECK ==="
# 401 means it's correctly expecting the HttpOnly access_token cookie
curl -s -w "\nHTTP_STATUS: %{http_code}\n" "https://www.0buck.com/api/v1/auth/me" \
  -H "Origin: https://www.0buck.com"
