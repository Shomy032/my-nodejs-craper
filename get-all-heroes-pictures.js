const puppeteer = require('puppeteer');
const Https = require("https");
const fs = require('fs');

// move ScraperHelper to new folder as export
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


    const finalList = imageList.map(x => x.substring(5, x.length - 2));
    writeArrayToDisc(finalList, "hero-images")
    writeToFile(JSON.stringify(finalList))
    finalList.forEach(async fileUrl => {
        const part = fileUrl.split("/").reverse()[0];
        const name = part.substring(0, part.length - 4)
        await downloadFile(fileUrl, `extracted-pictures/${name}.png`)
    })

    await browser.close();
})();




function writeToFile(content) {
    fs.writeFile(helper.getNewFileLocation(), content, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });
}


function writeArrayToDisc(arr, name) {
    var file = fs.createWriteStream(`extracted-data/${Date.now()}-${name}.txt`);
    file.on('error', (err) => { /* error handling */ });
    arr.forEach((data) => {
        file.write(data + ',\n');
    });
    file.end();
}




/**
 * Download a file from the given `url` into the `targetFile`.
 *
 * @param {String} url
 * @param {String} targetFile
 *
 * @returns {Promise<void>}
 */
async function downloadFile(url, targetFile) {
    return await new Promise((resolve, reject) => {
        Https.get(url, response => {
            const code = response.statusCode ?? 0

            if (code >= 400) {
                return reject(new Error(response.statusMessage))
            }

            // handle redirects
            if (code > 300 && code < 400 && !!response.headers.location) {
                return downloadFile(response.headers.location, targetFile)
            }

            // save the file to disk
            const fileWriter = fs
                .createWriteStream(targetFile)
                .on('finish', () => {
                    resolve({})
                })

            response.pipe(fileWriter)
        }).on('error', error => {
            reject(error)
        })
    })
}