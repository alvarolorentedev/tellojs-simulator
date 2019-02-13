const StateMachine = require('javascript-state-machine')

const positionToString = (position) => {
  const allProperties = Object.entries(position).reduce((accumulator, [property, value]) => `${accumulator}${property}:${value};`, "")
  return `${allProperties}\r\n`
}

const machine = (commandSocket,responseSocket,stateSocket,videoSocket) => {
  const position = {
    pitch: 0, 
    roll: 0, 
    yaw: 0,
    vgx:0,
    vgy:0,
    vgz:0,
    templ:18,
    temph:22,
    tof:0,
    h:0,
    bat:100,
    baro:0,
    time:0,
    agx:0,
    agy:0,
    agz:0
  }
  const fsm = new StateMachine({
    init: 'initial',
    transitions: [
      { name: 'command', from: 'initial', to: 'finish' },
      { name: 'takeOff', from: 'idle', to: 'actuate' },
      { name: 'land', from: 'idle', to: 'finish' },
      { name: 'emergency', from: 'idle', to: 'finish' },
      { name: 'stop', from: 'idle', to: 'finish' },
      { name: 'flip', from: 'idle', to: 'finish' },
      { name: 'up', from: 'idle', to: 'finish' },
      { name: 'down', from: 'idle', to: 'finish' },
      { name: 'left', from: 'idle', to: 'finish' },
      { name: 'right', from: 'idle', to: 'finish' },
      { name: 'forward', from: 'idle', to: 'finish' },
      { name: 'back', from: 'idle', to: 'finish' },
      { name: 'cw', from: 'idle', to: 'finish' },
      { name: 'ccw', from: 'idle', to: 'finish' },
      { name: 'go', from: 'idle', to: 'finish' },
      { name: 'curve', from: 'idle', to: 'finish' },
      { name: 'speed?', from: 'idle', to: 'finish' },
      { name: 'battery?', from: 'idle', to: 'finish' },
      { name: 'time?', from: 'idle', to: 'finish' },
      { name: 'height?', from: 'idle', to: 'finish' },
      { name: 'temperature?', from: 'idle', to: 'finish' },
      { name: 'attitude?', from: 'idle', to: 'finish' },
      { name: 'barometer?', from: 'idle', to: 'finish' },
      { name: 'acceleration?', from: 'idle', to: 'finish' },
      { name: 'tof?', from: 'idle', to: 'finish' },
      { name: 'wifi?', from: 'idle', to: 'finish' },
      { name: 'rc', from: 'idle', to: 'finish' },
      { name: 'speed', from: 'idle', to: 'finish' },
      { name: 'wifi', from: 'idle', to: 'finish' },
      { name: 'finish', from: 'actuate', to: 'finish' },
      { name: 'reset', from: 'finish', to: 'idle' },
    ],
    methods: {
      onTakeOff: () =>  {
        setTimeout(() => {
          position.vgx += 20
          position.h += 30
          position.agx += 1
        }, 500)
        setTimeout(() => {
          position.vgx = 0
          position.h += 30
          position.agx = 0
        }, 900)
        setTimeout(() => fsm.finish(), 1000)
      },
      onEnterFinish: () => { 
        responseSocket.send("ok", 0, "ok".length, 8001)
        setTimeout(() => fsm.reset(), 0)
      }
    }
  });
  setInterval(() => {
    const positionString = positionToString(position)
    stateSocket.send(positionString, 0, positionString.length, 8890)
  }, 200)
  commandSocket.on('message', message => {
    const command = message.toString('utf8').split(' ')
    return fsm[command[0]]()
  })
  return fsm 
}

module.exports = { machine }