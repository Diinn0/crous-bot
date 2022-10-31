const fetch = require('node-fetch');
const HTMLParser = require('node-html-parser');

const cheerio = require('cheerio');
const datefns = require('date-fns');

const locale = require('date-fns/locale');

const { Client, GatewayIntentBits, Collection, Partials, EmbedBuilder} = require('discord.js');
const { token, channel } = require('./config.json');
const { Routes } = require('discord.js');
const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

// Login to Discord with your client's token
client.login(token);

const color = [
    "#E16FF9",
    "#70F5F7",
    "#C77670",
    "#F57A29",
    "#8DAF7E"
];

setInterval(() => {
    var date = new Date(); //Create a Date object to find out what time it is
    // if(date.getHours() === 8 && date.getMinutes() === 00 && (date.getDay()-1 === 0 || date.getDay()-1 === 1 || date.getDay()-1 === 2 || date.getDay()-1 === 3 || date.getDay()-1 === 4) ){ //Check the time

        let text = "";
        const embed = new EmbedBuilder();

        if (Math.floor(Math.random() * 100) < 20) {
            embed.setDescription("Vous avez de la chance, aujourd'hui c'est burger King !!")
            embed.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/800px-Burger_King_2020.svg.png");
        }

        fetch('https://www.crous-reims.fr/restaurant/resto-u-moulin-de-la-housse/')
            .then(res => res.text())
            .then(async text => {
                let txt = "";
                const $ = cheerio.load(text);
                const menu = $(".slides > li");
                const jour = datefns.format(new Date(), 'EEEE dd MMMM', {locale: locale.fr});

                for (let i = 0; i < menu.length; i++) {
                    if ($(menu[i]).find('h3').text().includes(jour)) {

                        embed.setTitle($(menu[i]).find("h3").text());
                        embed.setColor(color[date.getDay() - 1]);
                        // txt += "**" + $(menu[i]).find("h3").text() + "** \n"
                        // console.log($(menu[i]).find("h3").text());


                        let test = $(menu[i]).find("h4 + .content-repas > div");

                        let span = $($(test[1]).find("span"));
                        let ul = $($(test[1]).find("ul"));

                        let titre = "";
                        let plat = "";
                        for (let k = 0; k < span.length; k++) {
                            // console.log($(span[k]).text());
                            titre = "**" + $(span[k]).text() + "** \n";

                            let plat = "";
                            let li = $(ul[k]).find("li");
                            for (let j = 0; j < li.length; j++) {
                                // console.log($(li[j]).text());
                                plat += $(li[j]).text() + "\n";
                            }
                            embed.addFields({name: titre, value: plat, inline: true});
                        }
                    }
                }

                const canal = client.channels.cache.get(channel);
                await canal.send({embeds: [embed]});
            });


    // }
}, 1000 * 60);
