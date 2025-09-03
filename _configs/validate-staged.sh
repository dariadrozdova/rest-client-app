#!/bin/bash

BASIC_RED="\033[0;31m"
BASIC_GREEN="\033[0;32m"
BASIC_YELLOW="\033[0;33m"
BASIC_BLUE="\033[0;34m"
BASIC_CYAN="\033[0;36m"
ENDCOLOR="\033[0m"

run_linter () {
  echo -e "${BASIC_CYAN}🧼 Checking for linting errors in the src directory${ENDCOLOR}"
  npx lint-staged
  if [[ $? -ne 0 ]]
  then
    echo -e "${BASIC_RED}❌ Linting failed.${ENDCOLOR}"
    echo -e "${BASIC_YELLOW}⚠️ Please fix the errors and try again.${ENDCOLOR}"
    exit 1
  fi
}

run_tsc () {
  echo -e "${BASIC_BLUE}🌊 Checking for TypeScript errors${ENDCOLOR}"
  npx tsc
  if [[ $? -ne 0 ]]
  then
    echo -e "${BASIC_RED}❌ TypeScript compilation failed.${ENDCOLOR}"
    echo -e "${BASIC_YELLOW}⚠️ Please fix the errors and try again.${ENDCOLOR}"
    exit 1
  fi
}

run_linter
run_tsc

printf "${BASIC_GREEN}❤️‍🔥 All checks have passed. Happy coding!${ENDCOLOR}\n"
