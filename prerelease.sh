echo "Running pre-release checks and scans"
echo "Determining current version"
CURRENT_PKG_VER_MAJOR=`node -e "console.log(require('./package.json').version.split('.')[0]);"`
CURRENT_PKG_VER_MINOR=`node -e "console.log(require('./package.json').version.split('.')[1]);"`
CURRENT_PKG_VER_FIX=`node -e "console.log(require('./package.json').version.split('.')[2]);"`

git config user.email "travisci@travis.ibm.com"
git config user.name "Travis CI"
git config push.default simple
echo "Revving version"
npm run release
if [ $? != 0 ]; then
  exit $?
fi

echo "Determining next version"
PKG_VER_NEXT=`node -e "console.log(require('./package.json').version);"`
NEXT_PKG_VER_MAJOR=`node -e "console.log(require('./package.json').version.split('.')[0]);"`
NEXT_PKG_VER_MINOR=`node -e "console.log(require('./package.json').version.split('.')[1]);"`
NEXT_PKG_VER_FIX=`node -e "console.log(require('./package.json').version.split('.')[2]);"`

echo "Creating git branch"
BRANCH="updateTo${PKG_VER_NEXT}"
git checkout -b $BRANCH
../coverage.sh
if [ $? != 0 ]; then
  exit $?
fi

echo "Determining need for OSS scan"
if [ $CURRENT_PKG_VER_MAJOR !=  $NEXT_PKG_VER_MAJOR]; then
  echo "Major version change detected, running OSS scan"
  ../scan.sh
  if [ $? != 0 ]; then
  echo "WARNING : scan failed, see logs for more details"
fi
else
  if [ $CURRENT_PKG_VER_MINOR !=  $NEXT_PKG_VER_MINOR]; then
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
