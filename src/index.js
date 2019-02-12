const dgram = require('dgram'),
    state = require('./state')
let commandSocket,
responseSocket,
stateSocket,
videoSocket

const initializeSockets = () => {
    commandSocket = dgram.createSocket('udp4')
    commandSocket.bind({ port: 8889 })
    responseSocket = dgram.createSocket('udp4')
    stateSocket = dgram.createSocket('udp4')
    videoSocket = dgram.createSocket('udp4')
}

const start = () => {
    initializeSockets()
    state.machine(commandSocket,responseSocket,stateSocket,videoSocket)
}

const stop = () => {
    commandSocket.close()
}

module.exports = { start, stop }