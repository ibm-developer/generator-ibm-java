echo "Creating ../docs/cc/unit"
mkdir -p ../docs/cc/unit
echo "Running unit test coverage"
npm run coverage
echo "Copying ./coverage to ../docs/cc/unit"
cp -r ./coverage/* ../docs/cc/unit
ls -l ../docs/cc/unit
echo "Creating ../docs/cc/int"
mkdir -p ../docs/cc/int
rm -rf ./coverage
echo "Running integration test coverage"
npm run coverageint
echo "Copying ./coverage to ../docs/cc/int"
cp -r ./coverage/* ../docs/cc/int
ls -l ../docs/cc/int
