#!/usr/bin/env bash
# Shared guard: this repo must use the meganne0 GitHub account for network git ops.
REQUIRED_USER="meganne0"

active="$(gh api user -q .login 2>/dev/null || true)"
if [[ "$active" != "$REQUIRED_USER" ]]; then
  echo "" >&2
  echo "Blocked: ca-brandkit requires GitHub account '${REQUIRED_USER}'." >&2
  echo "Active account is '${active:-unknown}'." >&2
  echo "" >&2
  echo "You can keep editing locally. When ready to push/pull:" >&2
  echo "  gh auth switch --user ${REQUIRED_USER}" >&2
  echo "" >&2
  exit 1
fi
