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

echo "Checking if build is for prerelease or release"
IS_PRERELEASE=`node -e "console.log(require('./package.json').prerelease);"`

if [[ ! -z "${IS_PRERELEASE+x}" && "$IS_PRERELEASE" != "undefined" ]]; then
	echo "Upgrading using standard-version for prerelease $IS_PRERELEASE"
	npm run release --prerelease "$IS_PRERELEASE"
	retval=$?
	if [ $retval != 0 ]; then
  		exit $retval
	fi
else 
	echo "Upgrading using standard-version for full release"
	npm run release 
	retval=$?
	if [ $retval != 0 ]; then
  		exit $retval
	fi
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
git push --follow-tags origin $BRANCH
hub pull-request -b master -m "chore: Merging CHANGELOG and package.json changes"
