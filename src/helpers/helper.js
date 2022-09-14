const Https = require("https");
const fs = require('fs');
const { promisify } = require('util')

class ScraperHelper {
    getNewFileLocation() {
        return `./scraped-data/results-${Date.now()}.json`
    }
}

class FsHelper {

    helper;

    constructor() {
        this.helper = new ScraperHelper()
    }

    writeToFile(content) {
        fs.writeFile(this.helper.getNewFileLocation(), content, err => {
            if (err) {
                console.error(err);
            }
            // file written successfully
        });
    }

    /* DOCS */
    writeArrayToDisc(arr, name) {
        var file = fs.createWriteStream(`extracted-data/${Date.now()}-${name}.txt`);
        file.on('error', (err) => { console.error(err); });
        arr.forEach((data) => {
            file.write(data + ',\n');
        });
        file.end();
    }

    /* DOCS */
    makeDirIfNotExist(dirName) {
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName);
        }
    }

    /* DOCS */
    forceDeleteDir(dirName) {
        if (fs.existsSync(dirName)) {
            fs.rmSync(dirName, { recursive: true, force: true });
        }
    }

    // todo refactor
    async downloadFile(url, targetFile) {
        return await new Promise((resolve, reject) => {

            // currently https is not sending request 'ECONNREFUSED'
            Https.get((url, response) => {
                const code = response.statusCode ?? 0

                if (code >= 400) {
                    return reject(new Error(response.statusMessage))
                }

                // handle redirects
                if (code > 300 && code < 400 && !!response.headers.location) {
                    return downloadFile(response.headers.location, targetFile)
                }

                // save the file to disk
                const fileWriter = fs.createWriteStream(`tmp-data/extracted-pictures/${targetFile}`)
                    .on('finish', () => {
                        resolve({})
                    })

                response.pipe(fileWriter)
            }).on('error', error => {
                reject(error)
            })
        })
    }

    asyncCreateWriteStream() {
        return promisify(fs.createWriteStream)
    }
}


module.exports = { ScraperHelper, FsHelper }