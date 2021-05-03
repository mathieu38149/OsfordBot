module.exports = {
    run: async (message, args) => {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Tu n\'a pas les permissions.')
        const count = args[0]
        if(!/\d+/.test(count)) return message.channel.send('Tu as oublié de mettre le nommbre de message a supprimé.')
        if (count < 1 || count > 99) return message.channel.send('le nombre de message a supprimé est invalide merci de le mettre entre 1 et 99.')
        const { size } = await message.channel.bulkDelete(Number(count) + 1, true)
        message.channel.send(`${size - 1}message ont été supprimés !`).then(sent => sent.delete({timeout: 5e3}))
    },
    name: 'clear',
    guildOnly: true,
    help: {}   
}