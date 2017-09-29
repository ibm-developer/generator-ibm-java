#!/bin/bash
echo "Build script : version 0.0.1"
echo "Checking if this a PR to development"
if [[ $TRAVIS_BRANCH == "development"  ]]; then
  echo "Build targetting development - checking if this is a PR or not"
  if [[ $TRAVIS_PULL_REQUEST == "true" ]]; then
    echo "Development PR detected, running all tests"
    echo "Unit tests"
    npm run test
    if [ $? != 0 ]; then
      exit $?
    fi
  fi
fi
