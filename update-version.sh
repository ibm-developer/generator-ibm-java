#!/bin/bash
#
#  In the top level generator update the dependency version of the
#  child generator with the version from the child generator's package.json 
#
#  Params:
#    $1 path to top level generator
#    $2 path to child generator
#
PKG_NAME=`node -e "console.log(require('"$2"/package.json').name);"`
PKG_VERSION=`node -e "console.log(require('"$2"/package.json').version);"`
echo $PKG_NAME : $PKG_VERSION
node -e "require('fs');
         var pkg = JSON.parse(fs.readFileSync('"$1"/package.json', 'utf8'));
         pkg[\"dependencies\"][\""$PKG_NAME"\"]=\""$PKG_VERSION"\";
         fs.writeFileSync('"$1"/package.json', JSON.stringify(pkg, null, 2));"
