#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_PATH="$SCRIPT_DIR/../jest.config.js"

if ! grep -q "preset: 'react-native'" "$CONFIG_PATH"; then
  echo "❌ Could not find preset: 'react-native' in jest.config.js"
  exit 1
fi

sed -i.bak "s/preset: 'react-native'/preset: '@react-native\/jest-preset'/" "$CONFIG_PATH"
rm -f "$CONFIG_PATH.bak"
echo "✅ jest.config.js patched: preset set to @react-native/jest-preset"
