const EventEmitter = require('events')
class TestEmitter extends EventEmitter {
}

const machine = require('../../src/state').machine,
    faker = require('faker')
const waiter = (time = 0) => new Promise((resolve) => setTimeout(resolve, time))
const positionToString = (position) => {
    const allProperties = Object.entries(position).reduce((accumulator, [property, value]) => `${accumulator}${property}:${value};`, "")
    return `${allProperties}\r\n`
}

describe('state machine', () => {
    let commandSocket
    let responseSocket
    let stateSocket
    let videoSocket
    let position
    
    beforeEach(() => {
        position = {
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

        commandSocket =new TestEmitter()

        responseSocket =new TestEmitter()
        responseSocket.send = jest.fn()

        stateSocket =new TestEmitter()
        stateSocket.send = jest.fn()

        videoSocket =new TestEmitter()
        videoSocket.bind = jest.fn()
        videoSocket.on = jest.fn()
        videoSocket.close = jest.fn()
    });
    describe('control commands', () => {

    it('should idle to accept commands when received command input', async () => {
        const local = machine(commandSocket,responseSocket, stateSocket, videoSocket)
        commandSocket.emit('message', 'command')
        await waiter();
        expect(local.is('idle')).toEqual(true)
    });

    it('when in idle should accept takeOff command', async () => {
        const local = await sendCommand('takeOff')
        await waiter(1100);
        const initialPosition = { ...position }
        const initialPositionString = positionToString(initialPosition)
        const intermediatePosition = { ...position, vgx: 20, h: 30, agx: 1 }
        const intermediatePositionString = positionToString(intermediatePosition)
        const finalPosition = { ...position, vgx: 0, h: 60, agx: 0 }
        const finalPositionString = positionToString(finalPosition)
        expect(stateSocket.send).toHaveBeenNthCalledWith(1, initialPositionString, 0, initialPositionString.length,8890)
        expect(stateSocket.send).toHaveBeenNthCalledWith(2,intermediatePositionString, 0, intermediatePositionString.length,8890)
        expect(stateSocket.send).toHaveBeenNthCalledWith(3,finalPositionString, 0, finalPositionString.length,8890)
        expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
        expect(local.is('idle')).toEqual(true)
    });

    it('when in idle should accept land command', async () => {
        const local = await sendCommand('land')
        expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
        expect(local.is('idle')).toEqual(true)
    });

    it('when in idle should accept emergency command', async () => {
        const local = await sendCommand('emergency')
        expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
        expect(local.is('idle')).toEqual(true)
    });

    it('when in idle should accept stop command', async () => {
        const local = await sendCommand('stop')
        expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
        expect(local.is('idle')).toEqual(true)
    });
    
    describe('flip', () => {
        it('when in idle should accept flip left command', async () => {
            const local = await sendCommand('flip', 'l')
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept flip right command', async () => {
            const local = await sendCommand('flip', 'f')
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept flip back command', async () => {
            const local = await sendCommand('flip', 'b')
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept flip front command', async () => {
            const local = await sendCommand('flip', 'f')
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });
        
    });

    describe('move', () => {
        it('when in idle should accept move up command', async () => {
            const distance = faker.random.number(500)
            const local = await sendCommand('up', distance)
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept move down command', async () => {
            const distance = faker.random.number(500)
            const local = await sendCommand('down', distance)
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept move left command', async () => {
            const distance = faker.random.number(500)
            const local = await sendCommand('left', distance)
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept move right command', async () => {
            const distance = faker.random.number(500)
            const local = await sendCommand('right', distance)
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept move back command', async () => {
            const distance = faker.random.number(500)
            const local = await sendCommand('back', distance)
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept move forward command', async () => {
            const distance = faker.random.number(500)
            const local = await sendCommand('forward', distance)
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        
    });

    describe('rotate', () => {

        it('when in idle should accept rotate clockwise command', async () => {
            const angle = faker.random.number(360)
            const local = await sendCommand('cw', angle)
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept rotate counter clockwise command', async () => {
            const angle = faker.random.number(360)
            const local = await sendCommand('ccw', angle)
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });
        
    });

    it('when in idle should accept go command', async () => {
        const end = {
            x: faker.random.number(500),
            y: faker.random.number(500),
            z: faker.random.number(500)
        }
        const speed = faker.random.number(500)
        const local = await sendCommand('go', end, speed)
        expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
        expect(local.is('idle')).toEqual(true)
    });

    it('when in idle should accept curve command', async () => {
        const start = {
            x: faker.random.number(500),
            y: faker.random.number(500),
            z: faker.random.number(500)
        }
        const end = {
            x: faker.random.number(500),
            y: faker.random.number(500),
            z: faker.random.number(500)
        }
        const speed = faker.random.number(500)
        const local = await sendCommand('curve', start, end, speed)
        expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
        expect(local.is('idle')).toEqual(true)
    });
            
    });

    describe('set commands', () => {
        it('when in idle should accept speed command', async () => {
            const speed = faker.random.number(500)

            const local = await sendCommand('speed', speed)
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept rc command', async () => {
            const x = faker.random.number(500),
                y = faker.random.number(500),
                z = faker.random.number(500),
                yaw = faker.random.number(500)

            const local = await sendCommand('rc', x, y, z, yaw)
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept wifi command', async () => {
            const ssid = faker.random.uuid(),
                password = faker.random.uuid()

            const local = await sendCommand('wifi', ssid, password)
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });
    });

    describe('read commands', () => {
        it('when in idle should accept speed command', async () => {
            const local = await sendCommand('speed?')
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept battery command', async () => {
            const local = await sendCommand('battery?')
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept time command', async () => {
            const local = await sendCommand('time?')
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept height command', async () => {
            const local = await sendCommand('height?')
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept temperature command', async () => {
            const local = await sendCommand('temperature?')
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept attitude command', async () => {
            const local = await sendCommand('attitude?')
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept barometer command', async () => {
            const local = await sendCommand('barometer?')
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept acceleration command', async () => {
            const local = await sendCommand('acceleration?')
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept tof command', async () => {
            const local = await sendCommand('tof?')
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept wifi command', async () => {
            const local = await sendCommand('wifi?')
            expect(responseSocket.send).toHaveBeenCalledWith("ok", 0, "ok".length, 8001)
            expect(local.is('idle')).toEqual(true)
        });
    });


    const sendCommand = async (...command) => {
        const local = machine(commandSocket,responseSocket,stateSocket, videoSocket)
        commandSocket.emit('message', 'command')
        await waiter();
        commandSocket.emit('message', command.join(' '))
        await waiter();
        return local
    }

});