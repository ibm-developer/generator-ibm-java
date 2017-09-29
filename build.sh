#!/bin/bash
echo "Build script : version 0.0.1"
echo "Determining scope of changes"
PKG_NAME=`node -e "console.log(require('./package.json').name);"`
NPM_VER=`npm show $PKG_NAME version`
echo "NPM version $NPM_VER"
npm run release
if [ $? != 0 ]; then
  exit $?
fi
PKG_VER_NEXT=`node -e "console.log(require('./package.json').version);"`
echo "NPM next version $PKG_VER_NEXT"
