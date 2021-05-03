const Discord = require('discord.js')
    config = require('../config.json')

module.exports = {
    run: async (message, args) => {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send('Tu ne peut pas utilisé cette commande ! Attention une sanction peut etre appliqué.')
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Oups... Tu as oublié de mentionner le membre.')
        if (member.id === message.guild.ownerID) return message.channel.send('Tu ne peut pas faire ça !')
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send('Vous ne pouvez pas exclure ce membre.')
        if (!member.kickable) return message.channel.send('Oups... Je ne peut pas exclure ce membre.')
        const reason = args.slice(1).join(' ') || 'Aucune raison fournie'
        await member.kick(reason)
        message.channel.send(`${member.user.tag} a été exclu !`)
        .setAuthor(`[KICK] ${member.user.tag}`, member.user.displayAvatarURL())
            .addField('utilisateur',member, true)
            .addField('Modérateur', message.author, true)
    },
    name: 'kick',
    guildOnly: true,
    help: {}
}