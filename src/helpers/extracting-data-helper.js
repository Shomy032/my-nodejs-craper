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

    // todo make our own properties for file locations
    fsHelper.writeArrayToDisc(finalList, urlListName)
    fsHelper.writeToFile(JSON.stringify(finalList))
    const fileNamesList = [];
    finalList.forEach(async fileUrl => {
        const fileName = fileUrl.split("/").reverse()[0];
        fileNamesList.push(fileName)
        try {
            await fsHelper.downloadFile(fileUrl, fileName)
        } catch (err) {
            console.log(err)
        }

    })

    await browser.close();

    return fileNamesList;
}


async function getAllVideoUrlsFromPage({ origin }) {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = (await browser.pages())[0];
    await page.goto(origin, {
        waitUntil: 'networkidle2'
    });

    const srcList = await page.evaluate(() => {
        var holders = document.querySelectorAll("source");

        var res = []
        holders.forEach(element => {
            if (element != null) {
                res.push(element.src);
            }
        });

        return res;
    })



    return srcList;
}

module.exports = { extractParseAndReadBgImgUrlAll, getAllVideoUrlsFromPage }



