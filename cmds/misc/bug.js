const Command = require('discord.js-commando').Command

module.exports = class SupportCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bug',
			group: 'util',
			memberName: 'bug',
			description: 'Found a bug?',
			args: [{
				key: 'where',
				label: 'Bug Location',
				prompt: 'Where was the bug seen?',
				type: 'string',
				default: 'photon'
			}]
		})
	}

	async run(msg, args, _){
		switch (args.where){
			default:
			case 'photon':
				return msg.say(`Looks like you've found a bug in Photon! Head over to <https://github.com/photonle/Photon/issues/new?labels=bug&template=bug-report.md> and post a bug report.`)
			case 'bot':
				return msg.say(`Looks like you've found a bug in me! Head over to <https://github.com/photonle/Photon-Bot/issues/new?labels=bug&template=bug-report.md> and post a bug report.`)
		}
	}
}