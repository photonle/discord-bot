const Command = require('discord.js-commando').Command
const RichEmbed = require("discord.js").RichEmbed
const pkg = require("../../package.json")

module.exports = class DebugCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'debug',
			group: 'debug',
			memberName: 'debug',
			description: 'Output debug information such as uptime, API latency and version.',
		});
	}

	async run(msg, args){
		let info = msg.client.utils.getDebugInfo()
		let rich = new RichEmbed()
		let up = process.uptime()

		rich.setAuthor("A bot by Doctor Internet", msg.client.users.get("239031520587808769").avatarURL, "https://limelightgaming.net/forums/user-2746.html")
		rich.setDescription("Debug Information")

		rich.addField("Version", `${pkg.name}@${pkg.version}`, true)
		rich.addField("Uptime", up, true)
		rich.addField("Latency", this.client.ping, true)
		rich.setColor([120, 120, 120])

		return msg.channel.send("", rich)
	}
};