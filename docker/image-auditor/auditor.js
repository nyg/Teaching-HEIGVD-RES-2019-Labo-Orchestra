'use strict'

const uuidv4 = require('uuid/v4')
const uuidv5 = require('uuid/v5')
const net = require('net')
const dgram = require('dgram')

const tcpPort = 2205
const udpPort = 3305

const noises = {
    'ti-ta-ti': 'piano',
    'pouet': 'trumpet',
    'trulu': 'flute',
    'gzi-gzi': 'violin',
    'boum-boum': 'drum'
}

// generate a random UUID namespace for this application instance
const appUUID = uuidv4()

// dictionary used to store data on received noises
const musicians = {}

// update the musicians dictionary:
//   - create a new entry if necessary
//   - update the `lastUpdate' value
function updateMusicians(address, port, noise) {

    const uuid = uuidv5(address + '/' + port, appUUID)
    if (!musicians.hasOwnProperty(uuid)) {
        musicians[uuid] = {
            'instrument': noises[noise],
            'creation': new Date()
        }
    }

    musicians[uuid].lastUpdate = new Date()
}

// transform the musician dictionary into an array of objects, as demanded
function musiciansToArray() {

    pruneMusicians()
    return JSON.stringify(Object.keys(musicians).map(key => {
        return {
            'uuid': key,
            'instrument': musicians[key].instrument,
            'activeSince': musicians[key].creation
        }
    }), null, 2)
}

// remove musicians from which we have not heard a sound in the last 5 seconds
function pruneMusicians() {

    Object.keys(musicians).forEach(key => {
        if (new Date() - musicians[key].lastUpdate > 5000) {
            delete musicians[key]
        }
    })
}

/* TCP Server */

// send array of active musicians each time someone connects to the server
const tcpServer = net.createServer(socket => {
    socket.write(musiciansToArray(musicians))
    socket.write('\r\n');
    socket.end();
})

tcpServer.on('error', e => { throw e })

// start the TCP server
tcpServer.listen(tcpPort, () => {
    console.log('TCP server started on port', tcpPort)
})

/* UDP Server */

// handle received UDP datagrams
const udpServer = dgram.createSocket('udp4', (msg, rinfo) => {
    console.log('Received datagram:', msg.toString(), rinfo)
    updateMusicians(rinfo.address, rinfo.port, msg.toString())
})

udpServer.on('error', e => { throw e })

// start listening for UDP datagrams
udpServer.bind(udpPort, () => {
    console.log('UDP server started on port', udpPort)
})
