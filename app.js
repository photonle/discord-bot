const Discord = require("discord.js-commando")
const http = require("https")
const fs = require("fs")

const pkg = require("./package.json")
const env = require("./.env.json")

const client = new Discord.Client({
	owner: ['239031520587808769', '142796643589292032', '191255947648172033', '263541113913212929', '221740543045009408'],
	commandPrefix: '!',
	disableEveryone: true,
	unknownCommandResponse: false
})
client.logs = require("./libs/logs.js")

client.on('error', client.logs.error)
client.on('warn', client.logs.warn)
client.on('disconnect', () => {client.logs.warn('Disconnected from socket.')})
client.on('reconnecting', () => {client.logs.warn('Reconnecting to discord.')})

client.registry.registerGroups([
	['debug', 'Debugging'],
	['docs', 'Documentation'],
	['misc', 'Miscellaneous'],
	['help', 'Help'],
])
client.registry.registerDefaults()
client.registry.registerCommandsIn(__dirname + "/cmds")


client.on('ready', () => {
	client.generateInvite().then(() => console.log)
	client.user.setActivity("VCMod.", {type: 'PLAYING'});
	client.logs.log("Loaded Version " + pkg.version);
});

let schmall = "142796643589292032"
let untaggable = new Set(["142796643589292032", "263541113913212929", "191255947648172033", "221740543045009408"])
let untaggable_roles = new Set(["479485006209613839"])

let no_tag_channels = new Set(["479487537006510086", "517411139374547016"])
let support = new Set(["479485006209613839", "479485091710631936", "517410625203470349"])
let warned = new Set()

let locked_warn = false
function writeSet(file, set){
	if (locked_warn){return}
	locked_warn = true

	let str = fs.createWriteStream(file)
	str.on('ready', () => {
		for (let obj of set){str.write(obj.toString(); str.write('\n'))}
		str.close()
		locked_warn = false
	})
	str.on('error', () => {
		locked_warn = false
	})
}

function readLines(file, func){
	let input = fs.createReadStream(file, {encoding: 'utf8'})
	input.on('error', (err) => {console.error(err)})

	let remaining = ''
	input.on('data', function(data) {
		remaining += data
		let index = remaining.indexOf('\n')
		let last  = 0

		while (index > -1) {
			let line = remaining.substring(last, index)
			last = index + 1
			func(line)
			index = remaining.indexOf('\n', last)
		}

		remaining = remaining.substring(last)
	})

	input.on('end', function() {
		if (remaining.length > 0) {
			func(remaining)
		}
	})
}
readLines('/app/warned', (id) => {
	warned.add(id)
})


client.on('typingStart', async (channel, user) => {
	let id = channel.id
	let gm = channel.guild.member(user)
	if (no_tag_channels.has(id) && !warned.has(user.id) && (!gm || !gm.roles.some((role) => {return support.has(role.id)}))){
		channel.send(`Hi, ${user.toString()}! If you're looking for support, please do not tag any of the Core Development Team (red) members. We have a Support Team ready to help you!

*Before* you tag anyone, please read the pinned messages.
To troubleshoot your issue on your own, please try the following:
	• Uninstall the last Photon addon you installed before your issue started to occur.
	• Try restarting your game.
	• Try looking through your code or addons to potentially find something not entered correctly or missing.
	• Finally, head over to the Photon wiki page for further help: <https://photon.lighting/wiki/index.php?title=Main_Page>

If none of the above has help fixed your issue, go ahead and tag one of the blue Support Team members and they will be with you shortly.`)
		warned.add(user.id)
		writeSet('/app/warned', warned)
	}
})

client.on('message', (message) => {
	if (message.author.bot){return}

	let channel = message.channel
	let cid = channel.id

	let mentions = message.mentions
	if (mentions.members && mentions.members.some((member) => schmall === member.id) && !untaggable.has(message.member.id)){
		channel.send(`Hey ${message.author.toString()}, you don't really need to tag schmal. He's a busy guy.`)
		message.delete()
		return
	}

	if (!no_tag_channels.has(cid)){return}
	if (!message.member || message.member.roles.some((role) => {return support.has(role.id)})){return}

	if (mentions.members && mentions.members.some((member) => untaggable.has(member.id))){
		channel.send(`Hey ${message.author.toString()}. Are you sure you need to tag the core dev team members?`)
		message.delete()
		return
	}
	if (mentions.roles && mentions.roles.some((role) => untaggable_roles.has(role.id))){
		channel.send(`Hey ${message.author.toString()}. Are you sure you need to tag the core dev team members?`)
		message.delete()
	}
})

// http.get("https://samuelmaddock.github.io/glua-docs/data/glua.json", function(res){
// 	let body = "";
// 	res.on("data", function(chunk){body += chunk.toString();});
// 	res.on("end", () => {
// 		let cmd = client.registry.commands.get("glua")
// 		if (cmd){
// 			console.log(body)
// 			cmd.dataTable = JSON.parse(body)
// 		}
// 	})
// })

let cmd = client.registry.commands.get("glua")
if (cmd){cmd.dataTable = require('./libs/glua.json')}

// Log our bot in
client.login(env.authtoken)

process.on('uncaughtException', (e) => {console.error(e); process.exit(1)})
process.on('unhandledRejection', console.error)