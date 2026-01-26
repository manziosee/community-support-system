#!/bin/bash

# Community Support System - Render Deployment Script
# This script helps prepare your application for Render deployment

echo "🚀 Community Support System - Render Deployment Preparation"
echo "============================================================"

# Check if Java 21 is installed
echo "📋 Checking Java version..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -ge 21 ]; then
        echo "✅ Java $JAVA_VERSION detected"
    else
        echo "❌ Java 21 or higher required. Current version: $JAVA_VERSION"
        exit 1
    fi
else
    echo "❌ Java not found. Please install Java 21+"
    exit 1
fi

# Check if Maven is installed
echo "📋 Checking Maven..."
if command -v mvn &> /dev/null; then
    echo "✅ Maven detected"
else
    echo "❌ Maven not found. Please install Maven 3.9+"
    exit 1
fi

# Test build
echo "🔨 Testing build..."
if mvn clean package -DskipTests; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please fix build errors before deployment."
    exit 1
fi

# Check for render.yaml
if [ -f "render.yaml" ]; then
    echo "✅ render.yaml found"
else
    echo "❌ render.yaml not found. This file is required for Render deployment."
    exit 1
fi

# Check for required files
echo "📋 Checking required files..."
required_files=("pom.xml" "src/main/resources/application-render.properties" "Dockerfile")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file found"
    else
        echo "❌ $file not found"
        exit 1
    fi
done

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Go to https://render.com and create an account"
echo "3. Click 'New' → 'Web Service'"
echo "4. Connect your GitHub repository"
echo "5. Render will automatically detect render.yaml and configure your service"
echo ""
echo "🔧 Required environment variables will be set automatically:"
echo "   - DATABASE_URL (from database service)"
echo "   - JWT_SECRET (auto-generated)"
echo "   - SPRING_PROFILES_ACTIVE=render"
echo ""
echo "📚 For detailed instructions, see RENDER_DEPLOYMENT.md"
echo ""
echo "🌐 Your app will be available at: https://your-service-name.onrender.com"
echo "🏥 Health check endpoint: https://your-service-name.onrender.com/actuator/health"