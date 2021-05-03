const Discord = require('discord.js')
    config = require('../config.json')

module.exports = {
    run: async (message, args) => {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Tu ne peut pas utilisé cette commande !')
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Tu a oublié de mentionner le membre')
        if (member.id === message.guild.ownerID) return message.channel.send('Tu ne peut pas unmute ce membre.')
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send('Vous ne pouvez pas mute ce membre.')
        if (!member.manageable) return message.channel.send('Je ne peut pas unmute ce membre.')
        const reason = args.slice(1).join(' ') || 'Aucune raison fournie.'
        const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted')
        if (!muteRole) return message.channel.send('cette personne n\'est pas mute.')
        await member.roles.remove(muteRole)
        message.channel.send(`${member} a été unmute.`)
        message.guild.channels.cache.get(config.logs).send(new Discord.MessageEmbed()
        .setAuthor(`[UNMUTE] ${member.user.tag}`, member.user.displayAvatarURL())
        .addField('utilisateur',member, true)
        .addField('Modérateur', message.author, true))
    },
    name: 'unmute',
    guildOnly: true,
    help: {}
}