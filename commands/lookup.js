const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder} = require("@discordjs/builders")
const {inspect} = require("util")
const SQL = require("sql-template-strings")
const {vehiclePage} = require("../libs/search")

let command = new SlashCommandBuilder()
command.setName("lookup")
	.setDescription("Lookup a vehicle or component name from the workshop.")
	.addSubcommandGroup(group => group
		.setName("vehicle")
		.setDescription("Lookup vehicle information from the workshop.")
		.addSubcommand(command => command
			.setName("search")
			.setDescription("Search for vehicles.")
			.addStringOption(option => option
				.setName('query')
				.setDescription('Vehicle name to search for.')
				.setRequired(true)
			)
		)
		.addSubcommand(command => command
			.setName("list")
			.setDescription("List vehicles.")
		)
		.addSubcommand(command => command
			.setName("get")
			.setDescription("Get a single vehicle's information.")
		)
	)
	.addSubcommandGroup(group => group
		.setName("component")
		.setDescription("Lookup component information from the workshop.")
		.addSubcommand(command => command
			.setName("search")
			.setDescription("Search for components.")
		)
		.addSubcommand(command => command
			.setName("list")
			.setDescription("List components.")
		)
		.addSubcommand(command => command
			.setName("get")
			.setDescription("Get a single component.")
		)
	)

function buildRow(next = "null", prev = "null", action = 'vehicle.list'){
	next = !next || next === "null" ? false : next
	prev = !prev || prev === "null" ? false : prev

	let row = new ActionRowBuilder()
	if (prev){
		row.addComponents((new ButtonBuilder()).setStyle(2).setCustomId(`${action}:${String(prev)}`).setLabel("Previous Page"))
	} else {
		row.addComponents((new ButtonBuilder()).setStyle(2).setCustomId(`${action}:disabled.prev`).setDisabled(true).setLabel("Previous Page"))
	}

	if (next){
		row.addComponents((new ButtonBuilder()).setStyle(2).setCustomId(`${action}:${String(next)}`).setLabel("Next Page"))
	} else {
		row.addComponents((new ButtonBuilder()).setStyle(2).setCustomId(`${action}:disabled.next`).setDisabled(true).setLabel("Next Page"))
	}

	return [
		row
	]
}

function buildEmbed(data){
	let embeds = []
	for (let datum of data){
		embeds.push(
			(new EmbedBuilder())
				.setTitle(datum.vehicle)
				.setAuthor({
					url: `https://steamcommunity.com/profiles/${datum.sid}`,
					name: datum.author
				})
				.setFooter({
					text: `From ${datum.addon}`
				})
				.addFields([
					{name: "Addon", value: `[Workshop Link](https://steamcommunity.com/sharedfiles/filedetails/?id=${datum.wsid})`, inline: true}
				])
				// .setURL(`https://steamcommunity.com/sharedfiles/filedetails/?id=${datum.wsid}`)
		)
	}
	return embeds
}

module.exports = {
	data: command,
	async execute(interaction){
		let keys = Object.keys(interaction).join("\n") + "\n" + interaction.commandId + "\n" + interaction.commandName + "\n" + inspect(interaction.options)
		await interaction.reply({content: keys.substring(0, 1800), ephemeral: true})
	},
	callbacks: {
		vehicle: {
			async search(interaction, client){
				let query = interaction.options.getString("query")
				if (!query || query === ''){
					interaction.reply({
						content: "You must give a query to search!",
						ephemeral: true
					})
				}
				query = `%${query}%`
				query = SQL`vehicle LIKE ${query}`

				let {
					nextPage,
					nextPageKey
				} = await vehiclePage(client.pool, '', query)

				if (nextPage.length === 0){
					interaction.reply({
						content: "No vehicles were found with that name!",
					})
				} else if (nextPage.length < 5){
					return interaction.reply({
						embeds: buildEmbed(nextPage)
					})
				} else {
					client.on('interactionButtonClicked', async (click) => {
						let id = click.customId
						let action
						[action, id] = id.split(":")
						if (action !== "vehicle.list"){
							return
						}
						if (id.startsWith("disabled")){
							return
						}

						let {
							nextPage,
							nextPageKey,
							lastPageKey
						} = await vehiclePage(client.pool, id, query)

						click.update({
							components: buildRow(nextPageKey, lastPageKey),
							embeds: buildEmbed(nextPage)
						})
					})

					await interaction.reply({
						components: buildRow(nextPageKey, false),
						embeds: buildEmbed(nextPage)
					})
				}

			},
			async list(interaction, client){
				let {
					nextPage,
					nextPageKey
				} = await vehiclePage(client.pool, '')

				if (nextPage.length === 0){
					interaction.reply({
						content: "No vehicles are stored!",
					})
				} else if (nextPage.length < 5){
					return interaction.reply({
						embeds: buildEmbed(nextPage)
					})
				} else {
					client.on('interactionButtonClicked', async (click) => {
						let id = click.customId
						let action
						[action, id] = id.split(":")
						if (action !== "vehicle.list"){
							return
						}
						if (id.startsWith("disabled")){
							return
						}

						let {
							nextPage,
							nextPageKey,
							lastPageKey
						} = await vehiclePage(client.pool, id)

						click.update({
							components: buildRow(nextPageKey, lastPageKey),
							embeds: buildEmbed(nextPage)
						})
					})

					await interaction.reply({
						components: buildRow(nextPageKey, false),
						embeds: buildEmbed(nextPage)
					})
				}

			},
			async get(interaction){
				await interaction.reply({content: "lookup.vehicle.get", ephemeral: true})
			}
		}
	}
}
