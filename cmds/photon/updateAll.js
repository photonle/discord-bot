const Command = require('../faktorycommand.js')

module.exports = class WorkshopUpdateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'updateAll',
			group: 'util',
			memberName: 'updateAll',
			description: 'Queue a global workshop update.',
			ownerOnly: true
		})
	}

	async run(msg, args){
		await this.queue('UpdateAllWorkshop')
		return msg.say(`Added bulk update job to the update queue.\nCheck <#611492538674839553> for status changes.`)
	}
}