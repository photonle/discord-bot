const {SlashCommandBuilder} = require("@discordjs/builders")

let command = new SlashCommandBuilder()
command.setName("help")
	.setDescription("Get help for various Photon topics..")
	.addSubcommand(command => command
		.setName("components")
		.setDescription("Get help in making custom components.")
	)
	.addSubcommand(command => command
		.setName("skinning")
		.setDescription("Get help skinning vehicles.")
	)

module.exports = {
	data: command,
	callbacks: {
		components(interaction){
			return interaction.reply({content: `Hi there,

The support team at Photon, recommend you watch [this YouTube Video](https://www.youtube.com/watch?v=wDfnP578Ceo) made by Schmal, to assist you making your very own custom component or editing an already existing one to better suit your project!
			`})
		},
		skinning(interaction){
				return interaction.reply({content: `Hi there,
			
Wanna learn to make your own vehicle skin for Garry's Mod? 
Well the support team here recommend that you look at this video, in assistance to helping you skin.

References:
(🇬🇧 / 🇺🇸) Video: <https://youtu.be/5ka7_e3oWD8> 
(🇫🇷) Video: <https://www.youtube.com/watch?v=f3VLrO4HYNs> 
Paint.Net: <https://www.getpaint.net/>
VTFEdit: <https://nemstools.github.io/pages/VTFLib-Download.html>`})
		}
	}
}
