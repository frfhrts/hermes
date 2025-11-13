#!/bin/bash

echo "📦 Installing Hermes dependencies..."
npm install

echo "🔗 Building and linking Hermes globally..."
npm run build
npm link

echo "✅ Success! You can now run 'hermes' from anywhere in your terminal"
echo "💡 To uninstall, run: ./uninstall.sh"