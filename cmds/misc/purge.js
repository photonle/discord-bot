const Promise = require("promise")
const Command = require("discord.js-commando").Command

module.exports = class PurgeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'purge',
			group: 'util',
			memberName: 'purge',
			description: 'Purge messages from a channel',
			clientPermissions: ['MANAGE_MESSAGES'],
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					key: 'purge',
					label: 'Purge',
					prompt: 'Number of Messages to Purge',
					type: 'integer',
					min: 1,
					default: 1
				},
			]
		})
	}

	/**
	 * @param {CommandMessage} msg The incoming message.
	 * @param {Object|string|Array<string>} args The command arguments.
	 * @param {boolean} _ If the incoming message is from a pattern match.
	 * @returns {Promise<Message>}
	 */
	async run(msg, args, _){return do_purge(msg, msg.id, args.purge, 0)}
}

function purge_messages(chnl, before, max){
	console.log("running purge of " + max + " prior to " + before)
	let count = 0
	let pre_count = 0

	return new Promise((suc, fail) => {
		chnl.messages.fetch({limit: max, before: before})
			.then((msgs) => {
				pre_count = msgs.keyArray().length
				before = msgs.reduce((t, v) => {return Math.min(t, v.id)}, before)
				msgs.filter((v) => {return !v.pinned}).map((v) => v.delete())
				count = msgs.keyArray().length

				return Promise.all(msgs)
			})
			.then(() => {
				suc([count, pre_count, before])
			})
			.catch((err) => {fail(err)})
	})
}

function do_purge(msg, before, left, done){
	function decide(data){
		let [deleted, unfiltered, id] = data
		left = left - deleted

		if (deleted === 0 && unfiltered === 0){
			return msg.reply(`deleted ${done + deleted} messages.`)
		} else if (left > 0){
			return do_purge(msg, id, left, done + deleted)
		} else {
			return msg.reply(`deleted ${done + deleted} messages.`)
		}
	}

	return purge_messages(msg.channel, before, Math.min(left, 100)).then(decide)
}