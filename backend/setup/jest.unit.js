const baseJestConfig = require('../jest.base')

module.exports = {
    ...baseJestConfig,
    testMatch: ['**/*unit.test.ts']
}
