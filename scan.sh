mkdir -p ../docs/scan
mkdir ./production
cd ./production
git clone git@github.ibm.com:arf/java-codegen-yeoman.git
cd ./java-codegen-yeoman/generator-java
npm install --only=production
npm install @ibm/osc-cli -g
echo "Running scan"
osc-cli -s . -o -u travisci@travis.ibm.com
cd ../../../
echo "Copying scan results file to ../docs"
cp ./production/java-codegen-yeoman/generator-java/generator-java_scanresults* ../docs/scan
