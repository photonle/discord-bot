const Command = require('./faktorycommand')

module.exports = class WorkshopUpdateCommand extends Command {
	async run(msg, args){
		let {wsid, force} = args

		let r = /\D/
		while (wsid.match(r)){
			wsid = wsid.replace(r, '')
		}

		await this.queue('RemoveWorkshop', args)
		return msg.say(`Added ${wsid} to the update queue.\nCheck <#611492538674839553> for status changes.`)
	}

	/**
	 * Returns all numeric characters from a given string, or false if none exist.
	 * @param wsid string Input string to check
	 * @returns {boolean|string}
	 */
	static checkWsid(wsid){
		let r = /\D/
		while (wsid.match(r)){
			wsid = wsid.replace(r, '')
		}

		if (wsid.length === 0){
			return false
		} else {
			return wsid
		}
	}

	reply(msg, str){
		return msg.reply(`${str}\nCheck <#611492538674839553> for status changes.`)
	}
}