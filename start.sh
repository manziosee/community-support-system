#!/bin/bash

echo "🚀 Starting Community Support System..."

exec java -Xmx400m -Dserver.port=8080 -Dserver.address=0.0.0.0 -Dspring.profiles.active=fly -jar app.jar