const EventEmitter = require('events')
class TestEmitter extends EventEmitter {
}

const machine = require('../src/state').machine,
    faker = require('faker')
const waiter = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('state machine', () => {
    let commandSocket
    let responseSocket
    let stateSocket
    let videoSocket
    
    beforeEach(() => {
        commandSocket =new TestEmitter()

        responseSocket =new TestEmitter()
        responseSocket.emit = jest.fn()

        stateSocket =new TestEmitter()
        stateSocket.bind = jest.fn()
        stateSocket.on = jest.fn()
        stateSocket.close = jest.fn()

        videoSocket =new TestEmitter()
        videoSocket.bind = jest.fn()
        videoSocket.on = jest.fn()
        videoSocket.close = jest.fn()
    });
    describe('control commands', () => {

    it('should idle to accept commands when received command input', async () => {
        const local = machine(commandSocket,responseSocket,stateSocket, videoSocket)
        commandSocket.emit('message', 'command')
        expect(local.is('idle')).toEqual(true)
    });

    it('when in idle should accept takeOff command', async () => {
        const local = await sendCommand('takeOff')
        expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
        expect(local.is('idle')).toEqual(true)
    });

    it('when in idle should accept land command', async () => {
        const local = await sendCommand('land')
        expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
        expect(local.is('idle')).toEqual(true)
    });

    it('when in idle should accept emergency command', async () => {
        const local = await sendCommand('emergency')
        expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
        expect(local.is('idle')).toEqual(true)
    });

    it('when in idle should accept stop command', async () => {
        const local = await sendCommand('stop')
        expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
        expect(local.is('idle')).toEqual(true)
    });
    
    describe('flip', () => {
        it('when in idle should accept flip left command', async () => {
            const local = await sendCommand('flip', 'l')
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept flip right command', async () => {
            const local = await sendCommand('flip', 'f')
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept flip back command', async () => {
            const local = await sendCommand('flip', 'b')
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept flip front command', async () => {
            const local = await sendCommand('flip', 'f')
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });
        
    });

    describe('move', () => {
        it('when in idle should accept move up command', async () => {
            const distance = faker.random.number(500)
            const local = await sendCommand('up', distance)
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept move down command', async () => {
            const distance = faker.random.number(500)
            const local = await sendCommand('down', distance)
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept move left command', async () => {
            const distance = faker.random.number(500)
            const local = await sendCommand('left', distance)
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept move right command', async () => {
            const distance = faker.random.number(500)
            const local = await sendCommand('right', distance)
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept move back command', async () => {
            const distance = faker.random.number(500)
            const local = await sendCommand('back', distance)
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept move forward command', async () => {
            const distance = faker.random.number(500)
            const local = await sendCommand('forward', distance)
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        
    });

    describe('rotate', () => {

        it('when in idle should accept rotate clockwise command', async () => {
            const angle = faker.random.number(360)
            const local = await sendCommand('cw', angle)
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept rotate counter clockwise command', async () => {
            const angle = faker.random.number(360)
            const local = await sendCommand('ccw', angle)
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
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
        expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
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
        expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
        expect(local.is('idle')).toEqual(true)
    });
            
    });

    describe('set commands', () => {
        it('when in idle should accept speed command', async () => {
            const speed = faker.random.number(500)

            const local = await sendCommand('speed', speed)
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept rc command', async () => {
            const x = faker.random.number(500),
                y = faker.random.number(500),
                z = faker.random.number(500),
                yaw = faker.random.number(500)

            const local = await sendCommand('rc', x, y, z, yaw)
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept wifi command', async () => {
            const ssid = faker.random.uuid(),
                password = faker.random.uuid()

            const local = await sendCommand('wifi', ssid, password)
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });
    });

    describe('read commands', () => {
        it('when in idle should accept speed command', async () => {
            const local = await sendCommand('speed?')
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept battery command', async () => {
            const local = await sendCommand('battery?')
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept time command', async () => {
            const local = await sendCommand('time?')
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept height command', async () => {
            const local = await sendCommand('height?')
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept temperature command', async () => {
            const local = await sendCommand('temperature?')
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept attitude command', async () => {
            const local = await sendCommand('attitude?')
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept barometer command', async () => {
            const local = await sendCommand('barometer?')
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept acceleration command', async () => {
            const local = await sendCommand('acceleration?')
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept tof command', async () => {
            const local = await sendCommand('tof?')
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });

        it('when in idle should accept wifi command', async () => {
            const local = await sendCommand('wifi?')
            expect(responseSocket.emit).toHaveBeenCalledWith('message', 'ok')
            expect(local.is('idle')).toEqual(true)
        });
    });


    const sendCommand = async (...command) => {
        let local = machine(commandSocket,responseSocket,stateSocket, videoSocket)
        commandSocket.emit('message', 'command')
        commandSocket.emit('message', ...command)
        await waiter();
        return local
    }

});