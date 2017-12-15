#!/bin/bash
echo "Auto publish script : version 0.0.2"
echo "Checking if a new publish cycle is required ..."
PKG_NAME=`node -e "console.log(require('./package.json').name);"`
PKG_VER=`node -e "console.log(require('./package.json').version);"`
NPM_VER=`npm show $PKG_NAME version --silent`

echo "$PKG_NAME : version = $PKG_VER, npm version = $NPM_VER"
if [[ $TRAVIS_BRANCH == "master" ]]; then
  echo "Build targetting master - checking if this is a PR or not"
  if [[ $TRAVIS_PULL_REQUEST == "false" ]]; then
    echo "This is a build on master, performing additional steps"
    if [[ $PKG_VER == $NPM_VER ]]; then
      echo "Version numbers match, so changing version and committing changes"
      ../prerelease.sh
      retval=$?
      if [ $retval != 0 ]; then
        exit $?
      fi
    else
      echo "Version numbers don't match, so publishing to the registry"
      npm publish
    fi
  fi
fi
