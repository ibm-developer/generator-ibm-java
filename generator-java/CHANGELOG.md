# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.1"></a>
## [1.0.1](https://github.ibm.com/arf/java-codegen-yeoman/compare/v1.0.0...v1.0.1) (2017-06-29)


### Bug Fixes

* **config:** Update technologies default type to return array ([23bbd86](https://github.ibm.com/arf/java-codegen-yeoman/commit/23bbd86))
* **test:** restore assertBuild in ms tests ([d2e14be](https://github.ibm.com/arf/java-codegen-yeoman/commit/d2e14be))
* **test:** update ms test to common framework ([cac5a39](https://github.ibm.com/arf/java-codegen-yeoman/commit/cac5a39))



<a name="1.0.0"></a>
# [1.0.0](https://github.ibm.com/arf/java-codegen-yeoman/compare/v0.6.1...v1.0.0) (2017-06-27)


### Bug Fixes

* **containers:** Update tests for kube.deploy.yml changes ([81da9b2](https://github.ibm.com/arf/java-codegen-yeoman/commit/81da9b2))
* **containers:** Update yml files to remove upper case ([6e59db1](https://github.ibm.com/arf/java-codegen-yeoman/commit/6e59db1))
* **infrastructure:** update liberty generator version ([6113e8d](https://github.ibm.com/arf/java-codegen-yeoman/commit/6113e8d))
* **templates:** update so that JAX-RS application is in Liberty subgen ([e15cf82](https://github.ibm.com/arf/java-codegen-yeoman/commit/e15cf82))
* **test:** correct control.js for picnmix ([0f320a0](https://github.ibm.com/arf/java-codegen-yeoman/commit/0f320a0))
* **test:** update kube tests ([1de7c04](https://github.ibm.com/arf/java-codegen-yeoman/commit/1de7c04))


### Features

* **infrastructure:** remove liberty framework ([17b816b](https://github.ibm.com/arf/java-codegen-yeoman/commit/17b816b))
* **infrastructure:** update version to match registry ([ce4afe7](https://github.ibm.com/arf/java-codegen-yeoman/commit/ce4afe7))
* **libs:** remove libs and reference from common module ([b0d97b5](https://github.ibm.com/arf/java-codegen-yeoman/commit/b0d97b5))
* **templates:** extract Liberty templates to sub-generator ([cbbaec8](https://github.ibm.com/arf/java-codegen-yeoman/commit/cbbaec8))
* **test:** extract command to common module fix up e2e tests. ([766dbb1](https://github.ibm.com/arf/java-codegen-yeoman/commit/766dbb1))
* **test:** move bx asserts to BxOptions ([2daea15](https://github.ibm.com/arf/java-codegen-yeoman/commit/2daea15))
* **test:** move tech tests to common framework ([7a56956](https://github.ibm.com/arf/java-codegen-yeoman/commit/7a56956))
* **tests:** complete extraction of Liberty tests ([e779eb2](https://github.ibm.com/arf/java-codegen-yeoman/commit/e779eb2))
* **tests:** continue to refactor out Liberty tests ([60cb459](https://github.ibm.com/arf/java-codegen-yeoman/commit/60cb459))


### BREAKING CHANGES

* **infrastructure:** updated version to release new generator.

Signed off by : Adam Pilkington apilkington@uk.ibm.com
* **templates:** Initial version of a Liberty sub-generator for
generating app accelerator content. Whilst not technically a breaking
change it is architecturally different from previous versions.

Signed off by : Adam Pilkington apilkington@uk.ibm.com



<a name="0.6.1"></a>
## [0.6.1](https://github.ibm.com/arf/java-codegen-yeoman/compare/v0.6.0...v0.6.1) (2017-06-12)


### Bug Fixes

* **templates:** Fix kube.deploy.yml template file ([4b705c8](https://github.ibm.com/arf/java-codegen-yeoman/commit/4b705c8))
* **templates:** Update kube test ([c43b279](https://github.ibm.com/arf/java-codegen-yeoman/commit/c43b279))



<a name="0.6.0"></a>
# [0.6.0](https://github.ibm.com/arf/java-codegen-yeoman/compare/v0.5.0...v0.6.0) (2017-06-12)


### Bug Fixes

* **templates:** Add end to end tests and fix templates ([139f70c](https://github.ibm.com/arf/java-codegen-yeoman/commit/139f70c))
* **templates:** Picnmix and patterns have separate rest route ([a1eea9b](https://github.ibm.com/arf/java-codegen-yeoman/commit/a1eea9b))
* **templates:** Remove additional health endpoint files ([2b91770](https://github.ibm.com/arf/java-codegen-yeoman/commit/2b91770))
* **templates:** Remove extra config settings in liberty framework ([81a5e65](https://github.ibm.com/arf/java-codegen-yeoman/commit/81a5e65))
* **templates:** Remove extra health files from picnmix ([6774157](https://github.ibm.com/arf/java-codegen-yeoman/commit/6774157))
* **templates:** Update generator to only add health to JavaEE apps ([9acf0f0](https://github.ibm.com/arf/java-codegen-yeoman/commit/9acf0f0))
* **templates:** Update Health endpoint ([1fa2fa4](https://github.ibm.com/arf/java-codegen-yeoman/commit/1fa2fa4))
* **templates:** Update Liberty test to conditionally check server.xml ([dfbb03f](https://github.ibm.com/arf/java-codegen-yeoman/commit/dfbb03f))
* **templates:** Update tests to check for correct Liberty feature ([1684b09](https://github.ibm.com/arf/java-codegen-yeoman/commit/1684b09))
* **test:** Update common test version dependency to 0.1.0 ([23ac6ff](https://github.ibm.com/arf/java-codegen-yeoman/commit/23ac6ff))


### Features

* **containers:** Update Jenkins file for Microservice Builder update ([028a567](https://github.ibm.com/arf/java-codegen-yeoman/commit/028a567))
* **templates:** Create individual health endpoint files ([71c5188](https://github.ibm.com/arf/java-codegen-yeoman/commit/71c5188))
* **templates:** Remove workaround for Docker non root user ([c41fdcc](https://github.ibm.com/arf/java-codegen-yeoman/commit/c41fdcc))
* **templates:** Template changes for Docker non root issue ([ceed830](https://github.ibm.com/arf/java-codegen-yeoman/commit/ceed830))



<a name="0.5.0"></a>
# [0.5.0](https://github.ibm.com/arf/java-codegen-yeoman/compare/v0.4.0...v0.5.0) (2017-06-01)


### Bug Fixes

* **config:** Fix technologies default ([31da7a7](https://github.ibm.com/arf/java-codegen-yeoman/commit/31da7a7))
* **config:** Refactor prompts to set config in the same way ([343a2f0](https://github.ibm.com/arf/java-codegen-yeoman/commit/343a2f0))
* **infrastructure:** Remove extra coverage files ([09fc0fb](https://github.ibm.com/arf/java-codegen-yeoman/commit/09fc0fb))
* **test:** Fix tests to refer to technologies ([b90dd75](https://github.ibm.com/arf/java-codegen-yeoman/commit/b90dd75))


### Features

* **config:** add readiness probe to kube config ([3936973](https://github.ibm.com/arf/java-codegen-yeoman/commit/3936973))
* **containers:** add readiness probe to kube config ([d67e037](https://github.ibm.com/arf/java-codegen-yeoman/commit/d67e037))
* **templates:** Add index.html templates ([bf65e37](https://github.ibm.com/arf/java-codegen-yeoman/commit/bf65e37))
* **templates:** Add servlet technology templates ([0bbb2e2](https://github.ibm.com/arf/java-codegen-yeoman/commit/0bbb2e2))
* **templates:** Add springboot web templates ([3d7f6e2](https://github.ibm.com/arf/java-codegen-yeoman/commit/3d7f6e2))
* **templates:** Add swagger template ([c1ac3d2](https://github.ibm.com/arf/java-codegen-yeoman/commit/c1ac3d2))
* **templates:** add technologies to prompts ([d152007](https://github.ibm.com/arf/java-codegen-yeoman/commit/d152007))
* **templates:** Add watson sdk template ([424ba0e](https://github.ibm.com/arf/java-codegen-yeoman/commit/424ba0e))
* **templates:** add web sockets templates ([b59cc3e](https://github.ibm.com/arf/java-codegen-yeoman/commit/b59cc3e))
* **templates:** fix random service test ([c30e401](https://github.ibm.com/arf/java-codegen-yeoman/commit/c30e401))
* **test:** Add tests for compile and build ([0315a38](https://github.ibm.com/arf/java-codegen-yeoman/commit/0315a38))
* **test:** add tests for web page ([2ad5d34](https://github.ibm.com/arf/java-codegen-yeoman/commit/2ad5d34))
* **test:** fix folder name and move compile test ([69683ff](https://github.ibm.com/arf/java-codegen-yeoman/commit/69683ff))
* **test:** tests for microservices builder ([97ac731](https://github.ibm.com/arf/java-codegen-yeoman/commit/97ac731))
* **test:** Update test file name ([889bf3c](https://github.ibm.com/arf/java-codegen-yeoman/commit/889bf3c))



<a name="0.4.0"></a>
# [0.4.0](https://github.ibm.com/arf/java-codegen-yeoman/compare/v0.3.0...v0.4.0) (2017-04-27)


### Bug Fixes

* **infrastructure:** Make the coverage.sh file executable ([ab80a1a](https://github.ibm.com/arf/java-codegen-yeoman/commit/ab80a1a))


### Features

* **test:** Refactor tests to pass in build type ([011c323](https://github.ibm.com/arf/java-codegen-yeoman/commit/011c323))



<a name="0.3.0"></a>
# [0.3.0](https://github.ibm.com/arf/java-codegen-yeoman/compare/v0.2.0...v0.3.0) (2017-04-26)


### Bug Fixes

* **infrastructure:** Update readme with master branch instructions ([7d2a6fa](https://github.ibm.com/arf/java-codegen-yeoman/commit/7d2a6fa))


### Features

* **config:** Add prompts for groupId and artifactId ([d3e8cb3](https://github.ibm.com/arf/java-codegen-yeoman/commit/d3e8cb3))
* **config:** Move default values to common location ([468f38e](https://github.ibm.com/arf/java-codegen-yeoman/commit/468f38e))
* **config:** Update description for setting group id ([92cf409](https://github.ibm.com/arf/java-codegen-yeoman/commit/92cf409))
* **infrastructure:** Update build scripts to add unit coverage ([c22b433](https://github.ibm.com/arf/java-codegen-yeoman/commit/c22b433))
* **infrastructure>:** Make shell script files cleaner ([ba82cfb](https://github.ibm.com/arf/java-codegen-yeoman/commit/ba82cfb))
* **test:** add bluemix tests for technology selection ([b128e99](https://github.ibm.com/arf/java-codegen-yeoman/commit/b128e99))
* **test:** separate out maven and gradle tests into re-usable libs. ([99ad04f](https://github.ibm.com/arf/java-codegen-yeoman/commit/99ad04f))



<a name="0.2.0"></a>
# [0.2.0](https://github.ibm.com/arf/java-codegen-yeoman/compare/v0.1.28...v0.2.0) (2017-04-21)


### Features

* **infrastructure:** Fix mistakes and add extra link ([c2f0edf](https://github.ibm.com/arf/java-codegen-yeoman/commit/c2f0edf))
* **infrastructure:** Update README.md ([896b4ec](https://github.ibm.com/arf/java-codegen-yeoman/commit/896b4ec))



<a name="0.1.28"></a>
## [0.1.28](https://github.ibm.com/arf/java-codegen-yeoman/compare/v0.1.25...v0.1.28) (2017-04-21)
