const Command = require('discord.js-commando').Command

module.exports = class SupportCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'feature',
			group: 'util',
			memberName: 'feature',
			description: 'Request a feature.'
		})
	}

	async run(msg, args, _){
		switch (args.where){
			default:
			case 'photon':
				return msg.say(`That looks like a good idea! Head over to <https://github.com/photonle/Photon/issues/new?labels=feature&template=feature-request.md> and post a feature request!`)
			case 'bot':
				return msg.say(`That looks like a good idea! Head over to <https://github.com/photonle/Photon-Bot/issues/new?labels=feature&template=feature-request.md> and post a feature request!`)
		}
	}
}