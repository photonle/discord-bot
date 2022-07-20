// 3rd Party
const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v10")
const {Client, IntentsBitField: Intents, PermissionsBitField: Permissions} = require("discord.js")
const {Collection} = require("discord.js")

// 1st Party
const filepath = require("path")
const fs = require("fs").promises

// Local Files
const pkg = require("./package")
const util = require("util")

// Destructuring
const Intent = Intents.Flags
const Permission = Permissions.Flags

// Environment
const OWNER = (process.env.OWNER || "239031520587808769").split(",").map(str => str.trim())
const {DISCORD_GUILD: GUILD, DISCORD_TOKEN: TOKEN, DISCORD_CLIENT_ID: CLIENT, SQLITE_PATH: SQLITE} = process.env

const client = new Client({
	intents: [Intent.DirectMessages, Intent.Guilds]
})

client.commands = new Collection()

async function setupCommands(){
	const files = (await fs.readdir(filepath.join(__dirname, "commands"))).filter(file => file.endsWith(".js"))
	for (const file of files){
		console.log(`registering ${file}`)
		const cmd = require(`./commands/${file}`)
		client.commands.set(cmd.data.name, cmd)
	}
}

async function registerCommands(client){
	const rest = (new REST({version: 9})).setToken(TOKEN)

	let cmds = []
	for (let cmd of client.commands.values()){
		cmds.push(cmd.data.toJSON())
	}

	console.log("updating guild commands")
	try {
		await rest.put(
			Routes.applicationGuildCommands(CLIENT, GUILD),
			{body: cmds},
		)
	} catch (e){
		console.error(e);
	}
}

client.on('ready', async () => {
	console.log("login complete")

	let invite = await client.generateInvite({
		scopes: ["applications.commands", "bot"],
		permissions: Permission.SEND_MESSAGES
	})
	console.log(invite)

	client.user.setPresence({
		status: "online",
		afk: false,
		game: {
			name: "with ions.",
			url: "https://photon.lighting",
			type: "PLAYING"
		}
	})
})

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()){
		return;
	}

	const {commandName, options: opts} = interaction
	if (!client.commands.has(commandName)){
		return
	}

	try {
		let cmd = client.commands.get(commandName)
		const callbacks = cmd.callbacks

		let subGroup = opts.getSubcommandGroup(false)
		let subCmd = opts.getSubcommand(false)

		let callback = undefined
		if (subGroup !== null && subCmd !== null){
			try {
				callback = callbacks[subGroup][subCmd]
			} catch (e){}
		} else if (subCmd !== null){
			try {
				callback = callbacks[subCmd]
			} catch (e){}
		} else {
			callback = cmd.execute
		}

		if (callback === undefined){
			let cmdName = [commandName, subGroup, subCmd].filter(Boolean).join(".")
			return interaction.reply({content: `${cmdName} is missing a callback.`, ephemeral: true})
		} else {
			return callback(interaction)
		}
	} catch (e){
		console.error(e)
		return interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
	}
})

client.on("commandError", (cmd, err, msg) => {
	console.error(err)
})

async function main(){
	await setupCommands()
	await client.login(TOKEN)
	await registerCommands(client)
	console.log("started")
}

process.on('uncaughtException', (e) => {console.error(e); process.exit(1)})
process.on('unhandledRejection', (e) => {console.error(e)})

process.on('SIGTERM', async () => {
	console.log("Recieved SIGTERM, hanging up.")
	await client.destroy()
	process.exit(0)
})

main()
