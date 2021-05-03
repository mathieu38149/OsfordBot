
const parseDuration = require('parse-duration'),
    humanizeDuration = require('humanize-duration'),
     Discord = require('discord.js')
    config = require('../config.json')

module.exports = {
    run: async (message, args) => {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('tu ne peut pas faire ça !.')
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Oups tu a oublié de mentionner le membre.')
        if (member.id === message.guild.ownerID) return message.channel.send('tu n\'est pas autorisé a faire cette commande.')
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send('Vous ne pouvez pas mute ce membre.')
        if (!member.manageable) return message.channel.send('Oups... une erreur est survenue.')
        const duration = parseDuration(args[1])
        if (!duration) return message.channel.send('Veuillez indiquer une durée valide.')
        const reason = args.slice(1).join(' ') || 'Aucune raison fournie.'
        let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted')
        if (!muteRole) {
            muteRole = await message.guild.roles.create({
                data: {
                    name: 'Muted',
                    permissions: 0
                }
            })
            message.guild.channels.cache.forEach(channel => channel.createOverwrite(muteRole, {
                SEND_MESSAGES: false,
                CONNECT: false,
                ADD_REACTIONS: false
            }))
        }
        await member.roles.add(muteRole)
        message.channel.send(`${member} a été mute pendant ${humanizeDuration(duration, {language: 'fr'})} !`)
        message.guild.channels.cache.get(config.logs).send(new Discord.MessageEmbed()
            .setAuthor(`[TEMPMUTE] ${member.user.tag}`, member.user.displayAvatarURL())
            .addField('utilisateur',member, true)
            .addField('Modérateur', message.author, true)
            .addField('Durée', humanizeDuration(duration, {language: 'fr'}), true))
        setTimeout(() => {
            if (member.deleted || !member.manageable) return
            member.roles.remove(muteRole)
            message.channel.send(`${member} a été unmute`)
        }, duration)
    },
    name: 'tempmute',
    guildOnly: true,
    help: {}
}