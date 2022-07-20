class TagHandler {
	constructor(client, untaggable = {}, restrictions = {}){
		this.untaggable = untaggable
		this.restrictions = restrictions

		client.on("message", message => this.handleGlobalTag(message))
		client.on("message", message => this.handleChannelTag(message))
		client.on("messageUpdate", (_, message) => this.handleGlobalTag(message))
		client.on("messageUpdate", (_, message) => this.handleChannelTag(message))
	}

	handleGlobalTag(message){
		if (message.author.bot){return}

		let uid = message.author.id
		if (this.untaggable[uid] !== undefined){return}

		let mentions = message.mentions
		if (!mentions.members){return}

		if (!mentions.members.some(mbr => this.untaggable[mbr.id] === 1)){return}
		let blocked = mentions.members.filter((mbr) => this.untaggable[mbr.id] === 1)
		let block = blocked.array().map(user => user.displayName).join(" or ")
		let phrase = blocked.size === 1 ? "They're a busy person." : "They're busy people."

		message.channel.send(`Hey ${message.author}, you don't really need to tag ${block}. ${phrase}`)
		message.delete()
	}

	handleChannelTag(message){
		if (message.author.bot){return}
		if (this.untaggable[message.author.id] !== undefined){return}

		let cid = message.channel.id
		let restrict = this.restrictions[cid]
		if (restrict === undefined){return}
		if (message.member.roles.cache.some(role => restrict.warnbypass.has(role.id))){return}

		let mentions = message.mentions
		if (mentions.members && mentions.members.some(member => restrict.members.has(member.id))){
			let blocked = mentions.members.filter(member => restrict.members.has(member.id))
			let block = blocked.array().map(user => user.displayName).join(" or ")
			message.channel.send(`Hey ${message.author}, you don't really need to tag ${block}. ${restrict.message}`)
			message.delete()
			return
		}

		if (mentions.roles && mentions.roles.some(role => restrict.roles.has(role.id))){
			let blocked = mentions.members.filter(member => restrict.roles.has(member.id))
			let block = blocked.array().map(role => role.name).join(" or ")
			let phrase = blocked.size === 1 ? "They're a busy person." : "They're busy people."
			message.channel.send(`Hey ${message.author}, you don't really need to tag ${block}.`)
			message.delete()
			return
		}
	}
}

module.exports = TagHandler