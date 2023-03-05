import { LatencyOptimisedTranslator } from "../bergamot-translator/translator.js";

const translator = new LatencyOptimisedTranslator();

function toggleEnglishSentence(event) {
  const originalElement = this.parentElement.querySelector("article");
  if (originalElement.hidden == false) {
    originalElement.hidden = true;
  } else {
    originalElement.hidden = false;
  }
}

async function translateSentences() {
  const sentencesToTranslate = document.getElementsByClassName(
    "translated-sentence"
  );
  for (const sentenceElement of sentencesToTranslate) {
    const response = await translator.translate({
      from: "en",
      to: "es",
      text: sentenceElement.innerHTML,
      html: true,
    });
    sentenceElement.innerHTML = response.target.text;
    sentenceElement.addEventListener("click", toggleEnglishSentence);
  }
  document.getElementById("loading-indicator").style.display = "none";
  document.getElementById("textbox").hidden = false;
}

var modalvisible = false;

function openModal() {
  tippy.hideAll({ duration: 0 });
  modalvisible = true;
  document.getElementById("word-profile-modal").setAttribute("open", true);
}

function processSelection(message) {
  let w;
  w = new Worker("scripts/selection.js");
  w.postMessage(message);
  w.onmessage = function (event) {
    console.log("Recieved parsed message: " + event);
    document.getElementById("textbox").innerHTML = event.data;
    tippy(".word", {
      onShown(instance) {
        document.getElementById("tooltip-definitions").innerHTML = "";
        document.getElementById("definitions-box").innerHTML = "";
        document.getElementById("syn-box").innerHTML = "";
        document.getElementById("ant-box").innerHTML = "";
        fetch(
          "https://api.dictionaryapi.dev/api/v2/entries/en/" +
            instance.reference.innerHTML
        )
          .then((response) => response.json())
          .then((data) => {
            document.getElementById("tooltip-word").innerHTML =
              "<h5>" + instance.reference.innerHTML.toLowerCase() + "</h5>";
            document.getElementById("modal-word").innerHTML =
              instance.reference.innerHTML.toLowerCase();
            let synonyms = new Set();
            let antonyms = new Set();
            data.forEach((wordDefinition) => {
              wordDefinition.meanings.forEach((meaning) => {
                document.getElementById("tooltip-definitions").innerHTML +=
                  "<strong>(" + meaning.partOfSpeech + ")</strong>";
                let futureDefinitionsBoxInnerHTML =
                  "<details><summary>(" + meaning.partOfSpeech + ")</summary>";
                document.getElementById("tooltip-definitions").innerHTML +=
                  '<p class="tippy-p">' +
                  meaning.definitions[0].definition +
                  "</p>";
                meaning.definitions.forEach((actualdefinitionObject) => {
                  futureDefinitionsBoxInnerHTML +=
                    "<p>" + actualdefinitionObject.definition + "</p>";
                });
                meaning.synonyms.forEach((synonym) => {
                  synonyms.add(synonym);
                });
                meaning.antonyms.forEach((antonym) => {
                  antonyms.add(antonym);
                });
                futureDefinitionsBoxInnerHTML += "</details>";
                document.getElementById("definitions-box").innerHTML +=
                  futureDefinitionsBoxInnerHTML;
              });
            });
            let synonymIndex = 0;
            if (synonyms.size == 0) {
              document.getElementById("syn-title").style.visibility = "hidden";
            } else {
              document.getElementById("syn-title").style.visibility = "visible";
            }
            synonyms.forEach((element) => {
              if (synonymIndex == 0) {
                document.getElementById("syn-box").innerHTML += element;
              } else {
                document.getElementById("syn-box").innerHTML += ", " + element;
              }
              synonymIndex++;
            });
            let antonymIndex = 0;
            if (antonyms.size == 0) {
              document.getElementById("ant-title").style.visibility = "hidden";
            } else {
              document.getElementById("ant-title").style.visibility = "visible";
            }
            antonyms.forEach((element) => {
              if (antonymIndex == 0) {
                document.getElementById("ant-box").innerHTML += element;
              } else {
                document.getElementById("ant-box").innerHTML += ", " + element;
              }
              antonymIndex++;
            });
            instance.setContent(
              document.getElementById("tooltip-template").innerHTML
            );
            document.querySelectorAll(".tooltip-more").forEach((element) => {
              element.addEventListener("click", openModal);
            });
          })
          .catch((error) => {
            document.getElementById("tooltip-word-no-data").innerHTML =
              "<h5>" + instance.reference.innerHTML.toLowerCase() + "</h5>";
            instance.setContent(
              document.getElementById("tooltip-no-data").innerHTML
            );
            console.log(error);
          });
      },
      onHidden(instance) {
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
    translateSentences();
  };
}

function handleError(error) {
  console.log("Error: " + error);
}

const closeModal = () => {
  modalvisible = false;
  document.getElementById("word-profile-modal").setAttribute("open", false);
};

document.getElementById("close-modal").addEventListener("click", closeModal);

const sending = browser.runtime.sendMessage({ request: "selection" });
sending.then(processSelection, handleError);
