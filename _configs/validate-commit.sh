#!/bin/bash

BASIC_RED="\033[0;31m"
BASIC_GREEN="\033[0;32m"
BASIC_YELLOW="\033[0;33m"
BASIC_CYAN="\033[0;36m"
ENDCOLOR="\033[0m"

validate_commit_message() {
  echo -e "${BASIC_CYAN}🐶 Validating commit message${ENDCOLOR}"
  npx --no -- commitlint --edit "${1}"
  if [[ $? -ne 0 ]]; then
    echo -e "${BASIC_RED}❌ Commit message validation failed!${ENDCOLOR}"
    echo -e "${BASIC_YELLOW}⚠️ Please update your commit message to follow the required conventions.${ENDCOLOR}"
    exit 1
  fi
}

validate_commit_message "${1}"

echo -e "${BASIC_GREEN}🎉 Commit message is valid!${ENDCOLOR}"
