const Command = require('../faktorycommand.js')

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
		let r = /\D/
		while (args.wsid.match(r)){
			args.wsid = args.wsid.replace(r, '')
		}
		if (args.wsid.length === 0){
			return msg.reply("that's not a workshop ID or link :<")
		}

		await this.queue('UpdateWorkshop', args)
		return msg.reply(`I've added ${args.wsid} to the update queue.\nCheck <#611492538674839553> for status changes.`)
	}
}