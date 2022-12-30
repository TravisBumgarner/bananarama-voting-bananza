const baseJestConfig = require('./jest.base')

module.exports = {
    ...baseJestConfig,
    testMatch: ['**/*integration.test.ts']
}
