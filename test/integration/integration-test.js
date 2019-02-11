const index = require('../../src/index'),
    sdk = require('tellojs'),
    dgram = require('dgram')

const waiter = () => new Promise((resolve) => setTimeout(resolve, 1000))
describe('simulator', () => {
    it('should do stuff', async () => {
        index.start()
        await sdk.control.connect()
        index.stop()
    });
});