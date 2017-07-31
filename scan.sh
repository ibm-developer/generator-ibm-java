mkdir -p ../docs/scan
WORKING_DIR=`pwd`
echo "Current workingDir is $WORKING_DIR"
mkdir ./production
cd ./production
git clone git@github.ibm.com:arf/java-codegen-yeoman.git
cd ./java-codegen-yeoman/generator-java
npm install --only=production
npm install @wicked/cli -g
echo "Running scan"
wicked-cli -s . -u travisci@travis.ibm.com
cd $WORKING_DIR
echo "Copying scan results file to ../docs"
cp ./production/java-codegen-yeoman/generator-java/generator-java_scan-results/* ../docs/scan
