const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const VAPI = require('../vapi.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Get users rank in valorant. /rank <user> <tag>')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Users name without the tag')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tag')
                .setDescription('Users tag')
                .setRequired(true)),
    async execute(interaction) {
        const username = interaction.options.get('username');
        const tag = interaction.options.get('tag');
        // GET Requests
        const jsonData = await VAPI.fetchAccount(username.value, tag.value);
        // Validation: If user does not exist reply with error
        if (jsonData.status == '404') {
            await interaction.reply('User not found!');
            return;
        }
        const playerRank = await VAPI.fetchRank('v2', 'mmr', `${JSON.stringify(jsonData.data.region).replace(/"/g, '')}`, `${JSON.stringify(jsonData.data.puuid).replace(/"/g, '')}`);

        // Format Embed
        const replyEmbed = new EmbedBuilder()
        .setColor(0xFA4454)
        .setTitle(`${JSON.stringify(jsonData.data.name).replace(/"/g, '')}'s Account Details`)
        .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0ViRuhE2KJirJx9yvzxAQP7oqN54LqfpVR1M249U&s')
        .addFields(
            { name: 'Username', value: `${JSON.stringify(jsonData.data.name).replace(/"/g, '')}#${JSON.stringify(jsonData.data.tag).replace(/"/g, '')}` },
            { name: 'Level', value:  `${JSON.stringify(jsonData.data.account_level).replace(/"/g, '')}` },
            { name: 'Region', value:  `${JSON.stringify(jsonData.data.region).replace(/"/g, '')}` },
            { name:  'Rank', value: `${JSON.stringify(playerRank.data.current_data.currenttierpatched).replace(/"/g, '')}` },
        )
        .setImage(`${JSON.stringify(jsonData.data.card.wide).replace(/"/g, '')}`);

        // Bot Reply
        try {
            await interaction.reply({ embeds: [replyEmbed] });
        } catch (err) {
            console.error(err);
        }
    },
};