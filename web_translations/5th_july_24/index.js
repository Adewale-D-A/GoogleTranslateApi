const fs = require("fs");
const { Translate } = require("@google-cloud/translate").v2;
require("dotenv").config();

// Your credentials
const JsonEnglish = require("./original_english.json"); //json file to translate
const CREDENTIALS = require("../../credentials.json");
const languages = require("./languages.json");
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
const translateRequest = async ({ langCode }) => {
  let translationFile = {};
  originalDataFile = JsonEnglish; //extract parent object from original translation object
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
          const translateOutput = await translateText(text, langCode); //french - 'fr', hausa - 'ha', igbo - 'ig', portuguese - 'pt-PT', spanish - 'es', yoruba - 'yo'

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
      const translateOutput = await translateText(text, langCode); //french - 'fr', hausa - 'ha', igbo - 'ig', portuguese - 'pt-PT', spanish - 'es', yoruba - 'yo'
      translationFile = {
        ...translationFile,
        [keyOne]: translateOutput,
      };
    }
  }
  return translationFile;
};

const writeTranslation = async ({ langCode, name }) => {
  const translatedResult = await translateRequest({ langCode: langCode });

  fs.writeFile(
    `./translated/${name}.json`,
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

const loopFunction = async () => {
  for (let index = 0; index < languages.length; index++) {
    const element = languages[index];
    if (!element?.invalid) {
      await writeTranslation({
        langCode: element?.language_code,
        name: element?.name,
      });
    }
  }
};

loopFunction();
