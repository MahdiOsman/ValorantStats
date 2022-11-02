const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const VAPI = require('../vapi.js');

// Return custom emoji id
function getRankEmoji(rank) {
    switch (rank) {
        case 'Iron 1':
            return '<:Iron_1_Rank:1037306954051239936>';
        case 'Iron 2':
            return '<:Iron_2_Rank:1037306955561189427>';
        case 'Iron 3':
            return '<:Iron_3_Rank:1037306957155012628>';
        case 'Bronze 1':
            return '<:Bronze_1_Rank:1037306932098252830>';
        case 'Bronze 2':
            return '<:Bronze_2_Rank:1037306933809516544>';
        case 'Bronze 3':
            return '<:Bronze_3_Rank:1037306935709544520>';
        case 'Silver 1':
            return '<:Silver_1_Rank:1037306965589774419>';
        case 'Silver 2':
            return '<:Silver_2_Rank:1037306967233937438>';
        case 'Silver 3':
            return '<:Silver_3_Rank:1037306969196867694>';
        case 'Gold 1':
            return '<:Gold_1_Rank:1037306941510271016>';
        case 'Gold 2':
            return '<:Gold_2_Rank:1037306943234113601>';
        case 'Gold 3':
            return '<:Gold_3_Rank:1037306946497286194>';
        case 'PLatinum 1':
            return '<:Platinum_1_Rank:1037306959109562449>';
        case 'Platinum 2':
            return '<:Platinum_2_Rank:1037306960564981790>';
        case 'Platinum 3':
            return '<:Platinum_3_Rank:1037306962406297630>';
        case 'Diamond 1':
            return '<:Diamond_1_Rank:1037306937089470544>';
        case 'Diamond 2':
            return '<:Diamond_2_Rank:1037306938557485146>';
        case 'Diamond 3':
            return '<:Diamond_3_Rank:1037306939987734640>';
        case 'Ascendant 1':
            return '<:Ascendant_1_Rank:1037306926796644392>';
        case 'Ascendant 2':
            return '<:Ascendant_2_Rank:1037306928365305916>';
        case 'Ascendant 3':
            return '<:Ascendant_3_Rank:1037306929971724369>';
        case 'Immortal 1':
            return '<:Immortal_1_Rank:1037306948200181760>';
        case 'Immortal 2':
            return '<:Immortal_2_Rank:1037306950309924885>';
        case 'Immortal 3':
            return '<:Immortal_3_Rank:1037306952545484840>';
        case 'Radiant':
            return '<:Radiant_Rank:1037306963970772992>';
    }
    return '`Error emoji not found.`';
}

// Concatenate 2 strings and return one string
function concat(str, str2) {
    return str + ' ' + str2;
}

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
        if (jsonData.status != '200') {
            await interaction.reply('An error has occurred!\nPlease try again later. <3');
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
            { name:  'Rank', value: `${concat(JSON.stringify(playerRank.data.current_data.currenttierpatched).replace(/"/g, ''), getRankEmoji(JSON.stringify(playerRank.data.current_data.currenttierpatched).replace(/"/g, '')))}` },
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