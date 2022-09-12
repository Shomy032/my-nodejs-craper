class ScraperHelper {
    getNewFileLocation() {
        return `./scraped-data/results-${Date.now()}.json`
    }
}

const options1 = {
    method: 'GET',
    url: 'https://www.dota2.com/datafeed/herolist',
    params: { language: 'english' },
    headers: {
        'X-RapidAPI-Host': 'omgvamp-hearthstone-v1.p.rapidapi.com',
        'X-RapidAPI-Key': '92dbe2da98mshc7beb5320c79baap12f690jsn7aa453c94c48'
    }
};

var Xray = require('x-ray')
var scraper = Xray()
const fs = require('fs');
var axios = require("axios").default;
const helper = new ScraperHelper();

const dataUrls = ["https://www.dota2.com/heroes", "https://www.dota2.com/datafeed/herolist"];
const axiosOptionsUrl = [options1]

// extractFullHtmlBody(dataUrls[0])
// extractFullHtmlBody(dataUrls[1])
// extractRestData(axiosOptionsUrl[0])




function extractFullHtmlBody(endpoint) {
    scraper(endpoint, "#dota_react_root@html")(function (err, data) {
        if (err) {
            console.error(err);
        }
    }).write(helper.getNewFileLocation())

}

function extractRestData(axiosOption) {
    axios.request(axiosOption).then(async (response) => {
        const data = await response?.data?.result?.data?.heroes;

        writeToFile(JSON.stringify(data))
    }).catch(function (error) {
        console.error(error);
    });

}


function writeToFile(content) {
    fs.writeFile(helper.getNewFileLocation(), content, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });
}



