const { Discord, SlashCommandBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const Pagination = require('customizable-discordjs-pagination');
const VAPI = require('../vapi.js');

// Return an embed
function getEmbed(jsonArrayPosition, userData, playerMatches) {
    const embed = new EmbedBuilder()
            .setColor(0xFA4454)
            .setTitle(`${JSON.stringify(userData.data.name).replace(/"/g, '')}'s Match History`)
            .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0ViRuhE2KJirJx9yvzxAQP7oqN54LqfpVR1M249U&s')
            .addFields(
                { name: 'Gamemode', value: `${JSON.stringify(playerMatches.data[jsonArrayPosition].metadata.mode).replace(/"/g, '')}` },
                { name: 'Map', value: `${JSON.stringify(playerMatches.data[jsonArrayPosition].metadata.map).replace(/"/g, '')}` },
                { name: 'Agent', value: `${getPlayerCharacterByPUUID(playerMatches.data[jsonArrayPosition].players, JSON.stringify(userData.data.puuid).replace(/"/g, ''))}` },
                { name: 'KDA', value: `${getPlayerKillsByPUUID(playerMatches.data[jsonArrayPosition].players, JSON.stringify(userData.data.puuid).replace(/"/g, ''))}/${getPlayerDeathsByPUUID(playerMatches.data[jsonArrayPosition].players, JSON.stringify(userData.data.puuid).replace(/"/g, ''))}/${getPlayerAssistsByPUUID(playerMatches.data[jsonArrayPosition].players, JSON.stringify(userData.data.puuid).replace(/"/g, ''))}` },
                { name: 'Headshot Accuracy', value: `${isDeathmatch(playerMatches.data[jsonArrayPosition].metadata) ? 'N/A' : (getPlayerHeadshotAccuracyByPUUID(playerMatches.data[jsonArrayPosition].players, JSON.stringify(userData.data.puuid).replace(/"/g, ''))).concat('%')}` },
            );
    return embed;
}

// Return player kills/assists/deaths by comparing puuid
function getPlayerKillsByPUUID(data, puuid) {
    for (let i = 0; i < 10; i++) {
        if (data.all_players[i].puuid == puuid) {
            return data.all_players[i].stats.kills;
        };
    };
};

function getPlayerAssistsByPUUID(data, puuid) {
    for (let i = 0; i < 10; i++) {
        if (data.all_players[i].puuid == puuid) {
            return data.all_players[i].stats.assists;
        };
    };
};

function getPlayerDeathsByPUUID(data, puuid) {
    for (let i = 0; i < 10; i++) {
        if (data.all_players[i].puuid == puuid) {
            return data.all_players[i].stats.deaths;
        };
    };
};

// Return Headshot accuracy as a percentage
function getPlayerHeadshotAccuracyByPUUID(data, puuid) {
    for (let i = 0; i < 10; i++) {
        if (data.all_players[i].puuid == puuid) {
            const headshots = data.all_players[i].stats.headshots;
            const bodyshots = data.all_players[i].stats.bodyshots;
            const legshots = data.all_players[i].stats.legshots;
            const headshotAccuracy = (headshots / (headshots + bodyshots + legshots)) * 100;

            return headshotAccuracy.toFixed(1);
        };
    };
};

// Returns the agent played by the player during the match
function getPlayerCharacterByPUUID(data, puuid) {
    for (let i = 0; i < 10; i++) {
        if (data.all_players[i].puuid == puuid) {
            return data.all_players[i].character;
        };
    };
};

// Check if gamemode is deathmatch
function isDeathmatch(data) {
    if (data.game == 'Deathmatch') {
        return true;
    };
    return false;
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('match')
        .setDescription('Get users past 10 games in valorant. /match <user> <tag>')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Users name without the tag')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tag')
                .setDescription('Users tag')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const matches = {};
        const _size = 10; // Number of matches to get
        const username = interaction.options.get('username'); // Player username
        const tag = interaction.options.get('tag'); // Player tag
        const userData = await VAPI.fetchAccount(username.value, tag.value);
        // Validation: If user does not exist reply with error
        if (userData.status != '200') {
            await interaction.editReply('An error has occurred!\nPlease try again later. <3');
            return;
        }
        // Player match history as json object
        const playerMatches = await VAPI.fetchMatches(`${JSON.stringify(userData.data.region).replace(/"/g, '')}`, username.value, tag.value, _size.toString());

        /**
         * Format Embed
         * This will show an embed with 2 buttons
         * There are 10 pages
         * Each embed is created using the for loop below
         * The for loop goes through and dynamically adds 10 variables (10 embeds)
         * For more information about how this is done check ../command-breakdown/matchjs.md
         */
        for (let i = 0; i < _size; i++) {
            matches[i] = getEmbed(i, userData, playerMatches);
        }


        // Array of embeds to be put into pages
        const pages = [matches[0], matches[1], matches[2], matches[3], matches[4], matches[5], matches[6], matches[7], matches[8], matches[9]];

        // DiscordJS V14 Buttons
        const buttons = [
            { label: 'Previous', emoji: '⬅', style: ButtonStyle.Danger },
            { label: 'Next', emoji: '➡', style: ButtonStyle.Success },
        ];

        // Create and send the embeds
        new Pagination()
            .setCommand(interaction)
            .setPages(pages)
            .setButtons(buttons)
            .setPaginationCollector({ timeout: 120000 })
            .setSelectMenu({ enable: false })
            .setFooter({ enable: true })
            .send();
    },
};