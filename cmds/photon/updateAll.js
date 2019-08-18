const Command = require('../faktorycommand.js')

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
		return msg.say(`Added bulk update job to the update queue.\nCheck <#611492538674839553> for status changes.`)
	}
}