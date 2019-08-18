const Command = require('../faktorycommand.js')

module.exports = class WorkshopUpdateCommand extends Command {
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
		let {wsid, force} = args

		let r = /\D/
		while (wsid.match(r)){
			wsid = wsid.replace(r, '')
		}

		await this.queue('UpdateWorkshop', {wsid, force})
		return msg.say(`Added ${wsid} to the update queue.\nCheck <#611492538674839553> for status changes.`)
	}
}