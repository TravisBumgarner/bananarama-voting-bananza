const Page = require('./Page')

class Lobby extends Page {
    get modal() { return 'div[class*="ReactModal__Content"]' }

    get submitBtn() { return $('form button[type="submit"]') }

    open() {
        super.open('')
    }
}

module.exports = new Lobby()
