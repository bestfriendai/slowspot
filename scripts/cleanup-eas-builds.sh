#!/bin/bash

# Cleanup Old EAS Builds
# Removes old builds from Expo servers to save storage quota

set -e

echo "🗑️  EAS Builds Cleanup - Slow Spot"
echo "===================================="
echo ""

# Check if we're in mobile directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this from the mobile/ directory"
    echo "   cd mobile && ../scripts/cleanup-eas-builds.sh"
    exit 1
fi

# Check if logged in
if ! npx expo whoami &> /dev/null; then
    echo "❌ You're not logged in to Expo"
    echo "   Run: npx expo login"
    exit 1
fi

EXPO_USER=$(npx expo whoami 2>/dev/null)
echo "✅ Logged in as: $EXPO_USER"
echo ""

echo "📊 Fetching build history..."
echo ""

# Get list of builds
BUILD_LIST=$(eas build:list --json --limit=50 2>/dev/null || echo "[]")

if [ "$BUILD_LIST" = "[]" ]; then
    echo "No builds found or error fetching builds."
    exit 0
fi

# Count total builds
TOTAL_BUILDS=$(echo "$BUILD_LIST" | jq '. | length')
echo "Found $TOTAL_BUILDS builds"
echo ""

# Default: keep last 5 builds
KEEP_COUNT=5
echo "This script will keep the $KEEP_COUNT most recent builds and delete the rest."
echo ""
read -p "How many recent builds to keep? [$KEEP_COUNT] " -r
if [[ ! -z "$REPLY" ]]; then
    KEEP_COUNT=$REPLY
fi

echo ""
echo "Configuration:"
echo "  - Total builds: $TOTAL_BUILDS"
echo "  - Keep recent: $KEEP_COUNT"
echo "  - Will delete: $((TOTAL_BUILDS - KEEP_COUNT))"
echo ""

if [ $TOTAL_BUILDS -le $KEEP_COUNT ]; then
    echo "✅ No cleanup needed! You have $TOTAL_BUILDS builds (keeping $KEEP_COUNT)"
    exit 0
fi

read -p "Proceed with deletion? [y/N] " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo ""
echo "🗑️  Deleting old builds..."
echo ""

# Get build IDs to delete (skip first KEEP_COUNT)
BUILD_IDS_TO_DELETE=$(echo "$BUILD_LIST" | jq -r ".[$KEEP_COUNT:] | .[].id")

DELETED_COUNT=0
FAILED_COUNT=0

for BUILD_ID in $BUILD_IDS_TO_DELETE; do
    echo -n "Deleting build $BUILD_ID... "

    if eas build:delete --id "$BUILD_ID" --non-interactive 2>/dev/null; then
        echo "✅"
        DELETED_COUNT=$((DELETED_COUNT + 1))
    else
        echo "❌ (may already be deleted or error)"
        FAILED_COUNT=$((FAILED_COUNT + 1))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Cleanup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Summary:"
echo "  - Deleted: $DELETED_COUNT builds"
echo "  - Failed: $FAILED_COUNT builds"
echo "  - Kept: $KEEP_COUNT recent builds"
echo ""
echo "View remaining builds:"
echo "  https://expo.dev/accounts/$EXPO_USER/projects/slow-spot/builds"
echo ""
