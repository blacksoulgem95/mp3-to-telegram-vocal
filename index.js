const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const telegram = new Telegram(process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    console.log('started:', ctx.from.id);
    return ctx.reply('Hello and welcome to the Mp3 To Vocal Bot! This bot has been developed by @ITGuy9401');
});

bot.command('help', (ctx) => ctx.reply('Let\'s send an Mp3 file to this chat and see what happens 😁'));
bot.on('message', (ctx) => {
    console.log(ctx.message);
    try {
        if (!ctx.message.audio || ctx.message.audio.mime_type !== 'audio/mpeg') {
            return ctx.reply('Please send an audio/mpeg file');
        }
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

bot.startPolling();