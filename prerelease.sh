echo "Running pre-release checks and scans"
echo "Determining current version"
CURRENT_PKG_VER_MAJOR=`node -e "console.log(require('./package.json').version.split('.')[0]);"`
CURRENT_PKG_VER_MINOR=`node -e "console.log(require('./package.json').version.split('.')[1]);"`
CURRENT_PKG_VER_FIX=`node -e "console.log(require('./package.json').version.split('.')[2]);"`

git config user.email "travisci@travis.ibm.com"
git config user.name "Travis CI"
git config push.default simple

echo "Running smoke test"
npm run prerelease
echo "Revving version"
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

echo "Determining need for covergage and OSS scan"
if [ $CURRENT_PKG_VER_MAJOR !=  $NEXT_PKG_VER_MAJOR]; then
  echo "Major version change detected, running coverage"
  ../coverage.sh
  retval=$?
  if [ $retval != 0 ]; then
    exit $retval
  fi
  echo "Major version change detected, running OSS scan"
  ../scan.sh
  if [ $? != 0 ]; then
    echo "WARNING : scan failed, see logs for more details"
  fi
else
  if [ $CURRENT_PKG_VER_MINOR !=  $NEXT_PKG_VER_MINOR]; then
    echo "Minor version change detected, running coverage"
    ../coverage.sh
    retval=$?
    if [ $retval != 0 ]; then
      exit $retval
    fi
    echo "Minor version change detected, running OSS scan"
    ../scan.sh
    if [ $? != 0 ]; then
      echo "WARNING : scan failed, see logs for more details"
    fi
  fi
fi

git status
git add ../docs
git status
git commit -m "Update test coverage and code scan files"
#this branch will need to be reviewed and approved in the usual manner
git push --follow-tags origin $BRANCH
