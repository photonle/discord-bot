const Command = require('../workshopcommand')

module.exports = class WorkshopUpdateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'update',
			group: 'photon',
			memberName: 'update',
			description: 'Queue a workshop update job.',
			args: [{
				key: 'wsid',
				label: 'Workshop ID',
				prompt: 'Enter the workshop ID to search.',
				type: 'string',
			}, {
				key: 'force',
				label: 'Force Update',
				prompt: 'Enter if the update should be forced.',
				type: 'boolean',
				default: false
			}]
		})
	}

	async run(msg, args){
		let reply = this.wsid(msg, args)
		if (reply){return reply}

		await this.queue('UpdateWorkshop', args)
		return this.reply(msg, `I've added ${args.wsid} to the update queue.`)
	}
}