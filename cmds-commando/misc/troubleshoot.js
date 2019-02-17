const Command = require('discord.js-commando').Command;
const RichEmbed = require("discord.js").RichEmbed

module.exports = class TroubleshootCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'troubleshoot',
			group: 'util',
			memberName: 'troubleshoot',
			description: 'Send a small help message to a user.',
		});
	}

	async run(msg, args, _){
		return msg.channel.send("", rich)
	}
};