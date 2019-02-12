const index = require('../../src/index'),
    sdk = require('tellojs')

describe('simulator', () => {
    it('should do stuff', async () => {
        index.start()
        await sdk.control.connect()
        index.stop()
    });
});