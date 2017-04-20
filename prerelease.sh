
git config user.email "travisci@travis.ibm.com"
git config user.name "Travis CI"
git config push.default simple
git checkout -b addCodeCoverageFiles
ls -l
echo "Creating ../docs"
mkdir -p ../docs/cc
mkdir -p ../docs/scan
ls -l ../docs
echo "Copying ./coverage to ../docs"
cp -r ./coverage/* ../docs/cc
ls -l ../docs/cc
../scan.sh
cp ./production/java-codegen-yeoman/generator-java/generator-java_scanresults* ../docs/scan
git status
git add ../docs
git status
git commit -m "Update test coverage files"
git push origin addCodeCoverageFiles
