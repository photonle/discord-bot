const Command = require('../workshopcommand')

module.exports = class WorkshopUpdateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'updateall',
			group: 'photon',
			memberName: 'updateall',
			description: 'Queue a global workshop update.',
			ownerOnly: true,
			args: [{
				key: 'force',
				label: 'Force Update',
				prompt: 'Enter if the update should be forced.',
				type: 'boolean',
				default: false
			}]
		})
	}

	async run(msg, args){
		await this.queue('UpdateAllWorkshop', args)
		return this.reply(msg, `I've added a bulk update to the queue.`)
	}
}