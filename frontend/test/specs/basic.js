const assert = require('assert')

describe('webdriver.io page', () => {
    it('should have the right title', async () => {
        await browser.url('http://localhost:3000')
        const title = await browser.getTitle()
        assert.strictEqual(title, 'Bananarama Voting Bananza')
    })
})
