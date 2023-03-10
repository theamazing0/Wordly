// Create bergamot translator instance
import { LatencyOptimisedTranslator } from "../bergamot-translator/translator.js";
const translator = new LatencyOptimisedTranslator();

// define some globally used variables
var fam;
var lang;

// request browser for stored user data
let requestStorage = browser.storage.local.get({
  lang: "en",
  fam: 0,
});
requestStorage.then(function (storageRecieved) {
  // Sets browser's values to defaults if not set already
  browser.storage.local.set({
    lang: storageRecieved.lang,
    fam: storageRecieved.fam,
  });
  // set local global variables to recieved values
  lang = storageRecieved.lang;
  fam = storageRecieved.fam;
  // asks background.js for user's selection
  const sending = browser.runtime.sendMessage({ request: "selection" });
  sending.then(processSelection, handleError);
});

// handle any error in reception of selection
function handleError(error) {
  console.log("Error: " + error);
}

// Event listener for open-options button
document.getElementById("open-options").addEventListener("click", function () {
  if (document.getElementById("options-card").hidden == true) {
    // show card
    document.getElementById("options-card").hidden = false;
    // load currently stored values
    document.getElementById(lang).selected = true;
    if (fam == 0) {
      document.getElementById("fam-fieldset").hidden = true;
    } else {
      document.getElementById(String(fam)).checked = true;
    }
  } else {
    // hide card if already shown
    document.getElementById("options-card").hidden = true;
  }
});

// add event listener to languages selector (in options)
document.getElementById("languages").addEventListener("change", function () {
  // if the user selects english, then hide the familiarity section
  if (this.value == "en") {
    document.getElementById("fam-fieldset").hidden = true;
  } else {
    // otherwise, show it
    document.getElementById("fam-fieldset").hidden = false;
  }
});

// add event listener to save options button
document.getElementById("save-options").addEventListener("click", function () {
  // get user's selection and store in variables
  var langToSet = document.getElementById("languages").value;
  var famToSet = document.querySelector(
    'input[name="familiarity"]:checked'
  ).value;
  // if the language is english, then set familiarity to max
  if (langToSet == "en") {
    famToSet = 0;
  }
  // send values to browser to store
  browser.storage.local.set(
    {
      lang: langToSet,
      fam: famToSet,
    },
    // reload the page to use new options
    window.location.reload()
  );
});

// This function will be used as an event listener for any translated sentences
// shows original element card
function toggleEnglishSentence() {
  // find original sentence card
  const originalElement = this.parentElement.querySelector("article");
  // toggle its visibility
  if (originalElement.hidden == false) {
    originalElement.hidden = true;
  } else {
    originalElement.hidden = false;
  }
}

// function to translate difficult sentences asynchronously
async function translateSentences() {
  // get all flagged sentences
  const sentencesToTranslate = document.getElementsByClassName(
    "translated-sentence"
  );
  // loop through flagged sentences
  for (const sentenceElement of sentencesToTranslate) {
    // request translator to process sentence
    const response = await translator.translate({
      from: "en",
      to: lang,
      text: sentenceElement.innerHTML,
      html: true,
    });
    // add sentence to html
    sentenceElement.innerHTML = response.target.text;
    // add event listener to original sentence card
    sentenceElement.addEventListener("click", toggleEnglishSentence);
  }
  // hide the loading indicator and show the processed content
  document.getElementById("loading-indicator").style.display = "none";
  document.getElementById("textbox").hidden = false;
}

// This function is used as an event listener for all open word profile buttons
function openModal() {
  // hide the tooltip from which the modal was opened from
  tippy.hideAll({ duration: 0 });
  // show modal
  document.getElementById("word-profile-modal").setAttribute("open", true);
}

