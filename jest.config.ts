import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  verbose: true,
  testMatch: [
    "<rootDir>/**/__tests__/**/*.[jt]s?(x)",
    "<rootDir>/**/*.{spec,test}.[jt]s?(x)",
  ],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
};

export default config;
