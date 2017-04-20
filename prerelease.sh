git config user.email "travisci@travis.ibm.com"
git config user.name "Travis CI"
git config push.default simple
echo "Revving version"
npm run release
echo "Creating git branch"
PKG_VER_NEXT=`node -e "console.log(require('./package.json').version);"`
BRANCH="updateTo${PKG_VER_NEXT}"
git checkout -b $BRANCH
ls -l
echo "Creating ../docs"
mkdir -p ../docs/cc
mkdir -p ../docs/scan
ls -l ../docs
echo "Copying ./coverage to ../docs"
cp -r ./coverage/* ../docs/cc
ls -l ../docs/cc
../scan.sh
echo "Copying scan results file to ../docs"
cp ./production/java-codegen-yeoman/generator-java/generator-java_scanresults* ../docs/scan
git status
git add ../docs
git status
git commit -m "Update test coverage and code scan files"
#this branch will need to be reviewed and approved in the usual manner
git push --follow-tags origin $BRANCH
