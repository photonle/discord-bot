const sqlite = require("sqlite")
let db
const SQL = require('sql-template-strings')
const Command = require("discord.js-commando").Command

module.exports = class GLuaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'path',
			group: 'util',
			memberName: 'path',
			description: 'Search for lua paths used in photon addons.',
			args: [{
				key: 'path',
				label: 'Search Path',
				prompt: 'Enter the path to search.',
				type: 'string',
			}]
		})
	}

	async run(msg, args, _){
		let matches = await db.all(SQL`SELECT * FROM files WHERE path = ${args.path}`)
		msg.say(` ${matches}`)
	}
}

async function main(){
	db = await sqlite.open("/app/photon.read.db")
}
main()