module.exports = {
    description: 'Creates a ticket.',
    aliases: [`new`, `ticket`],
    usage: 'create <@users>'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.senD(new client.embed().setDescription('You are missing the permission `Manage Channels`').setFooter(`${message.guild.name} | Made By Fuel#2649`, message.guild.iconURL({ dynamic: true })))

    const settings = client.conf.ticketSystem
    const tickets = client.settings.get(message.guild.id, 'tickets')
    const log = client.channels.cache.get(client.conf.logging.Ticket_Channel_Logs)
    const num = Object.entries(tickets).length || 1
    const ticketNumber = '0'.repeat(4 - num.toString().length) + num
    const permissions = settings.Support_Team_Roles.map(r => ({ id: r, allow: 'VIEW_CHANNEL' }))
    const users = message.mentions.users.map(s => ({ id: s.id, allow: 'VIEW_CHANNEL' }))
    const channel = await message.guild.channels.create(settings.Ticket_Name.replace('{number}', ticketNumber).replace('{username}', message.author.username), {
        parent: settings.Ticket_Category,
        permissionOverwrites: [{
            id: message.guild.id,
            deny: 'VIEW_CHANNEL'
        }, { id: message.author.id, allow: 'VIEW_CHANNEL' }, ...permissions, ...users]
    })

    channel.send(new client.embed()
        .setTitle(settings.Ticket_Title)
        .setDescription(client.resolveMember(settings.Ticket_Message, message.author))
    )

    if (log) log.send(new client.embed()
        .setTitle('Ticket Created')
        .setDescription(`**Creator:** ${message.author}`)
    )

    client.settings.set(message.guild.id, { user: message.author.id }, `tickets.${channel.id}`)
}