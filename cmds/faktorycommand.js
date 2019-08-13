const Command = require("discord.js-commando").Command
const faktory = require("faktory-worker")

module.exports = class CarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'update',
			group: 'util',
			memberName: 'update',
			description: 'Queue a workshop update job.',
			args: [{
				key: 'wsid',
				label: 'Workshop ID',
				prompt: 'Enter the workshop ID to search.',
				type: 'string',
			}]
		})
	}

	async queue(job, data = {}){
		let client = await faktory.connect()
		await client.job(job, data).push()
		await client.close()
	}
}