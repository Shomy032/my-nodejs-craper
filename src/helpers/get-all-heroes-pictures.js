const puppeteer = require('puppeteer');


const { ScraperHelper, FsHelper } = require("./helper");
const helper = new ScraperHelper();
const fsHelper = new FsHelper();

// extracting bg-img form bg-img("asd"), internaly needed move to helper later
const parseElementFn = function (el) { return el.substring(5, el.length - 2) };

/* docs */
async function extractParseAndReadBgImgUrlAll({ origin, evaluatedSelector, folderName, urlListName }) {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = (await browser.pages())[0];
    await page.goto(origin, {
        waitUntil: 'networkidle2'
    });

    const imageList = await page.evaluate((evaluatedSelector) => {
        var holders = document.querySelectorAll(evaluatedSelector);

        var res = []
        holders.forEach(element => {
            if (element != null) {
                res.push(element.style['background-image']);
            }
        });

        return res;
    }, evaluatedSelector)

    const finalList = imageList.map(el => parseElementFn(el));
    fsHelper.writeArrayToDisc(finalList, urlListName)
    fsHelper.writeToFile(JSON.stringify(finalList))
    finalList.forEach(async fileUrl => {
        const name = fileUrl.split("/").reverse()[0];
        await fsHelper.downloadFile(fileUrl, `${folderName}/${name}`)
    })

    await browser.close();
}

module.exports = { extractParseAndReadBgImgUrlAll }



