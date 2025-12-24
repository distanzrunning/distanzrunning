#!/bin/bash

# This script will update RaceRouteMap to add elevation chart support
# It's safer to do this programmatically to avoid syntax errors

echo "Creating backup..."
cp src/components/RaceRouteMap.tsx src/components/RaceRouteMap.tsx.backup

echo "Script created. Please use Claude to make the edits manually."
echo "The elevation chart component is already created at src/components/ElevationChart.tsx"
