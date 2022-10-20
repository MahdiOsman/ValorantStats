const { Discord, SlashCommandBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const Pagination = require('customizable-discordjs-pagination');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Testing multipage embeds'),
    async execute(interaction) {
        // Format Embed
        const embed1 = new EmbedBuilder()
            .setColor(0xFA4454)
            .setTitle('TEST')
            .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0ViRuhE2KJirJx9yvzxAQP7oqN54LqfpVR1M249U&s')
            .addFields(
                { name: 'TEST', value: 'TEST' },
            );
        const embed2 = new EmbedBuilder()
            .setColor(0xFA4454)
            .setTitle('TEST')
            .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0ViRuhE2KJirJx9yvzxAQP7oqN54LqfpVR1M249U&s')
            .addFields(
                { name: 'TEST', value: 'TEST' },
            );
        const embed3 = new EmbedBuilder()
            .setColor(0xFA4454)
            .setTitle('TEST')
            .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0ViRuhE2KJirJx9yvzxAQP7oqN54LqfpVR1M249U&s')
            .addFields(
                { name: 'TEST', value: 'TEST' },
            );

        const pages = [embed1, embed2, embed3];
        const timeout = 120000;
        const slashMenu = true;

        // DiscordJS V14
        const buttons = [
            { label: 'Previous', emoji: '⬅', style: ButtonStyle.Danger },
            { label: 'Next', emoji: '➡', style: ButtonStyle.Success },
        ];

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