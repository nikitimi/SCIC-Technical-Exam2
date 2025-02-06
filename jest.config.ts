import { Config } from "jest";
import nextJest from 'next/jest'
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const createJestConfig = nextJest({
	dir: "./",
});

const customJestConfig:Config = {
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	testEnvironment: "jest-environment-jsdom",
	coverageProvider: "v8",
	
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: "<rootDir>/",
	  }),
	  roots: ["<rootDir>/src"],
	collectCoverage: true,
	coverageDirectory: "coverage",
	transformIgnorePatterns: ["/node_modules/(?!react-markdown)/"],
};

module.exports = createJestConfig(customJestConfig);
