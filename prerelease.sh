#!/usr/bin/env bash
echo "Determining current version"
CURRENT_PKG_VER_MAJOR=`node -e "console.log(require('./package.json').version.split('.')[0]);"`
CURRENT_PKG_VER_MINOR=`node -e "console.log(require('./package.json').version.split('.')[1]);"`
CURRENT_PKG_VER_FIX=`node -e "console.log(require('./package.json').version.split('.')[2]);"`

git config user.email "travisci@travis.ibm.com"
git config user.name "Travis CI"
git config push.default simple

echo "Running smoke test"
npm run prerelease
retval=$?
if [ $retval != 0 ]; then
  exit $retval
fi
echo "Upgrading using standard-version"
npm run release
retval=$?
if [ $retval != 0 ]; then
  exit $retval
fi

echo "Determining next version"
PKG_VER_NEXT=`node -e "console.log(require('./package.json').version);"`
NEXT_PKG_VER_MAJOR=`node -e "console.log(require('./package.json').version.split('.')[0]);"`
NEXT_PKG_VER_MINOR=`node -e "console.log(require('./package.json').version.split('.')[1]);"`
NEXT_PKG_VER_FIX=`node -e "console.log(require('./package.json').version.split('.')[2]);"`

echo "Creating git branch"
BRANCH="updateTo${PKG_VER_NEXT}"
git checkout -b $BRANCH
# this pull request through this branch will be needed to be reviewed as usual
git remote rm origin
git remote add origin $GITHUB_URL_SECURED
git push --follow-tags origin master
hub pull-request -b master -m "chore: Merging CHANGELOG and package.json changes"
