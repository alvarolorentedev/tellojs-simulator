const dgram = require('dgram'),
    state = require('./state')
let commandSocket,
responseSocket,
stateSocket,
videoSocket

const initializeSockets = () => {
    commandSocket = dgram.createSocket({type: 'udp4', reuseAddr: true})
    commandSocket.bind({ port: 8889 })
    responseSocket = dgram.createSocket({type: 'udp4', reuseAddr: true})
    stateSocket = dgram.createSocket({type: 'udp4', reuseAddr: true})
    videoSocket = dgram.createSocket({type: 'udp4', reuseAddr: true})
}

const start = () => {
    initializeSockets()
    state.machine(commandSocket,responseSocket,stateSocket,videoSocket)
}

const stop = () => {
    commandSocket.close()
    responseSocket.close()
    stateSocket.close()
    videoSocket.close()
}

module.exports = { start, stop }