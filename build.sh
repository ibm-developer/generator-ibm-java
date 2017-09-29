#!/bin/bash
echo "Build script : version 0.0.1"
echo "Checking if this a PR to development"
if [[ $TRAVIS_BRANCH == "development"  ]]; then
  echo "Build targetting development - checking if this is a PR or not"
  if [[ $TRAVIS_PULL_REQUEST != "false" ]]; then
    echo "Development PR detected, running all tests"
    echo "Running unit tests"
    npm run test
    if [ $? != 0 ]; then
      exit $?
    fi
    echo "Running integration tests"
    npm run testint
    if [ $? != 0 ]; then
      exit $?
    fi
    echo "Running common tests"
    npm run testcommon
    if [ $? != 0 ]; then
      exit $?
    fi
    echo "Running end to end tests"
    npm run teste2e
    if [ $? != 0 ]; then
      exit $?
    fi
  else
    echo "Not a PR, but a build of the branch, so not executing any tests"
  fi
else
    echo "Not targetting development so not executing any tests"
fi
