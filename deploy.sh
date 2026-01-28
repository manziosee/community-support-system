#!/bin/bash

set -e

echo "🚀 Community Support System - Fly.io Deployment Script"
echo "======================================================="

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl is not installed. Please install it first."
    exit 1
fi

# Check if we're logged in to Fly.io
if ! flyctl auth whoami &> /dev/null; then
    echo "❌ Not logged in to Fly.io. Please run 'flyctl auth login' first."
    exit 1
fi

echo "✅ Fly.io CLI is ready"

# Check if app exists
if ! flyctl apps list | grep -q "community-support-system"; then
    echo "❌ App 'community-support-system' not found. Please create it first."
    exit 1
fi

echo "✅ App exists"

# Check if database is attached
if ! flyctl secrets list | grep -q "DATABASE_URL"; then
    echo "❌ DATABASE_URL not found. Please attach a database first."
    exit 1
fi

echo "✅ Database is attached"

# Build and deploy
echo "🔨 Building and deploying..."
flyctl deploy --no-cache

# Check deployment status
echo "📊 Checking deployment status..."
sleep 10
flyctl status

# Test the health endpoint
echo "🏥 Testing health endpoint..."
sleep 5
APP_URL=$(flyctl info | grep "Hostname" | awk '{print $2}')
if curl -f "https://$APP_URL/health" > /dev/null 2>&1; then
    echo "✅ Health check passed!"
    echo "🎉 Deployment successful!"
    echo "🌐 Your app is available at: https://$APP_URL"
    echo "📚 API docs: https://$APP_URL/swagger-ui.html"
else
    echo "❌ Health check failed. Checking logs..."
    flyctl logs --no-tail
fi