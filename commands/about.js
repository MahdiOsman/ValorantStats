const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const VAPI = require('../vapi.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('About the bot and Disclaimer.'),
    async execute(interaction) {
        // Date
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);

        // Format Embed
        const replyEmbed = new EmbedBuilder()
        .setColor(0xFA4454)
        .setTitle('ValorantStats Bot')
        .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0ViRuhE2KJirJx9yvzxAQP7oqN54LqfpVR1M249U&s')
        .addFields(
            { name: 'About', value: 'This was made as a personal project in order to test out Riot Games\' Valorant API' },
            { name: 'Disclaimer', value: 'We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with Riot Games.' },
        )
        .setFooter({ text: today.toUTCString() });

        // Bot Reply
        try {
            await interaction.reply({ embeds: [replyEmbed] });
        } catch (err) {
            console.error(err);
        }
    },
};