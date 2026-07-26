#!/usr/bin/env bash
# Rename the current repository folder to the canonical project name: recallai-dashboard
# Run this locally from inside the project folder: bash ./scripts/rename-repo.sh
set -euo pipefail
TARGET_NAME="recallai-dashboard"
CUR_DIR_NAME="$(basename "$PWD")"
PARENT_DIR="$(dirname "$PWD")"

if [ "$CUR_DIR_NAME" = "$TARGET_NAME" ]; then
  echo "Folder already named '$TARGET_NAME'"
  exit 0
fi

if [ -e "$PARENT_DIR/$TARGET_NAME" ]; then
  echo "Target path already exists: $PARENT_DIR/$TARGET_NAME"
  echo "Please rename or remove the existing folder and re-run this script."
  exit 1
fi

# Attempt to move the folder
mv "$PWD" "$PARENT_DIR/$TARGET_NAME"
RET=$?
if [ $RET -ne 0 ]; then
  echo "Rename failed (mv exited with $RET). Check permissions and try again."
  exit $RET
fi

echo "Repository folder renamed to: $PARENT_DIR/$TARGET_NAME"
echo "If your editor or terminal set a different working directory, re-open the project at that location."
exit 0
