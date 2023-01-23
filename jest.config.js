const { pathsToModuleNameMapper } = require("ts-jest");

// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require("./tsconfig");

module.exports = {
  roots: ["<rootDir>/test", "<rootDir>/src/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  preset: "ts-jest",
  modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths /*, { prefix: '<rootDir>/' } */,
  ),
};
