const index = require('../../src/index'),
    sdk = require('tellojs')


const waiter = (time = 0) => new Promise((resolve) => setTimeout(resolve, time))

describe('simulator', () => {
    it('should do stuff', async () => {
        index.start()
        await sdk.control.connect()
        index.stop()
        await waiter(1000)
    });
});