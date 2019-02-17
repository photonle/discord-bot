process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

// Third Party Libs
const Discord = require("discord.js-commando")
const http = require("https")

// Own Libs
const DiscordUtils = require("./libs/misc.js").DiscordUtils;

// Configs
const pkg = require("./package.json");
const env = require("./.env.json");

// Object Creations
const client = new Discord.Client({
	owner: ["239031520587808769", "142796643589292032", "191255947648172033", "263541113913212929", "221740543045009408"],
	commandPrefix: "!",
	disableEveryone: true,
	unknownCommandResponse: false
});

// Setup Logging
client.logs = require("./libs/logs.js");

// Attach other libraries.
client.utils = new DiscordUtils(client);

// client.on('error', (msg) => {client.logs.error(msg)})
// client.on('warn', (msg) => {client.logs.warn(msg)})
// client.on('debug', (msg) => {client.logs.log(msg)})
// client.on('disconnect', () => {client.logs.warn('Disconnected from socket.')})
// client.on('reconnecting', () => {client.logs.warn('Reconnecting to discord.')})

// File Constants
const token = env.authtoken;

client.registry.registerGroups([
	['ban', 'Banishment'],
	['debug', 'Debugging'],
	['docs', 'Documentation'],
	['misc', 'Miscellaneous']
])
client.registry.registerDefaults()
// client.registry.registerTypesIn(__dirname + "/types")
client.registry.registerCommandsIn(__dirname + "/cmds-commando")


client.on('ready', () => {
	client.generateInvite().then((link) => {console.log(link)});
	client.user.setActivity("VCMod.", {type: 'PLAYING'});
	client.logs.log("Loaded Version " + pkg.version);
});

let schmall = "142796643589292032"
let untaggable = new Set(["142796643589292032", "263541113913212929", "191255947648172033", "221740543045009408"])
let untaggable_roles = new Set(["479485006209613839"])

let no_tag_channels = new Set(["479487537006510086", "517411139374547016"])
let support = new Set(["479485006209613839", "479485091710631936", "517410625203470349"])
let warned = new Set()
client.on('typingStart', (channel, user) => {
	let id = channel.id
	let gm = channel.guild.member(user)
	if (no_tag_channels.has(id) && !warned.has(user.id)){
		channel.send(`Wait, ${user.toString()}! If you're looking for support, please do not tag any of the Core Development Team (red) members. We have a Support Team ready to help you!
Before you tag anyone, please read the pinned messages.

\`\`\`
• Uninstall the last Photon addon you installed before your issue started to occur.
• Try restarting your game.
• Try looking through your code or addons to potentially find something not entered correctly or missing.
• Finally, head over to the Photon wiki page for further help: https://photon.lighting/wiki/index.php?title=Main_Page
\`\`\`

If none of the above has help fixed your issue, go ahead and tag one of the blue Support Team members and they will be with you shortly.`)
		warned.add(user.id)
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
		return
	}
})

http.get("https://samuelmaddock.github.io/glua-docs/data/glua.json", function(res){
	let body = "";
	res.on("data", function(chunk){body += chunk.toString();});
	res.on("end", () => {
		let cmd = client.registry.commands.get("glua")
		if (cmd){
			cmd.dataTable = JSON.parse(body)
		}
	})
})

// Log our bot in
client.login(token);
