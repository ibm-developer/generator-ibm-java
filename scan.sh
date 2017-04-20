mkdir ./production
cd ./production
git clone git@github.ibm.com:arf/java-codegen-yeoman.git
cd ./java-codegen-yeoman/generator-java
npm install --only=production
npm install @ibm/osc-cli -g
osc-cli -s . -o -u travisci@travis.ibm.com
