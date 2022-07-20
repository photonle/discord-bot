const Command = require('discord.js-commando').Command
const RichEmbed = require("discord.js").MessageEmbed
const Moment = require("moment")
const pkg = require("../../package.json")

module.exports = class DebugCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'debug',
			group: 'debug',
			memberName: 'debug',
			description: 'Output debug information such as uptime, API latency and version.',
		})
	}

	/**
	 * @param {CommandoMessage} msg The incoming message.
	 * @param {Object|string|Array<string>} args The command arguments.
	 * @param {boolean} _ If the incoming message is from a pattern match.
	 * @returns {Promise<Message>}
	 */
	async run(msg, args, _){
		let rich = new RichEmbed()

		rich.setAuthor("Doctor Internet", msg.client.users.fetch("239031520587808769").avatarURL, "https://doctor-internet.dev")
		rich.setDescription(`A bot by Doctor Internet\n\nDebug Information`)

		rich.addField("Version", `${pkg.name}@${pkg.version}`, true)
		rich.addField("Uptime", Moment.duration(process.uptime(), 's').humanize(), true)
		rich.addField("Latency", Math.round(this.client.ping), true)
		rich.setColor([120, 120, 120])

		return msg.channel.send("", rich)
	}
}