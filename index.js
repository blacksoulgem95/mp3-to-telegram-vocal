const Telegraf = require('telegraf');
const express = require('express');
const Telegram = require('telegraf/telegram');
const telegram = new Telegram(process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);
const expressApp = express();

if (process.env.WEBHOOK === 'true') {
    bot.telegram.setWebhook(`${process.env.HOST}/${process.env.BOT_TOKEN}`);
    expressApp.use(bot.webhookCallback(`/${process.env.BOT_TOKEN}`));
    expressApp.get('/', (req, res) => {
        res.send('Hello World!');
    });
}

bot.start((ctx) => {
    console.log('started:', ctx.from.id);
    return ctx.reply('Hello and welcome to the Mp3 To Vocal Bot! This bot has been developed by @ITGuy9401');
});

bot.command('help', (ctx) => ctx.reply('Let\'s send an Mp3 file to this chat and see what happens 😁'));
bot.on('message', (ctx) => {
    try {
        if (!ctx.message.audio) {
            return ctx.reply('Please send an audio file');
        }

        console.log(`Received audio file on chat with @${ctx.message.chat.username}`, ctx.message.audio);

        telegram.getFileLink(ctx.message.audio.file_id).then(audioLink => {
            ctx.replyWithVoice({
                url: audioLink
            })
        }, err => {
            console.log("error getting file link", err);
            ctx.reply("I'm sorry, there was an error processing your file. Are you sure you have sent an mp3 file less than 20MB?");
        })
    } catch (e) {
        console.log(`Error operating a file`, e);
        ctx.reply("I'm sorry, there was an error processing your file. Are you sure you have sent an mp3 file less than 20MB?");
    }
});

if (process.env.WEBHOOK === 'true') {
    expressApp.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
} else {
    bot.startPolling();
}