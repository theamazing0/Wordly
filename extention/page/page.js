// var splitmessage
// var messagewords = []
var modalvisible = false;

function openModal() {
  // if (isScrollbarVisible()) {
  //   document.getElementById("word-profile-modal").style.setProperty("--scrollbar-width", `${getScrollbarWidth()}px`);
  // }
  tippy.hideAll({ duration: 0 });
  modalvisible = true;
  document.getElementById("word-profile-modal").setAttribute("open", true);
}

function handleResponse(message) {
  let currentword = "";
  for (var i = 0; i <= message.length; i++) {
    if (
      message[i] == "," ||
      message[i] == "." ||
      message[i] == "/" ||
      message[i] == "~" ||
      message[i] == "-" ||
      message[i] == "_" ||
      message[i] == "(" ||
      message[i] == ")" ||
      message[i] == "[" ||
      message[i] == "]" ||
      message[i] == "+" ||
      message[i] == "!" ||
      message[i] == "&" ||
      message[i] == "?" ||
      message[i] == '"' ||
      message[i] == ":" ||
      message[i] == ";"
    ) {
      // let currentWordIndex = messagewords.push(currentword) -1;
      // document.getElementById("textbox").innerHTML += `<a class="word" id="${currentWordIndex}">${currentword}</a>`;
      document.getElementById("textbox").innerHTML += `<a class="word">${currentword}</a>`;
      document.getElementById("textbox").innerHTML += message[i];
      currentword = "";
    } else if (message[i] == " ") {
      // let currentWordIndex = messagewords.push(currentword) -1;
      // document.getElementById("textbox").innerHTML += `<a class="word" id="${currentWordIndex}">${currentword}</a> `;
      document.getElementById("textbox").innerHTML += `<a class="word">${currentword}</a> `;
      // console.log(currentword)
      currentword = "";
      // console.log(currentWordIndex)
      // console.log(document.getElementById(currentWordIndex))
    } else if (message[i] == "\n") {
      // let currentWordIndex = messagewords.push(currentword) -1;
      // document.getElementById("textbox").innerHTML += `<a class="word" id="${currentWordIndex}">${currentword}</a><br>`;
      document.getElementById("textbox").innerHTML += `<a class="word">${currentword}</a><br>`;
      currentword = "";
    } else if (
      message[i] == "0" ||
      message[i] == "1" ||
      message[i] == "2" ||
      message[i] == "3" ||
      message[i] == "4" ||
      message[i] == "5" ||
      message[i] == "6" ||
      message[i] == "7" ||
      message[i] == "8" ||
      message[i] == "9"
    ) {
      // let currentWordIndex = messagewords.push(currentword) -1;
      // document.getElementById("textbox").innerHTML += `<a class="word" id="${currentWordIndex}">${currentword}</a>`;
      document.getElementById("textbox").innerHTML += `<a class="word">${currentword}</a>`;
      document.getElementById("textbox").innerHTML += message[i];
      currentword = "";
    } else {
      currentword += message[i];
    }
  }
  tippy(".word", {
    onShown(instance) {
      console.log("------------- NEW WORD ----------------");
      document.getElementById("tooltip-definitions").innerHTML = "";
      document.getElementById("definitions-box").innerHTML = "";
      fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + instance.reference.innerHTML)
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("tooltip-word").innerHTML =
            "<h5>" + instance.reference.innerHTML.toLowerCase() + "</h5>";
          document.getElementById("modal-word").innerHTML = instance.reference.innerHTML.toLowerCase();
          console.log(data);
          data.forEach((wordDefinition) => {
            console.log("------------------- New wordDefinition");
            wordDefinition.meanings.forEach((meaning) => {
              console.log("--------- New meaning");
              console.log(meaning.partOfSpeech);
              document.getElementById("tooltip-definitions").innerHTML +=
                "<strong>(" + meaning.partOfSpeech + ")</strong>";
              let futureDefinitionsBoxInnerHTML = "<details><summary>(" + meaning.partOfSpeech + ")</summary>";
              // console.log(document.getElementById("definitions-box"));
              document.getElementById("tooltip-definitions").innerHTML +=
                '<p class="tippy-p">' + meaning.definitions[0].definition + "</p>";
              meaning.definitions.forEach((actualdefinitionObject) => {
                console.log(actualdefinitionObject.definition);
                futureDefinitionsBoxInnerHTML += "<p>" + actualdefinitionObject.definition + "</p>";
              });
              futureDefinitionsBoxInnerHTML += "</details>";
              document.getElementById("definitions-box").innerHTML += futureDefinitionsBoxInnerHTML;
            });
          });
          // document.getElementById("tooltip-button-div").innerHTML = '<a class="tooltip-more">+</a>';
          // console.log(document.getElementById("tooltip-more"))
          // document
          //   .getElementById("word-profile-modal")
          //   .setAttribute("open", true);
          // document.getElementById("tooltip-button-div").addEventListener(click, openModal);
          instance.setContent(document.getElementById("tooltip-template").innerHTML);
          console.log("hello2");
          document.querySelectorAll(".tooltip-more").forEach((element) => {
            element.addEventListener("click", openModal);
            console.log("Adding Event Listener for openModal");
          });
        })
        .catch(() => {
          document.getElementById("tooltip-word-no-data").innerHTML =
            "<h5>" + instance.reference.innerHTML.toLowerCase() + "</h5>";
          instance.setContent(document.getElementById("tooltip-no-data").innerHTML);
          console.log("error");
        });
    },
    onHidden(instance) {
      instance.setContent(document.getElementById("tooltip-loading").innerHTML);
    },
    theme: "picoinherit",
    placement: "bottom",
    allowHTML: true,
    trigger: "click",
    interactive: true,
    content: document.getElementById("tooltip-loading").innerHTML,
  });
  document.getElementById("loading-indicator").style.display = "none";
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

// const getScrollbarWidth = () => {
//   // Creating invisible container
//   const outer = document.createElement("div");
//   outer.style.visibility = "hidden";
//   outer.style.overflow = "scroll"; // forcing scrollbar to appear
//   outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
//   document.body.appendChild(outer);

//   // Creating inner element and placing it in the container
//   const inner = document.createElement("div");
//   outer.appendChild(inner);

//   // Calculating difference between container's full width and the child width
//   const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

//   // Removing temporary elements from the DOM
//   outer.parentNode.removeChild(outer);

//   return scrollbarWidth;
// };

// const isScrollbarVisible = () => {
//   return document.body.scrollHeight > screen.height;
// };

const closeModal = () => {
  modalvisible = false;
  // document.getElementById("word-profile-modal").style.removeProperty("--scrollbar-width");
  document.getElementById("word-profile-modal").setAttribute("open", false);
};

//TODO Implement click outside modal
// document.addEventListener("click", (event) => {
//   if (modalvisible == true) {
//     const modalContent = document.getElementById("word-profile-modal").querySelector("article");
//     const isClickInside = modalContent.contains(event.target);
//     console.log(isClickInside);
//     if (isClickInside == false) {
//       closeModal();
//     }
//   }
// });

document.getElementById("close-modal").addEventListener("click", closeModal);

const sending = browser.runtime.sendMessage({ request: "selection" });
sending.then(handleResponse, handleError);
