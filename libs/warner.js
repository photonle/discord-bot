const fs = require("fs")

class Warner extends Set {
	constructor(client, file, restrictions = {}){
		super()

		this.file = file
		this.restrictions = restrictions

		let input = fs.createReadStream(file, {encoding: 'utf8'})
		input.on('error',  console.error)

		let remaining = ''
		input.on('data', data => {
			remaining += data
			let index = remaining.indexOf('\n')
			let last  = 0

			while (index > -1) {
				let line = remaining.substring(last, index)
				last = index + 1
				super.add(line)
				index = remaining.indexOf('\n', last)
			}

			remaining = remaining.substring(last)
		})

		input.on('end', () => {
			if (remaining.length > 0) {
				super.add(remaining)
			}
		})

		client.on('typingStart', async (chnl, usr) => {this.processType(chnl, usr)})
	}

	add(id){
		fs.appendFile(this.file, `${id}\n`, (err) => {if (err){console.error(err)}})
		super.add(id)
	}

	async processType(channel, user){
		let cid = channel.id
		let restrict = this.restrictions[cid]
		if (restrict === undefined){return}
		if (!restrict.warn){return}

		let uid = user.id
		if (this.has(uid)){return}

		let gm = channel.guild.member(user)
		if (!gm){return}
		if (gm.roles.some(role => restrict.warnbypass.has(role.id))){return}

		this.add(uid)
		return channel.send(`Hi, ${user}! If you're looking for support, please do not tag any of the Core Development Team (red) members. We have a Support Team ready to help you!

*Before* you tag anyone, please read the pinned messages.
To troubleshoot your issue on your own, please try the following:
	• Uninstall the last Photon addon you installed before your issue started to occur.
	• Try restarting your game.
	• Try looking through your code or addons to potentially find something not entered correctly or missing.
	• Finally, head over to the Photon wiki page for further help: <https://github.com/photonle/Photon/wiki>

If none of the above has help fixed your issue, go ahead and tag one of the blue Support Team members and they will be with you shortly.`)
	}
}

module.exports = Warner