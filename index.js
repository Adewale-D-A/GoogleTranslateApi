const fs = require("fs");
const { Translate } = require("@google-cloud/translate").v2;
require("dotenv").config();

// Your credentials
const JsonEnglish = require("./english_translation.json");
const CREDENTIALS = require("./credentials.json");

// Configuration for the client
const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

// const detectLanguage = async (text) => {
//   try {
//     let response = await translate.detect(text);
//     return response[0].language;
//   } catch (error) {
//     console.log(`Error at detectLanguage --> ${error}`);
//     return 0;
//   }
// };

// detectLanguage('Oggi è lunedì')
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

const translateText = async (text, targetLanguage) => {
  try {
    let [response] = await translate.translate(text, targetLanguage);
    return response;
  } catch (error) {
    console.log(`Error at translateText --> ${error}`);
    return 0;
  }
};

// translateText("hello world", "fr")
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => {
//       console.log("translation error occured", err);
//     });

const allObjectkeys = Object.keys(JsonEnglish);
const promiseFunction = async () => {
  const requestArray = [];
  // const keyArray = [];
  // const englishValuesArray = [];
  allObjectkeys?.forEach(async (item, index) => {
    // const key = item;
    const value = JsonEnglish[item];
    // keyArray[index] = key;
    // englishValuesArray[index] = value;
    requestArray[index] = translateText(value, "yo"); //french - 'fr', hausa - 'ha', igbo - 'ig', portuguese - 'pt-PT', spanish - 'es', yoruba - 'yo'
  });
  const newReturn = await Promise.all(requestArray);

  fs.writeFile("yorubaArray.json", JSON.stringify(newReturn), (err) => {
    if (err) {
      console.error("err");
      return;
    }
    console.log("translated values written");
  });

  //write original keys array
  // fs.writeFile("originalKeysArray.json", JSON.stringify(keyArray), (err) => {
  //   if (err) {
  //     console.error("err");
  //     return;
  //   }
  //   console.log("keys written");
  // });

  //write original values array
  // fs.writeFile(
  //   "originalValuesArray.json",
  //   JSON.stringify(englishValuesArray),
  //   (err) => {
  //     if (err) {
  //       console.error("err");
  //       return;
  //     }
  //     console.log("values written");
  //   }
  // );
};
promiseFunction();
