git config user.email "travisci@travis.ibm.com"
git config user.name "Travis CI"
git config push.default simple
echo "Revving version"
npm run release
if [ $? != 0 ]; then
  exit $?
fi
echo "Creating git branch"
PKG_VER_NEXT=`node -e "console.log(require('./package.json').version);"`
BRANCH="updateTo${PKG_VER_NEXT}"
git checkout -b $BRANCH
../coverage.sh
if [ $? != 0 ]; then
  exit $?
fi
../scan.sh
if [ $? != 0 ]; then
  echo "WARNING : scan failed, see logs for more details"
fi
git status
git add ../docs
git status
git commit -m "Update test coverage and code scan files"
#this branch will need to be reviewed and approved in the usual manner
git push --follow-tags origin $BRANCH
