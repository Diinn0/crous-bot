const fetch = require('node-fetch');
const HTMLParser = require('node-html-parser');

const cheerio = require('cheerio');
const datefns = require('date-fns');

const locale = require('date-fns/locale');

let text = "";

const express = require('express');
const app = express();

app.listen(8080, () => {
    console.log("Serveur à l'écoute")     ;
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.get('/menu/*', (req, res) => {
    // res.send("Liste des parkings")

    let obj = {};

    fetch(req.params[0])
        .then(res => res.text())
        .then(async text => {
            const $ = cheerio.load(text);
            const menu = $(".slides li");
            const jour = datefns.format(new Date(), 'EEEE dd MMMM', {locale: locale.fr});

            let test3 = $(menu).find(".clone + li");

            let test4 = $(test3[0]);

            // console.log(menu.html());

            for (let i = 0; i < $(menu).length; i++) {
                 if ($(menu[i]).find('h3').text().includes("Menu")) {

                    // console.log($(menu[i]).html());
                    // txt += "**" + $(menu[i]).find("h3").text() + "** \n"
                    // console.log($(menu[i]).find("h3").text());

                     const tst = datefns.format(new Date($(menu[i]).find('h3').text().replace("Menu du ", "")), 'dd/MM/yyyy', {locale: locale.fr});

                    obj[tst] = {};

                    let test = $(menu[i]).find("h4 + .content-repas > div");

                    let span = $($(test[1]).find("span"));
                    let ul = $($(test[1]).find("ul"));

                    let titre = "";
                    let plat = "";

                    for (let k = 0; k < span.length; k++) {
                        // console.log($(span[k]).text());
                        // titre = "**" + $(span[k]).text() + "** \n";

                        let grp = [];
                        let plat = "";
                        let li = $(ul[k]).find("li");
                        for (let j = 0; j < li.length; j++) {
                            // console.log($(li[j]).text());
                            // plat += $(li[j]).text() + "\n";
                            grp.push($(li[j]).text());
                        }

                        obj[tst][$(span[k]).text()] = grp;
                        // json.push(grp);
                    }
                 }
            }

            res.json(obj);

        }).catch((e) => {
            res.status(500).send("Something Wrong");
    });

});

