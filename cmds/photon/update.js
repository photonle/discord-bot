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
			}]
		})
	}

	async run(msg, args){
		let {wsid} = args

		let r = /\D/
		while (wsid.match(r)){
			wsid = wsid.replace(r, '')
		}

		await this.queue('UpdateWorkshop', {wsid})
		return msg.say(`queued ${wsid}`)
	}
}