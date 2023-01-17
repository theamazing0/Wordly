// var splitmessage
// var messagewords = []

function handleResponse(message) {
    let currentword = ""
    for (var i = 0; i <= message.length; i++) {
        if (message[i] == "," || message[i] == "." || message[i] == "/" || message[i] == "~" || message[i] == "-" || message[i] == "_" || message[i] == "(" || message[i] == ")" || message[i] == "[" || message[i] == "]" || message[i] == "+" || message[i] == "!" || message[i] == "&" || message[i] == "?" || message[i] == '"') {
            // let currentWordIndex = messagewords.push(currentword) -1;
            // document.getElementById("textbox").innerHTML += `<a class="word" id="${currentWordIndex}">${currentword}</a>`;
            document.getElementById("textbox").innerHTML += `<a class="word">${currentword}</a>`;
            document.getElementById("textbox").innerHTML += message[i]
            currentword = ""
        } else if (message[i] == " ") {
            // let currentWordIndex = messagewords.push(currentword) -1;
            // document.getElementById("textbox").innerHTML += `<a class="word" id="${currentWordIndex}">${currentword}</a> `;
            document.getElementById("textbox").innerHTML += `<a class="word">${currentword}</a> `;
            // console.log(currentword)
            currentword = ""
            // console.log(currentWordIndex)
            // console.log(document.getElementById(currentWordIndex))
        } else if (message[i] == "\n") {
            // let currentWordIndex = messagewords.push(currentword) -1;
            // document.getElementById("textbox").innerHTML += `<a class="word" id="${currentWordIndex}">${currentword}</a><br>`;
            document.getElementById("textbox").innerHTML += `<a class="word">${currentword}</a><br>`;
            currentword = ""
        } else if (message[i] == "0" || message[i] == "1" || message[i] == "2" || message[i] == "3" || message[i] == "4" || message[i] == "5" || message[i] == "6" || message[i] == "8" || message[i] == "9") {
            // let currentWordIndex = messagewords.push(currentword) -1;
            // document.getElementById("textbox").innerHTML += `<a class="word" id="${currentWordIndex}">${currentword}</a>`;
            document.getElementById("textbox").innerHTML += `<a class="word">${currentword}</a>`;
            document.getElementById("textbox").innerHTML += message[i];
            currentword = "";
        } else {
            currentword += message[i]
        };
    };
    tippy(".word", {
        onShow(instance) {
            // fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + instance.reference.innerHTML)
            //     .then((response) => response.json())
            //     .then((data) => console.log(data));
            object = `[
                {
                  "word": "individual",
                  "phonetic": "/ˌɘndɘˈvɘd͡ʒɘl/",
                  "phonetics": [
                    {
                      "text": "/ˌɘndɘˈvɘd͡ʒɘl/",
                      "audio": ""
                    },
                    {
                      "text": "/ˌɪndəˈ-/",
                      "audio": ""
                    },
                    {
                      "text": "/ˌɪndəˈ-/",
                      "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/individual-us.mp3",
                      "sourceUrl": "https://commons.wikimedia.org/w/index.php?curid=1239779",
                      "license": {
                        "name": "BY-SA 3.0",
                        "url": "https://creativecommons.org/licenses/by-sa/3.0"
                      }
                    }
                  ],
                  "meanings": [
                    {
                      "partOfSpeech": "noun",
                      "definitions": [
                        {
                          "definition": "A person considered alone, rather than as belonging to a group of people.",
                          "synonyms": [],
                          "antonyms": [],
                          "example": "He is an unusual individual."
                        },
                        {
                          "definition": "A single physical human being as a legal subject, as opposed to a legal person such as a corporation.",
                          "synonyms": [],
                          "antonyms": []
                        },
                        {
                          "definition": "An object, be it a thing or an agent, as contrasted to a class.",
                          "synonyms": [],
                          "antonyms": []
                        },
                        {
                          "definition": "An element belonging to a population.",
                          "synonyms": [],
                          "antonyms": []
                        }
                      ],
                      "synonyms": [],
                      "antonyms": []
                    },
                    {
                      "partOfSpeech": "adjective",
                      "definitions": [
                        {
                          "definition": "Relating to a single person or thing as opposed to more than one.",
                          "synonyms": [],
                          "antonyms": [],
                          "example": "As we can't print them all together, the individual pages will have to be printed one by one."
                        },
                        {
                          "definition": "Intended for a single person as opposed to more than one person.",
                          "synonyms": [],
                          "antonyms": [],
                          "example": "individual personal pension; individual cream cakes"
                        },
                        {
                          "definition": "Not divisible without losing its identity.",
                          "synonyms": [],
                          "antonyms": []
                        }
                      ],
                      "synonyms": [
                        "personal",
                        "single",
                        "selfstanding",
                        "single"
                      ],
                      "antonyms": [
                        "group",
                        "joint",
                        "shared",
                        "collective"
                      ]
                    }
                  ],
                  "license": {
                    "name": "CC BY-SA 3.0",
                    "url": "https://creativecommons.org/licenses/by-sa/3.0"
                  },
                  "sourceUrls": [
                    "https://en.wiktionary.org/wiki/individual"
                  ]
                }
              ]`
            dataset = object[0]
            console.log(object)
            console.log("dataset")
            console.log(dataset)
        },
        placement: 'bottom',
        allowHTML: true,
        trigger: "click",
        interactive: true,
        content: document.getElementById('tooltip-template').innerHTML,
    });
    document.getElementById("loading-indicator").style.display = 'none';
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

const sending = browser.runtime.sendMessage({ request: "selection" });
sending.then(handleResponse, handleError);