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
	.addSubcommand(command => command
		.setName("workshop_icon")
		.setDescription("Get help making a good Workshop Icon.")
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
	},
			workshop_icon(interaction){
			return interaction.reply({content: `Hi there,

The support team at Photon, recommend the following steps to ensure you can make the best quality workshop icon for your vehicle and/or pack!
• Take a photo of a good distance away and ensure that the vehicle(s) is the key centre
• Make a file in either Photoshop, Paint.net or even Paint. And make sure it is 512x512. 
• Import your image in. 
• And then just make sure that the vehicle is in the centre and can be seen and highlighted well. 
• An example of this is this; (https://cdn.discordapp.com/attachments/650845277011312661/1002193930269499402/unknown.png).

Why do we recommend this?
Because it makes your addon seem more professinal and helps highlights your addon. You can add extra bits to your icon, such as text, banners, highlights, etc; as you seem fit!
It also just looks neater then squishing a photo to fit the 512x512 mark.
			`})
		},
}
