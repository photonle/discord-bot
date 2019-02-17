const Command = require('discord.js-commando').Command;
const RichEmbed = require("discord.js").RichEmbed

module.exports = class TroubleshootCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'support',
			group: 'util',
			memberName: 'support',
			description: 'Send a small help message to a user giving basic support.',
		});
	}

	async run(msg, args, _){
		return msg.channel.send(`Make sure you've read the pinned messages.
Please try the following:
	• Uninstall the last Photon addon you installed before your issue started to occur.
	• Try restarting your game.
	• Try looking through your code or addons to potentially find something not entered correctly or missing.
	• Finally, head over to the Photon wiki page for further help: https://photon.lighting/wiki/index.php?title=Main_Page
`)
	}
};