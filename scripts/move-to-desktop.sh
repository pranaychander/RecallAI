#!/usr/bin/env bash
# Move the current project folder to the macOS ~/Desktop (or Desktop on other OS)
# Run locally from inside the project folder:
#   bash ./scripts/move-to-desktop.sh
set -euo pipefail
TARGET_NAME="recallai-dashboard"
USER_DESKTOP="${HOME}/Desktop"
CURRENT_DIR="$(pwd)"
PARENT_DIR="$(dirname "$CURRENT_DIR")"
CUR_DIR_NAME="$(basename "$CURRENT_DIR")"

DEST_PATH="$USER_DESKTOP/$TARGET_NAME"

if [ "$CUR_DIR_NAME" = "$TARGET_NAME" ] && [ "$PARENT_DIR" = "$USER_DESKTOP" ]; then
  echo "Project already at $DEST_PATH"
  exit 0
fi

if [ -e "$DEST_PATH" ]; then
  echo "Destination already exists: $DEST_PATH"
  echo "Please remove or rename it before running this script."
  exit 1
fi

# Move the folder
mv "$CURRENT_DIR" "$DEST_PATH"
RET=$?
if [ $RET -ne 0 ]; then
  echo "Move failed (mv exited with $RET). Check permissions and try again."
  exit $RET
fi

echo "Project moved to: $DEST_PATH"
echo "Re-open the project in your editor from that path."
exit 0
