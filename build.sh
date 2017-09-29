#!/bin/bash
echo "Build script : version 0.0.1"
echo "Checking if this a PR to development"
if [[ $TRAVIS_BRANCH == "development"  ]]; then
  echo "Build targetting development - checking if this is a PR or not"
  if [[ $TRAVIS_PULL_REQUEST != "false" ]]; then
    echo "Development build detected, running all tests"
    echo "Unit tests"
    npm run test
    if [ $? != 0 ]; then
      exit $?
    fi
  else
    echo "Not a PR, so not executing any tests"
    PKG_VER_MAJOR=`node -e "console.log(require('./package.json').version.split('.')[0]);"`
    PKG_VER_MINOR=`node -e "console.log(require('./package.json').version.split('.')[1]);"`
    PKG_VER_FIX=`node -e "console.log(require('./package.json').version.split('.')[2]);"`
    echo "MAJOR = $PKG_VER_MAJOR, MINOR = $PKG_VER_MINOR, FIX = $PKG_VER_FIX"
  fi
fi
