const { extractParseAndReadBgImgUrlAll } = require("../src/helpers/extracting-data-helper")

const origin = 'https://www.dota2.com/heroes';
const evaluatedSelector = ".herogridpage_HeroIcon_7szOn";
const folderName = `extracted-pictures`;
const urlListName = "hero-images";

extractParseAndReadBgImgUrlAll({ origin, evaluatedSelector, folderName, urlListName })