const puppeteer = require('puppeteer');

class ScraperHelper {
    getNewFileLocation() {
        return `./scraped-data/results-${Date.now()}.json`
    }
}
const helper = new ScraperHelper();

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = (await browser.pages())[0];
    await page.goto('https://www.dota2.com/heroes', {
        waitUntil: 'networkidle2'
    });

    const imageList = await page.evaluate(() => {
        var holders = document.querySelectorAll('.herogridpage_HeroIcon_7szOn');

        var res = []
        holders.forEach(element => {
            if (element != null) {
                res.push(element.style['background-image']);
            }
        });

        return res
    })

    // writeArrayToDisc(imageList, "hero-images")
    writeToFile(JSON.stringify(imageList))


    await browser.close();
})();



const fs = require('fs');
function writeToFile(content) {
    fs.writeFile(helper.getNewFileLocation(), content, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });
}

// have BUGG
function writeArrayToDisc(arr, name) {
    var file = fs.createWriteStream(`extracted-data/${Date.now()}-${name}.txt`);
    file.on('error', (err) => { /* error handling */ });
    arr.forEach((data) => {
        console.log("data", data, "end")
        file.write(data.join(', ') + '\n');
    });
    file.end();
}

