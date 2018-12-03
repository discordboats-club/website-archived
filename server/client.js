const { Client } = require('discord.js');
const { inspect } = require('util');
const client = module.exports = new Client({ disableEveryone: true });

const resolveUser = require('./botutils/resolveUser.js');
const { r } = require('./index.js');

const color = 7506394;
const prefix = 'dbc ';

client.once('ready', () => {
    console.log(`[discord] logged in as ${client.user.tag}`);
    client.user.setActivity('with boats');
});

client.on('message', async msg => {
    if (msg.author.bot || !msg.content.toLowerCase().startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).split(/ +/g);
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'say':
            if (!msg.guild || msg.guild.id !== '482022278758924298') return;
            msg.channel.send(args.join(' '), { disableEveryone: true });
            break;
        case 'botinfo':
            if (!args[0]) return msg.channel.send('You must specify a bot!');
            resolveUser(client, args.join(' ')).then(user => {
                if (!user.bot) return msg.channel.send('This user is not a bot!');
                r.table('bots').get(user.id).run().then(bot => {
                    msg.channel.send({
                        embed: {
                            title: bot.username,
                            color: color,
                            thumbnail: {
                                url: bot.avatarUrl
                            },
                            description: bot.shortDesc,
                            footer: {
                                text: `Botinfo | Requested by ${msg.author.username}`,
                                icon_url: client.user.avatarURL
                            },
                            fields: [
                                {
                                    name: 'Prefix',
                                    value: bot.prefix,
                                    inline: true
                                },
                                {
                                    name: 'Tag',
                                    value: `${bot.username}#${bot.discrim}`,
                                    inline: true
                                },
                                {
                                    name: 'Owner',
                                    value: bot.otherOwnersIds ? `<@${bot.ownerId}>, ${bot.otherOwnersIds.map(id => `<@${id}>`).join(', ')}` : `<@${bot.ownerId}>`,
                                    inline: true
                                },
                                {
                                    name: 'Library',
                                    value: bot.library,
                                    inline: true
                                },
                                {
                                    name: 'Views',
                                    value: bot.views,
                                    inline: true
                                },
                                {
                                    name: 'Links',
                                    value: `${bot.github ? `[Repo](${bot.github})` : 'No Repo'} | ${bot.website ? `[Website](${bot.website})` : 'No Website'} | [Invite](${bot.invite})`
                                }
                            ]
                        }
                    });
                });
            }).catch(err => {
                msg.channel.send('Unable to find any users from your query!');
            });
            break;
        case 'bots':
            if (args[0]) {
                resolveUser(client, args.join(' ')).then(user => {
                    if (user.bot) return msg.channel.send('Bots can\'t own bots!');
                    r.table('bots').filter({ ownerId: user.id }).run().then(ownedBots => {
                        
                        msg.channel.send({
                            embed: {
                                title: `${user.username}'s Bots`,
                                color: color,
                                description: ownedBots.map(bot => `<@${bot.id}>`).join(',\n'),
                                footer: {
                                    text: `Bots | Requested by ${msg.author.username}`, 
                                    icon_url: client.user.displayAvatarURL
                                }
                            }
                        });
                    });
                }).catch(err => {
                    msg.channel.send('Unable to find any users from your query!');
                });
            } else {
                r.table('bots').filter({ ownerId: msg.author.id }).run().then(ownedBots => {
                    msg.channel.send({
                        embed: {
                            title: `${msg.author.username}'s Bots`,
                            color: color,
                            description: ownedBots.map(bot => `<@${bot.id}>`).join(',\n'),
                            footer: {
                                text: `Bots | Requested by ${msg.author.username}`, 
                                icon_url: client.user.displayAvatarURL
                            }
                        }
                    });
                });
            }
            break;
        case 'featuredbots':
        case 'featured-bots':
        case 'featured':
            r.table('bots').filter({ featured: true }).run().then(featuredBots => {
                msg.channel.send({
                    embed: {
                        title: 'Featured Bots',
                        color: color,
                        description: featuredBots.map(bot => `<@${bot.botId}>`).join(',\n'),
                        footer: {
                            text: `Featured Bots | Requested by ${msg.author.username}`,
                            icon_url: client.user.displayAvatarURL
                        }
                    }
                });
            });
            break;
        case 'ping':
            msg.channel.send(':ping_pong: Pong!');
            break;
        case 'eval':
            if (msg.author.id !== '326055601916608512') return msg.channel.send('no');
            
            const input = args.join(' ');
            if (!input) msg.channel.send('Input is required');
            
            let result = null;
            
            try {
                result = await eval(input);
            }
            catch(e) {
                result = e.toString();
            }
            
            const inputMessage = `Input:\`\`\`js\n${input}\n\`\`\``;
            const message = `${inputMessage} Output:\`\`\`js\n${inspect(result)}\n\`\`\``;
            if (message.length > 2000) return msg.channel.send(`${inputMessage} Output: \`\`\`\nOver 2000 characters\n\`\`\``);
            
            msg.channel.send(message);
            break;
        case 'help':
        case 'commands':
        case 'cmds':
            msg.channel.send({
                embed: {
                    title: 'Help',
                    color: color,
                    footer: {
                        text: `Help | Requested by ${msg.author.username}`,
                        icon_url: client.user.avatarURL
                    },
                    fields: [
                        {
                            name: 'Featured',
                            value: `List all featured bots.\n\n**Usage:**\n\`${prefix}[featured|featuredbots|featured-bots]\``
                        },
                        {
                            name: 'Help',
                            value: `Lists all bot commands.\n\n**Usage:**\n\`${prefix}[help|cmds|commands]\``
                        },
                        {
                            name: 'Bots',
                            value: `List all of a user\'s bots.\n\n**Usage:**\n\`${prefix}bots [user]\``
                        },
                        {
                            name: 'Botinfo',
                            value: `Retrieves a bot\'s information.\n\n**Usage:**\n\`${prefix}botinfo <bot>\``
                        },
                        {
                            name: 'Ping',
                            value: 'Tests the bot'
                        }
                    ]
                }
            });
            break;
    }
});
