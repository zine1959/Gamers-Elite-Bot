module.exports = {
    description: 'Buy something from the shop.',
    aliases: [],
    usage: 'buy <item number>'
}

module.exports.run = async(client, message, args) => {
    const data = client.members.get(message.guild.id, message.author.id)
    const settings = client.conf.economy
    const shop = settings.shopItemsFront ? [...settings.shopItems, ...client.shop] : [...client.shop, ...settings.shopItems]
    const item = shop.find((s, i) => i + 1 == args[0])

    if (!item) return message.channel.send(new client.embed().setDescription(`You need to enter the item id! do \`${message.px}shop\` to view all the things you can buy!`).setFooter(`${message.guild.name} | Made By Fuel#2649`, message.guild.iconURL({ dynamic: true })))
    if (item.type === 'role') {
        message.member.roles.add(item.roleID).then(() => {
            message.channel.send(new client.embed().setDescription(`You now have purchased and obtained the <@&${item.roleID}> role!`).setFooter(`${message.guild.name} | Made By Fuel#2649`, message.guild.iconURL({ dynamic: true })))
            client.members.math(message.guild.id, '-', item.price, `${message.author.id}.balance.wallet`)
        }).catch(() => {
            message.channel.send(new client.embed().setDescription('Sorry but I cant add that role to you!').setFooter(`${message.guild.name} | Made By Fuel#2649`, message.guild.iconURL({ dynamic: true })))
        })
        return
    }

    if (data.inventory.items.find(s => s.name === item.name)) return message.channel.send(new client.embed().setDescription(`You have already bough this item!`).setFooter(`${message.guild.name} | Made By Fuel#2649`, message.guild.iconURL({ dynamic: true })))
    if (item.price > data.balance.wallet) return message.channel.send(new client.embed().setDescription(`That item costs ${item.price} ${message.coin}! You only have ${data.balance.wallet} ${message.coin}!`).setFooter(`${message.guild.name} | Made By Fuel#2649`, message.guild.iconURL({ dynamic: true })))

    message.channel.send(`You've bought ${item.name} for ${item.price} ${message.coin}!\nYou can view it in your inventory with \`${message.px}inventory\``)
    client.members.push(message.guild.id, item, `${message.author.id}.inventory.items`)
    client.members.math(message.guild.id, '-', item.price, `${message.author.id}.balance.wallet`)
}