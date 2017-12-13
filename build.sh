#!/bin/bash
echo "Build script : version 0.0.2"
if [[ $TRAVIS_PULL_REQUEST != "false" ]]; then
    echo "PR detected, running all tests"
    echo "Running linter"
    npm run lint
    if [ $retval != 0 ]; then
      exit $retval
    fi
    echo "Running unit tests"
    npm run test
    retval=$?
    if [ $retval != 0 ]; then
      exit $retval
    fi
    echo "Running integration tests"
    npm run testint
    retval=$?
    if [ $retval != 0 ]; then
      exit $retval
    fi
    echo "Running common tests"
    npm run testcommon
    retval=$?
    if [ $retval != 0 ]; then
      exit $retval
    fi
    echo "Running end to end tests"
    npm run teste2e
    retval=$?
    if [ $retval != 0 ]; then
      exit $retval
    fi
    echo "Running coveralls"
    npm run coveralls
  else
    echo "Not a PR, but a build of the branch, so not executing any tests"
  fi