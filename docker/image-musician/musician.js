'use strict'

const instruments = {
    'piano': 'ti-ta-ti',
    'trumpet': 'pouet',
    'flute': 'trulu',
    'violin': 'gzi-gzi',
    'drum': 'boum-boum'
}

/* Initialize the instrument from the given command-line parameter. */

if (process.argv.length != 3 || !instruments.hasOwnProperty(process.argv[2])) {
    console.error('First parameter must have one of the following values:')
    console.error('  piano, trumpet, flute, violin or drum')
    process.exit(1)
}

const instrument = process.argv[2]
console.log('Created musician with the', instrument, 'as instrument');

/* Send UDP datagrams every seconds */

function sendMessage(socket, message, port, address) {
    client.send(message, port, address, error => {
        if (error) { throw error }
        console.log('Datagram sent:', message.toString())
    })
}

const dgram = require('dgram')
const port = 3305
const address = '255.255.255.255'

const client = dgram.createSocket('udp4')
client.on('error', e => { throw e })

client.bind(() => {
    client.setBroadcast(true)
    const message = Buffer.from(instruments[instrument])
    setInterval(sendMessage, 1000, client, message, port, address)
})
