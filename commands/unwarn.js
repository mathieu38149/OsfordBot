const fs = require('fs'),
Discord = require('discord.js')
config = require('../config.json')

module.exports = {
    run: async (message, args, client) => {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Tu ne peut pas utilisé cette commande ! Attention une sanction peut etre appliqué.')
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Oups... Tu as oublié de mentionner le membre.')
        if (!client.db.warns[member.id]) return message.channel.send('Ce membre n\'a pas de warn.')
        const warnIndex = parseInt(args[1], 10) - 1
        if (warnIndex < 0 || !client.db.warns[member.id][warnIndex]) return message.channel.send('Aucun warn correspond à votre demande.')
        const { reason } = client.db.warns[member.id].splice(warnIndex, 1)[0]
        fs.writeFileSync('./db.json', JSON.stringify(client.db)) 
        message.channel.send(`${member} a été unwarn la raison du warn était ${reason} !`)
        message.guild.channels.cache.get(config.logs).send(new Discord.MessageEmbed()
            .setAuthor(`[UNWARN] ${member.user.tag}`, member.user.displayAvatarURL())
            .addField('utilisateur',member, true)
            .addField('Modérateur', message.author, true))
    },

    name: 'unwarn',
    guildOnly: true,
    help: {}
}