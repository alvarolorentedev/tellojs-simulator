const EventEmitter = require('events')
class TestEmitter extends EventEmitter {
    send(...parameters) {
        return emit(...parameters)
    }
}

jest.mock('dgram', () => ({
    createSocket: jest.fn()
}))

jest.mock('../../src/state', () => ({
    machine: jest.fn()
}))

const index = require('../../src/index'),
    state = require('../../src/state'),
    dgram = require('dgram')

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

    it('should have a start function that binds udp server ports to accept requests', () => {
        index.start()
        expect(commandSocket.bind).toHaveBeenCalledWith({ port: 8889 })
    });

    it('should have a start function that bind event emitters and state manager', () => {
        index.start()
        expect(state.machine).toHaveBeenCalledWith(commandSocket,responseSocket,stateSocket,videoSocket)
    });

    it('should have a stop function that closes udp ports connection', () => {
        index.start()
        index.stop()
        expect(commandSocket.close).toHaveBeenCalled()
    });
});