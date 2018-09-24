const { Client, RichEmbed } = require('discord.js');
const client = module.exports = new Client({ disableEveryone: true });

const resolveUser = require('./botutils/resolveUser.js');
const { r } = require('./index.js');

const color = 7506394;

client.once('ready', () => {
    console.log(`[discord] logged in as ${client.user.tag}`);
    client.user.setActivity('with boats');
});

client.once('message', msg => {
    if (msg.author.bot) return;

    if (msg.content.indexOf('-') !== 0) return;

    const args = msg.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'botinfo':
            if (!args[0]) return msg.channel.send('You must specify a bot!');
            resolveUser(args.join(' ')).then(user => {
                if (!user.bot) return msg.channel.send('This user is not a bot!');
                r.table('bots').get(user.id).run().then(bot => {
                    const embed = new RichEmbed()
                    .setTitle(bot.username)
                    .setColor(color)
                    .setThumbnail(bot.avatarUrl)
                    .setDescription(bot.shortDesc)
                    .setFooter(`Botinfo | Requested by ${msg.author.username}`, client.user.displayAvatarURL)
                    .addField('Prefix', bot.prefix, true)
                    .addField('Username', bot.username, true)
                    .addField('Discriminator', bot.discrim, true)
                    .addField('Owner', bot.otherOwnersIds ? `<@${bot.ownerID}>, ${bot.otherOwnersIds.map(id => `<@${id}>`).join(', ')}` : `<@${bot.ownerID}>`, true)
                    .addField('Library', bot.library, true)
                    .addField('Views', bot.views, true)
                    .addField('Links', `${bot.github ? `[GitHub](${bot.github})`: 'No GitHub'} | ${bot.website ? `[Website](${bot.website})`: 'No Website'} | [Invite](${bot.invite})`);

                    msg.channel.send(embed);
                })
            })
            break;
    }
});
