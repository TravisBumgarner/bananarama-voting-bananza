const assert = require('assert')
const Lobby = require('./Lobby')

describe('webdriver.io page', () => {
    it('should have the right title', async () => {
        await browser.url('http://localhost:3000')
        const title = await browser.getTitle()
        assert.strictEqual(title, 'Bananarama Voting Bananza')
    })
})

describe('lobby', () => {
    it('should show up', async () => {
        Lobby.open()
        console.log(Lobby.modal)
        // expect(Lobby.modal.isDisplayed()).toBe(true)
    })
})
