const EventEmitter = require('events')
class TestEmitter extends EventEmitter {
}

jest.mock('dgram', () => ({
    createSocket: jest.fn()
}))

const index = require('../src/index'),
    dgram = require('dgram')


// server.on('listening', function () {
//     var address = server.address();
//     console.log('UDP Server listening on ' + address.address + ":" + address.port);
// });

// server.on('message', function (message, remote) {
//     console.log(remote.address + ':' + remote.port +' - ' + message);

// });

describe('simulator', () => {
    let commandSocket
    let responseSocket
    let stateSocket
    let videoSocket

    beforeEach(() => {
        commandSocket =new TestEmitter()
        commandSocket.bind = jest.fn()
        commandSocket.on = jest.fn()
        commandSocket.close = jest.fn()

        responseSocket =new TestEmitter()
        responseSocket.bind = jest.fn()
        responseSocket.on = jest.fn()
        responseSocket.close = jest.fn()

        stateSocket =new TestEmitter()
        stateSocket.bind = jest.fn()
        stateSocket.on = jest.fn()
        stateSocket.close = jest.fn()

        videoSocket =new TestEmitter()
        videoSocket.bind = jest.fn()
        videoSocket.on = jest.fn()
        videoSocket.close = jest.fn()

        dgram.createSocket.mockReturnValueOnce(commandSocket)
                          .mockReturnValueOnce(responseSocket)
                          .mockReturnValueOnce(stateSocket)
                          .mockReturnValueOnce(videoSocket)
        
    });

    it('should have a start function that binds a udp server to accept requests', () => {
        index.start()
        expect(commandSocket.bind).toHaveBeenCalledWith("192.168.10.1", 8889)
        expect(commandSocket.on).toHaveBeenCalledWith('message', expect.any(Function))
        expect(responseSocket.bind).toHaveBeenCalledWith("192.168.10.1", 8001)
        expect(stateSocket.bind).toHaveBeenCalledWith("192.168.10.1", 8890)
        expect(videoSocket.bind).toHaveBeenCalledWith("192.168.10.1", 11111)
    });

    it('should have a stop function that closes udp server connection', () => {
        index.start()
        index.stop()
        expect(commandSocket.close).toHaveBeenCalled()
        expect(responseSocket.close).toHaveBeenCalled()
        expect(stateSocket.close).toHaveBeenCalled()
        expect(videoSocket.close).toHaveBeenCalled()
    });
});