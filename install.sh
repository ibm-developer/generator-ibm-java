#!/bin/bash
echo
echo "Install script"
echo
pwd

echo
echo ENVIRONMENT VARS:
echo

cd ..
pwd

echo
echo Clone Java generator dependencies
echo
git clone -b master https://github.com/ibm-developer/generator-ibm-java-liberty.git
rm -rf generator-ibm-java-liberty/.git
git clone -b master https://github.com/ibm-developer/generator-ibm-java-spring.git
rm -rf generator-ibm-java-spring/.git
git clone -b master https://github.com/ibm-developer/common-codegen-tests.git
rm -rf common-codegen-tests/.git
git clone -b master https://github.com/ibm-developer/generator-ibm-cloud-enablement.git
rm -rf generator-ibm-cloud-enablement/.git
git clone -b master https://github.com/ibm-developer/generator-ibm-service-enablement.git
rm -rf generator-ibm-service-enablement/.git
git clone -b master https://github.com/ibm-developer/generator-ibm-usecase-enablement.git
rm -rf generator-ibm-usecase-enablement/.git
npm config set registry "http://registry.npmjs.org"

echo
echo Install and link generator-ibm-cloud-enablement 
echo
cd generator-ibm-cloud-enablement
npm install && npm link && cd -
echo
echo Install and link generator-ibm-service-enablement 
echo 
cd generator-ibm-service-enablement 
npm install && npm link && cd -
echo
echo Install and link generator-ibm-usecase-enablement 
echo 
cd generator-ibm-usecase-enablement 
npm install && npm link && cd -
echo
echo Install and link generator-ibm-java-spring 
echo 
cd generator-ibm-java-spring/generator-spring
npm install && npm link && cd -
echo
echo Install and link generator-ibm-java-liberty 
echo 
cd generator-ibm-java-liberty/generator-liberty
npm install && npm link && cd -
echo
echo Install Java generator, install dependencies via relative paths
echo
cd generator-java
npm install . \
  ../generator-ibm-java-spring/generator-spring \
  ../generator-ibm-java-liberty/generator-liberty \
  ../common-codegen-tests/npm \
  ../generator-ibm-cloud-enablement \
  ../generator-ibm-service-enablement \
  ../generator-ibm-usecase-enablement
echo
echo Change Java generator dependencies versions from relative paths back to numeric
echo
../update-version.sh . ../generator-ibm-java-spring/generator-spring
../update-version.sh . ../generator-ibm-java-liberty/generator-liberty
../update-version.sh . ../common-codegen-tests/npm
../update-version.sh . ../generator-ibm-cloud-enablement
../update-version.sh . ../generator-ibm-service-enablement
../update-version.sh . ../generator-ibm-usecase-enablement