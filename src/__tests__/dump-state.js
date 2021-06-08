/* eslint-disable no-process-exit */
/**
 * A small helper script to generate a json snapshot blob
 */

const { Atem } = require('atem-connection')
const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)
if (args.length < 1) {
	console.log('Usage: node dump-state.js <atem-ip>')
	console.log('eg: node dump-state.js 10.42.13.99')
	process.exit()
}

const conn = new Atem({ debug: true })
conn.on('error', console.log)

function writeJson(fileName, data) {
	const filePath = path.resolve(__dirname, fileName)
	fs.writeFileSync(filePath, JSON.stringify(data, undefined, '\t'))
}

conn.once('connected', () => {
	writeJson(`./state.json`, conn.state)
	console.log('Wrote state file')

	// All done now!
	process.exit()
})

console.log(`Connecting to "${args[0]}"`)
conn.connect(args[0])
