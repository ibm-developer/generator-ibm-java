#!/bin/bash
echo "Auto publish script : version 0.0.2"
echo "Checking if a new publish cycle is required ..."
PKG_NAME=`node -e "console.log(require('./package.json').name);"`
PKG_VER=`node -e "console.log(require('./package.json').version);"`
NPM_VER=`npm show $PKG_NAME version`
echo "$PKG_NAME : version = $PKG_VER, npm version = $NPM_VER"
if [[ $TRAVIS_BRANCH == "master"  ]]; then
  echo "Build targetting master - checking if this is a PR or not"
  if [[ $TRAVIS_PULL_REQUEST == "false" ]]; then
    echo "This is a build on master, performing additional steps"
    if [[ $PKG_VER == $NPM_VER ]]; then
      echo "Version numbers match, so changing version and committing changes"
      git config user.email "travisci@travis.ibm.com"
      git config user.name "Travis CI"
      git config push.default simple
      npm run prerelease
      if [ $? == 0 ]; then
        #If you are running a protected master branch then you *could* disable re-running the tests
        echo "Tests passed, continuing release cycle, revving version"
        npm run release
        echo "Committing to git"
        PKG_VER_NEXT=`node -e "console.log(require('./package.json').version);"`
        BRANCH="updateTo${PKG_VER_NEXT}"
        git checkout -b $BRANCH
        npm run coverage > ../unitCoverage-generated.txt
        npm run coverageint > ../intCoverage-generated.txt
        git add ../unitCoverage-generated.txt
        git add ../intCoverage-generated.txt
        git commit -m "Update test coverage files"
        #this branch will need to be reviewed and approved in the usual manner
        git push --follow-tags origin $BRANCH
      else
        exit $?
      fi
    else
      echo "Version numbers don't match, so publishing to the registry"
      npm publish --scope=arf
    fi
  fi
fi
