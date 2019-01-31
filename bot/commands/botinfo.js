const { resolveUser } = require('../../Util.js');
const { r } = require('../../ConstantStore.js');

module.exports = {
    help: {
        description: 'info on a bot'
    }
};

module.exports.run = async (client, msg, args) => {
    const bot = await resolveUser(msg, args, client);
    if (!bot) return msg.channel.send('A user mention, id, or tag is required');
    if (!bot.bot) return msg.channel.send('The given user is not a bot');
    const botRow = await r.table('bots').get(bot.id);
    if (!botRow) return msg.channel.send('That bot is not listed on discordboats.club');
    const owner = await client.users.fetch(botRow.ownerID);
    const embed = {
        title: `Bot Info - ${bot.tag}`,
        color: client.config.embedColor,
        thumbnail: {
            url: bot.displayAvatarURL()
        },
        description: botRow.shortDescription || 'No short description',
        footer: {
            text: `Bot Info | Requested by ${msg.author.username}`,
            icon_url: client.user.displayAvatarURL()
        },
        fields: [
            {
                name: 'Prefix',
                value: botRow.prefix.trim() || 'Unknown',
                inline: true
            },
            {
                name: 'Tag',
                value: bot.tag,
                inline: true
            },
            {
                name: 'Owner',
                value: owner.toString(),
                inline: true
            },
            {
                name: 'Library',
                value: botRow.library || 'Unknown',
                inline: true
            },
            {
                name: 'Links',
                value: [bot.id && `[Page](${client.config.baseURL}/bot/${bot.id$})`, botRow.github && `[Repo](${botRow.github})`, botRow.website && `[Website](${botRow.website})`, `[Invite](${botRow.invite})`].filter(l => l).join(' | ') || 'No Links',
                inline: true
            }
        ]
    };
    msg.channel.send({ embed });
};