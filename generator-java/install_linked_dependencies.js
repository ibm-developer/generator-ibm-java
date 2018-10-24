const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const generator_dir = path.resolve('../linked_generators');
const fs = require('fs-extra');
const Promise = require('bluebird');
const linked_dependencies = require('../linked_dependencies');

fs.ensureDirSync(generator_dir);

Promise.map(linked_dependencies, generator => {
  let branch = process.env.TRAVIS_BRANCH || 'develop';
  return exec(`git clone -b ${branch} ${generator.repo}`, {cwd: generator_dir})
  .then(() => {
    // Check if the package.json exists
    if (fs.existsSync(path.join(generator_dir, generator.npm_dir || generator.name, 'package.json'))) {
      return exec('git rev-parse --short HEAD', {cwd: path.resolve(generator_dir, generator.name)})
      .then(result => {
        return Promise.resolve(`${generator.name} cloned at ${result.stdout}`);
      }, error => {
        console.error(error);
        return Promise.reject(`Linking of ${generator.name} failed.`);
      })
    }
  })
  .then(result => {
    console.log(result);

    fs.removeSync(path.join(generator_dir, generator.npm_dir || generator.name, 'package-lock.json'));

    return exec('npm link', {cwd: path.join(generator_dir, generator.npm_dir || generator.name)})
    .then(result => {
      return Promise.resolve(result.stdout);
    }, error => {
      console.error(error);
      return Promise.reject(`Linking of ${generator.name} failed.`);
    });
  })
  .then(result => {
    console.log(result);
    return Promise.resolve(`${generator.name} linked successfully.`);
  })
  .catch(error => {
    console.log(error);
    return Promise.reject(`Installation of ${generator.name} failed to complete`);
  });
})
.then(result => {
  console.log(result);

  return Promise.map(linked_dependencies, generator => {
    if(!generator.dependencies) {
      return exec(`npm link ${generator.package_name || generator.name}`)
      .then(result => {
        console.log(result.stdout);
        return Promise.resolve(`Linking of ${generator.name} to project complete.`);
      }, error => {
        console.error(error);
        return Promise.reject(`Linking of ${generator.name} to project failed.`);
      });
    }

    return Promise.map(generator.dependencies, dependency => {
      return exec(`npm link ${dependency}`, {cwd: path.join(generator_dir, generator.npm_dir || generator.name)})
      .then(result => {
        console.log(result.stdout);
        if(generator.skip_project_link) {
          return Promise.resolve();
        }

        return Promise.resolve(`Linking of ${dependency} to ${generator.name} complete.`)
      }, error => {
        console.error(error);
        return Promise.reject(`Linking of ${dependency} to ${generator.name} failed.`);
      });
    })
    .then(result => {
      console.log(result);
      return exec(`npm link ${generator.package_name || generator.name}`)
      .then(result => {
        console.log(result.stdout);
        return Promise.resolve(`Linking of ${generator.name} to project complete.`);
      }, error => {
        console.error(error);
        return Promise.reject(`Linking of ${generator.name} to project failed.`);
      });
    });
  });
})
.then(result => {
  console.log(result);
  console.log('ALL DONE');
})
.catch(error => {
  console.error(error);
  process.exit(1);
});
