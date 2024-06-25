const fs = require("fs");
const { Translate } = require("@google-cloud/translate").v2;
require("dotenv").config();

// Your credentials
const JsonEnglish = require("./mobileTranslationData/originalEnglish.json"); //json file to translate
const CREDENTIALS = require("../../credentials.json");

// Configuration for the client
const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

//translate function
const translateText = async (text, targetLanguage) => {
  try {
    let [response] = await translate.translate(text, targetLanguage);
    return response;
  } catch (error) {
    console.log(`Error at translateText --> ${error}`);
    return "";
  }
};

// console.log(translationFile);
const translateRequest = async () => {
  let translationFile = {};
  originalDataFile = JsonEnglish.translation; //extract parent object from original translation object
  const layerOne = Object.keys(originalDataFile);
  for (let keyOne of layerOne) {
    if (originalDataFile[keyOne].constructor === Object) {
      //if key is an object
      let layerTwoObject = {};
      const layerTwo = Object.keys(originalDataFile[keyOne]);
      for (let keyTwo of layerTwo) {
        const text = originalDataFile[keyOne][keyTwo];
        // console.log(text);
        if (typeof text === "string" || text instanceof String) {
          const translateOutput = await translateText(text, "yo"); //french - 'fr', hausa - 'ha', igbo - 'ig', portuguese - 'pt-PT', spanish - 'es', yoruba - 'yo'

          layerTwoObject = {
            ...layerTwoObject,
            [keyTwo]: translateOutput,
          };
        }
      }
      translationFile = {
        ...translationFile,
        [keyOne]: layerTwoObject,
      };
    } else {
      //if key is not an object
      const text = originalDataFile[keyOne];
      const translateOutput = await translateText(text, "yo"); //french - 'fr', hausa - 'ha', igbo - 'ig', portuguese - 'pt-PT', spanish - 'es', yoruba - 'yo'
      translationFile = {
        ...translationFile,
        [keyOne]: translateOutput,
      };
    }
  }
  return translationFile;
};

const writeTranslation = async () => {
  const translatedResult = await translateRequest();

  fs.writeFile(
    "mobileTranslationData/yorubaVersion.json",
    JSON.stringify(translatedResult),
    (err) => {
      if (err) {
        console.error("err");
        return;
      }
      console.log("translated values written");
    }
  );
};

writeTranslation();
