const parseDuration = require('parse-duration'),
    humanizeDuration = require('humanize-duration'),
    Discord = require('discord.js')
    config = require('../config.json')

module.exports = {
    run: async (message, args) => {
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('Tu ne peut pas éffectuer cette commande.')
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Oups... Tu as oublié de mentionner le membre.')
        if (member.id === message.guild.ownerID) return message.channel.send('Oups... Je ne peut pas faire cela.')
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send('Oups.... Je ne peut pas bannir cette personne.')
        if (!member.bannable) return message.channel.send('Oups... Je ne peut pas faire cela.')
        const duration = parseDuration(args[1])
        if (!duration) return message.channel.send('Veuillez indiquer une durée valide.')
        const reason = args.slice(2).join(' ') || 'Aucune raison fournie'
        await member.ban({reason})
        message.channel.send(`${member.user.tag} a été banni pendant ${humanizeDuration(duration, {language: 'fr'})} !`)
        message.guild.channels.cache.get(config.logs).send(new Discord.MessageEmbed()
            .setAuthor(`[TEMPBAN] ${member.user.tag}`, member.user.displayAvatarURL())
            .addField('utilisateur',member, true)
            .addField('Modérateur', message.author, true)
            .addField('Durée', humanizeDuration(duration, {language: 'fr'}), true))
            setTimeout(() => {
            message.guild.members.unban(member)
            message.channel.send(`${member.user.tag} a été débanni.`)
        }, duration)
    },
    name: 'tempban',
    guildOnly: true,
    help: {}
}
