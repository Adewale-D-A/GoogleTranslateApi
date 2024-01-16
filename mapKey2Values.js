const fs = require("fs");

const keys = require("./originalKeysArray/originalKeysArray.json");
// const frenchTranslatedArray = require("./translatedArrays/frenchArray.json");
// const hausaTranslatedArray = require("./translatedArrays/hausaArray.json");
// const igboTranslatedArray = require("./translatedArrays/igboArray.json");
// const portugueseTranslatedArray = require("./translatedArrays/portugueseArray.json");
// const spanishTranslatedArray = require("./translatedArrays/spanishArray.json");
const yorubaTranslatedArray = require("./translatedArrays/yorubaArray.json");

let FinalTranslatedResult = {};

//map keys to corresponding translated values
keys.forEach((item, index) => {
  FinalTranslatedResult = {
    ...FinalTranslatedResult,
    [item]: yorubaTranslatedArray[index],
  };
});

// console.log({ FinalTranslatedResult });

// write the resulting object to a file
fs.writeFile(
  "finalYorubaTranslation.json",
  JSON.stringify(FinalTranslatedResult),
  (err) => {
    if (err) {
      console.error("err");
      return;
    }
    console.log("final translation commpleted");
  }
);
