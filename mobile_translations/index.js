const fs = require("fs");
const { Translate } = require("@google-cloud/translate").v2;
require("dotenv").config();

// Your credentials
const JsonEnglish = require("./original_english.json"); //json file to translate
const CREDENTIALS = require("../credentials.json");
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
  originalDataFile = JsonEnglish; //extract parent object from original translation object
  let translationFile = {};
  const layerOne = Object.keys(originalDataFile);
  for (let keyOne of layerOne) {
    //FIRST FOR LOOP
    if (originalDataFile[keyOne].constructor === Object) {
      //if key is an object
      let layerTwoObject = {};
      const layerTwo = Object.keys(originalDataFile[keyOne]);
      for (let keyTwo of layerTwo) {
        //SECOND FOR LOOP
        if (originalDataFile[keyOne][keyTwo].constructor === Object) {
          //if key is an object
          let layerThreeObject = {};
          const layerThree = Object.keys(originalDataFile[keyOne][keyTwo]);
          for (let keyThree of layerThree) {
            //THIRD FOR LOOP
            if (
              originalDataFile[keyOne][keyTwo][keyThree].constructor === Object
            ) {
              //if key is an object
              let layerFourObject = {};
              const layerFour = Object.keys(
                originalDataFile[keyOne][keyTwo][keyThree]
              );

              for (let keyFour of layerFour) {
                //FOURTH FOR LOOP
                if (
                  originalDataFile[keyOne][keyTwo][keyThree][keyFour]
                    .constructor === Object
                ) {
                  //if key is an object
                  let layerFifthObject = {};
                  const layerFive = Object.keys(
                    originalDataFile[keyOne][keyTwo][keyThree][keyFour]
                  );
                  for (let keyFive of layerFive) {
                    //FIFTH FOR LOOP
                    if (
                      originalDataFile[keyOne][keyTwo][keyThree][keyFour][
                        keyFive
                      ].constructor === Object
                    ) {
                      console.log("An object is present!!!");
                    } else {
                      const text =
                        originalDataFile[keyOne][keyTwo][keyThree][keyFour][
                          keyFive
                        ];
                      // console.log(text);
                      // console.log({ keyFive });
                      const translateOutput = await translateText(
                        text,
                        langCode
                      );
                      layerFifthObject = {
                        ...layerFifthObject,
                        [keyFive]: translateOutput,
                      };
                    }
                  }

                  layerFourObject = {
                    ...layerFourObject,
                    [keyFour]: layerFifthObject,
                  };
                } else {
                  const text =
                    originalDataFile[keyOne][keyTwo][keyThree][keyFour];
                  const translateOutput = await translateText(text, langCode);
                  layerFourObject = {
                    ...layerFourObject,
                    [keyFour]: translateOutput,
                  };
                }
              }
              layerThreeObject = {
                ...layerThreeObject,
                [keyThree]: layerFourObject,
              };
            } else {
              const text = originalDataFile[keyOne][keyTwo][keyThree];
              const translateOutput = await translateText(text, langCode);
              layerThreeObject = {
                ...layerThreeObject,
                [keyThree]: translateOutput,
              };
            }
          }
          layerTwoObject = {
            ...layerTwoObject,
            [keyTwo]: layerThreeObject,
          };
        } else {
          const text = originalDataFile[keyOne][keyTwo];
          const translateOutput = await translateText(text, langCode);
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
      const translateOutput = await translateText(text, langCode);
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
      console.log(`${name} successfully translated written`);
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
