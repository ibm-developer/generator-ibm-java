const fs = require('fs-extra');
const path = require('path');
const Promise = require('bluebird');
const linked_dependencies = require('../linked_dependencies');
const generator_dir = path.resolve('../linked_generators');
let package_json = require('./package');

Promise.map(linked_dependencies, generator => {
  let version;
  try {
    version = require(path.resolve(generator_dir, generator.npm_dir || generator.name, 'package.json')).version;
  } catch(err) {
    return Promise.reject(err);
  }

  package_json.dependencies[generator.package_name || generator.name] = version;

  return Promise.resolve(`${generator.package_name || generator.name} version updated to ${version}`);
})
.then(result => {
  console.log(result);
  fs.writeJsonSync('./package.json', package_json, {spaces: 2});
})
.catch(error => {
  console.error(error);
  process.exit(1);
});
