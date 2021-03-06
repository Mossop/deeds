module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [
    "**/tests/**/*.ts",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "\\.types\\.ts$",
  ],
};
