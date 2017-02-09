#!/bin/bash
clear
echo Clearing projects directory
rm -rf ./projects
echo Testing : yeoman generator - yo java "$@"
yo java "$@"
