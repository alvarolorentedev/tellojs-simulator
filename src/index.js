const dgram = require('dgram')
let commandSocket,
responseSocket,
stateSocket,
videoSocket

const initializeSockets = () => {
    commandSocket = dgram.createSocket('udp4')
    responseSocket = dgram.createSocket('udp4')
    stateSocket = dgram.createSocket('udp4')
    videoSocket = dgram.createSocket('udp4')
}

const start = () => {
    initializeSockets()
    commandSocket.bind("192.168.10.1", 8889)
    commandSocket.on('message', () => {})
    responseSocket.bind("192.168.10.1", 8001)
    stateSocket.bind("192.168.10.1", 8890)
    videoSocket.bind("192.168.10.1", 11111)
}

const stop = () => {
    commandSocket.close()
    responseSocket.close()
    stateSocket.close()
    videoSocket.close()
}

module.exports = { start, stop }