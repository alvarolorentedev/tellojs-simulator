const StateMachine = require('javascript-state-machine')

const machine = (commandSocket,responseSocket,stateSocket,videoSocket) => {
  const fsm = new StateMachine({
    init: 'uninitialized',
    transitions: [
      { name: 'command', from: 'uninitialized', to: 'idle' },
      { name: 'takeOff', from: 'idle', to: 'actuate' },
      { name: 'land', from: 'idle', to: 'actuate' },
      { name: 'emergency', from: 'idle', to: 'actuate' },
      { name: 'stop', from: 'idle', to: 'actuate' },
      { name: 'flip', from: 'idle', to: 'actuate' },
      { name: 'up', from: 'idle', to: 'actuate' },
      { name: 'down', from: 'idle', to: 'actuate' },
      { name: 'left', from: 'idle', to: 'actuate' },
      { name: 'right', from: 'idle', to: 'actuate' },
      { name: 'forward', from: 'idle', to: 'actuate' },
      { name: 'back', from: 'idle', to: 'actuate' },
      { name: 'cw', from: 'idle', to: 'actuate' },
      { name: 'ccw', from: 'idle', to: 'actuate' },
      { name: 'go', from: 'idle', to: 'actuate' },
      { name: 'curve', from: 'idle', to: 'actuate' },
      { name: 'speed?', from: 'idle', to: 'actuate' },
      { name: 'battery?', from: 'idle', to: 'actuate' },
      { name: 'time?', from: 'idle', to: 'actuate' },
      { name: 'height?', from: 'idle', to: 'actuate' },
      { name: 'temperature?', from: 'idle', to: 'actuate' },
      { name: 'attitude?', from: 'idle', to: 'actuate' },
      { name: 'barometer?', from: 'idle', to: 'actuate' },
      { name: 'acceleration?', from: 'idle', to: 'actuate' },
      { name: 'tof?', from: 'idle', to: 'actuate' },
      { name: 'wifi?', from: 'idle', to: 'actuate' },
      { name: 'rc', from: 'idle', to: 'actuate' },
      { name: 'speed', from: 'idle', to: 'actuate' },
      { name: 'wifi', from: 'idle', to: 'actuate' },
      { name: 'finish', from: 'actuate', to: 'idle' },
    ],
    methods: {
      onEnterActuate: () => { 
        responseSocket.emit('message', 'ok')
        setTimeout(() => fsm.finish(), 0)
      }
    }
  });
  commandSocket.on('message', (message) => {
    fsm[message]()
  })
  return fsm 
}

module.exports = { machine }