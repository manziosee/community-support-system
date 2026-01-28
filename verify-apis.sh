#!/bin/bash

# API Verification Script for Fly.io Deployment
APP_URL="https://community-support-system.fly.dev"

echo "🔍 Verifying Community Support System APIs on Fly.io..."
echo "🌐 Base URL: $APP_URL"
echo ""

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_pattern=$3
    
    echo -n "  Testing $description... "
    response=$(curl -s -w "%{http_code}" "$APP_URL$endpoint")
    http_code="${response: -3}"
    body="${response%???}"
    
    if [[ "$http_code" == "200" ]] && [[ "$body" =~ $expected_pattern ]]; then
        echo "✅ PASS"
        return 0
    else
        echo "❌ FAIL (HTTP: $http_code)"
        return 1
    fi
}

# Core System Endpoints
echo "🏥 System Health & Documentation:"
test_endpoint "/actuator/health" "Health Check" "UP"
test_endpoint "/swagger-ui.html" "Swagger UI" "Swagger"
test_endpoint "/api-docs" "OpenAPI Docs" "openapi"

echo ""
echo "👥 User Management APIs:"
test_endpoint "/api/users" "Get All Users" "\\["
test_endpoint "/api/users/count/volunteers" "Volunteer Count" "[0-9]+"
test_endpoint "/api/users/count/citizens" "Citizen Count" "[0-9]+"

echo ""
echo "🏛️ Location APIs:"
test_endpoint "/api/locations" "Get All Locations" "\\["
test_endpoint "/api/locations/provinces" "Get Provinces" "\\["

echo ""
echo "📝 Request Management APIs:"
test_endpoint "/api/requests" "Get All Requests" "\\["
test_endpoint "/api/requests/count/pending" "Pending Requests Count" "[0-9]+"

echo ""
echo "🤝 Assignment APIs:"
test_endpoint "/api/assignments" "Get All Assignments" "\\["

echo ""
echo "🔔 Notification APIs:"
test_endpoint "/api/notifications" "Get All Notifications" "\\["

echo ""
echo "🎯 Skills APIs:"
test_endpoint "/api/skills" "Get All Skills" "\\["
test_endpoint "/api/skills/popular" "Popular Skills" "\\["

echo ""
echo "📂 Category APIs:"
test_endpoint "/api/categories" "Get Categories" "\\["

echo ""
echo "🇷🇼 Rwanda Location APIs:"
test_endpoint "/api/rwanda-locations/provinces" "Rwanda Provinces" "\\["

echo ""
echo "🎉 API Verification Complete!"
echo ""
echo "📊 Quick Access URLs:"
echo "  🏥 Health: $APP_URL/actuator/health"
echo "  📚 Swagger: $APP_URL/swagger-ui.html"
echo "  👥 Users: $APP_URL/api/users"
echo "  🏛️ Locations: $APP_URL/api/locations"
echo "  📝 Requests: $APP_URL/api/requests"
echo "  🎯 Skills: $APP_URL/api/skills"