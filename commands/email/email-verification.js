const Discord = require('discord.js');
const nodemailer = require('nodemailer')
const code = require('random-code-gen')
const config = require('../../config.json')

module.exports = {
    name: "email",
    run: async(client, message, args) => {
        let token = "";
        const authCode = code.random(5)
        if (!args[0]) {
            return message.channel.send(':x: Missing email!')
        }
        const filter = (m) => m.author.id == message.author.id && !m.author.bot
        const collector = await message.channel.createMessageCollector(filter, { max: 1, time: 180000 })
        const msg = await message.channel.send('Sending Confirmation Email...')
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.email,
                pass: config.password
            }
        })
        var Options = {
            from: config.email,
            to: args[0],
            subject: 'Confirmation code for developers application',
            text: `Hello there,\n\nYou have request a confirmation code\n\nYour code: ${authCode}\nNote: You have 3 minutes to send the code`
        }
        transporter.sendMail(Options, function(error, info) {
            if (error) {
                message.channel.send(':x: There was an error please make sure:\n**1- Your email is vaild**\n\n> if you are sure about your email please dm <@596227913209217024>\n\n> Developers Team')
            } else {
                msg.edit(`a confirmation code has been sent to **${args[0]}**\n\n**Note: You have 3 minutes to type the code**`)
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 180000,
                    errors: ['time']
                }).then(collected => {
                    token = collected.first().content
                    collected.first().delete()
                    if (token !== authCode) {
                        return message.channel.send(':x: Wrong code!')
                    }
                    if (token == authCode) {
                        msg.edit('✅ Your email has been confirmed')
                    }
                })
            }
        })
    }
}