// process selection after recieved from background.js
function processSelection(message) {
  // create webworker to process data without potentially freezing browser
  const w = new Worker("scripts/selection.js");
  // send user familiarty and selection to worker
  w.postMessage([message, fam]);
  // after first stage of processing done, complete second stage here
  w.onmessage = function (event) {
    // add precompiled html to the page
    document.getElementById("textbox").innerHTML = event.data;
    // setup tooltips for words
    tippy(".word", {
      // Setup instructions for on load of tooltip
      onShown(instance) {
        // clear past data from old tooltips (and modals) (templates are reused)
        document.getElementById("tooltip-definitions").innerHTML = "";
        document.getElementById("definitions-box").innerHTML = "";
        document.getElementById("syn-box").innerHTML = "";
        document.getElementById("ant-box").innerHTML = "";
        // get word data from api (wiktionary)
        fetch(
          "https://api.dictionaryapi.dev/api/v2/entries/en/" +
            instance.reference.innerHTML
        )
          .then((response) => response.json())
          .then((data) => {
            // set label to show what word is being viewed
            document.getElementById("tooltip-word").innerHTML =
              "<h5>" + instance.reference.innerHTML.toLowerCase() + "</h5>";
            // set label to show word is being viewed (in modal)
            document.getElementById("modal-word").innerHTML =
              instance.reference.innerHTML.toLowerCase();
            // create sets for synonyms and antonyms
            let synonyms = new Set();
            let antonyms = new Set();
            // loop through "definitions"
            data.forEach((wordDefinition) => {
              // loop through "meanings"
              wordDefinition.meanings.forEach((meaning) => {
                // add part of speech in tooltip
                document.getElementById("tooltip-definitions").innerHTML +=
                  "<strong>(" + meaning.partOfSpeech + ")</strong>";
                // add part of speech to modal and create accordion for it
                let futureDefinitionsBoxInnerHTML =
                  "<details><summary>(" + meaning.partOfSpeech + ")</summary>";
                // add one form of expressing the meaning to tooltip
                document.getElementById("tooltip-definitions").innerHTML +=
                  '<p class="tippy-p">' +
                  meaning.definitions[0].definition +
                  "</p>";
                // add all forms of expressing meaning to the modal
                meaning.definitions.forEach((actualdefinitionObject) => {
                  futureDefinitionsBoxInnerHTML +=
                    "<p>" + actualdefinitionObject.definition + "</p>";
                });
                // add synonyms to set
                meaning.synonyms.forEach((synonym) => {
                  synonyms.add(synonym);
                });
                // add antonyms to set
                meaning.antonyms.forEach((antonym) => {
                  antonyms.add(antonym);
                });
                futureDefinitionsBoxInnerHTML += "</details>";
                // put precompiled definitions into html (modal)
                document.getElementById("definitions-box").innerHTML +=
                  futureDefinitionsBoxInnerHTML;
              });
            });
            // check if any synonyms exist and hide synonyms view if none
            if (synonyms.size == 0) {
              document.getElementById("syn-title").style.visibility = "hidden";
            } else {
              document.getElementById("syn-title").style.visibility = "visible";
            }
            // loop through synonyms found between different meanings
            let synonymIndex = 0;
            synonyms.forEach((element) => {
              // add synonym to modal
              if (synonymIndex == 0) {
                document.getElementById("syn-box").innerHTML += element;
              } else {
                document.getElementById("syn-box").innerHTML += ", " + element;
              }
              synonymIndex++;
            });
            // check if any antonyms exist and hide synonyms view if none
            if (antonyms.size == 0) {
              document.getElementById("ant-title").style.visibility = "hidden";
            } else {
              document.getElementById("ant-title").style.visibility = "visible";
            }
            // loop through anyonyms found between different meanings
            let antonymIndex = 0;
            antonyms.forEach((element) => {
              // add antonym to modal
              if (antonymIndex == 0) {
                document.getElementById("ant-box").innerHTML += element;
              } else {
                document.getElementById("ant-box").innerHTML += ", " + element;
              }
              antonymIndex++;
            });
            // set tippy instance to template
            // (data has been loaded into the template)
            instance.setContent(
              document.getElementById("tooltip-template").innerHTML
            );
            // add event listener to all buttons that open word view (for different tippy instances)
            document.querySelectorAll(".tooltip-more").forEach((element) => {
              element.addEventListener("click", openModal);
            });
          })
          .catch((error) => {
            // if no word data exists, set tooltip to say no data
            document.getElementById("tooltip-word-no-data").innerHTML =
              "<h5>" + instance.reference.innerHTML.toLowerCase() + "</h5>";
            instance.setContent(
              document.getElementById("tooltip-no-data").innerHTML
            );
          });
      },
      onHidden(instance) {
        // when tooltip hidden, show loading icon so it is shown when another tooltip reuses template
        instance.setContent(
          document.getElementById("tooltip-loading").innerHTML
        );
      },
      theme: "picoinherit",
      placement: "bottom",
      allowHTML: true,
      trigger: "click",
      interactive: true,
      content: document.getElementById("tooltip-loading").innerHTML,
    });
    // translate sentences and complete stage 3 of processing
    translateSentences();
  };
}

// define event listener used for closing word profiles
const closeModal = () => {
  document.getElementById("word-profile-modal").setAttribute("open", false);
};

// add event listener to close word profiles
document.getElementById("close-modal").addEventListener("click", closeModal);
