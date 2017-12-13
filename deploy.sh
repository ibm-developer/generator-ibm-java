#!/bin/bash
echo "Auto publish script : version 0.0.2"
echo "Checking if a new publish cycle is required ..."
PKG_NAME=`node -e "console.log(require('./package.json').name);"`
PKG_VER=`node -e "console.log(require('./package.json').version);"`
NPM_VER=`npm show $PKG_NAME version --silent`
CHECK_REG=$(curl https://registry.npmjs.org/$PKG_NAME)
NOT_FOUND=$(node -e "console.log(Object.keys(JSON.parse(JSON.stringify($CHECK_REG))).length)")

echo "$PKG_NAME : version = $PKG_VER, npm version = $NPM_VER"
if [[ $TRAVIS_BRANCH == "master" ]]; then
  echo "Build targetting master - checking if this is a PR or not"
  if [[ $TRAVIS_PULL_REQUEST == "false" ]]; then
    echo "This is a build on master, performing additional steps"
    if [ $NOT_FOUND == 0 ]; then
        echo "$PKG_NAME is not in public registry so going to publish"
        npm publish
    elif [[ $PKG_VER == $NPM_VER ]]; then
      echo "Version numbers match, so changing version and committing changes"
      npm run prerelease
      if [ $? == 0 ]; then
        #If you are running a protected master branch then you *could* disable re-running the tests
        echo "Tests passed, continuing release cycle"
        ../prerelease.sh
        if [ $? != 0 ]; then
          exit $?
        fi
      else
        exit $?
      fi
    else
      echo "Version numbers don't match, so publishing to the registry"
      npm publish
    fi
  fi
fi
