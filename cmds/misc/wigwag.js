const Command = require('discord.js-commando').Command

module.exports = class SupportCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wigwag',
			group: 'util',
			memberName: 'wigwag',
			description: 'Do you do wigwags properly?',
		})
	}

	async run(msg, args, _){
		return msg.say(`Seems like you don't know how to wigwag properly. What a shame. Here, take this: <https://docs.google.com/document/d/1ksWNVhNDi_NaUy1kZOu5aD8wsGJQaC4RCO-_ZZfy14w/edit> `)
	}
}
