const Command = require('../workshopcommand')

module.exports = class WorkshopUpdateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remove',
			group: 'photon',
			memberName: 'remove',
			description: 'Queue a workshop remove job.',
			args: [{
				key: 'wsid',
				label: 'Workshop ID',
				prompt: 'Enter the workshop ID to clear data for.',
				type: 'string',
			}]
		})
	}

	async run(msg, args){
		let reply = this.wsid(msg, args)
		if (reply){return reply}

		await this.queue('RemoveWorkshop', args)
		return this.reply(msg, `I've added ${args.wsid} to the removal queue.`)
	}
}