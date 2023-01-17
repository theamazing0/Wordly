// var splitmessage
var messagewords = []

function handleResponse(message) {
    let currentword = ""
    for (var i = 0; i <= message.length; i++) {
        if (message[i] == "," || message[i] == "." || message[i] == "/" || message[i] == "~" || message[i] == "-" || message[i] == "_" || message[i] == "(" || message[i] == ")" || message[i] == "[" || message[i] == "]" || message[i] == "+" || message[i] == "!" || message[i] == "&" || message[i] == "?" || message[i] == '"') {
            let currentWordIndex = messagewords.push(currentword) - 1;
            document.getElementById("textbox").innerHTML += `<a class="word" id="${currentWordIndex}">${currentword}</a>`;
            document.getElementById("textbox").innerHTML += message[i]
            currentword = ""
        } else if (message[i] == " ") {
            let currentWordIndex = messagewords.push(currentword) - 1;
            document.getElementById("textbox").innerHTML += `<a class="word" id="${currentWordIndex}">${currentword}</a> `;
            currentword = ""
        } else if (message[i] == "\n") {
            let currentWordIndex = messagewords.push(currentword) - 1;
            document.getElementById("textbox").innerHTML += `<a class="word" id="${currentWordIndex}">${currentword}</a><br>`;
            currentword = ""
        } else if (message[i] == "0" || message[i] == "1" || message[i] == "2" || message[i] == "3" || message[i] == "4" || message[i] == "5" || message[i] == "6" || message[i] == "8" || message[i] == "9") {
            let currentWordIndex = messagewords.push(currentword) - 1;
            document.getElementById("textbox").innerHTML += `<a class="word" id="${currentWordIndex}">${currentword}</a>`;
            document.getElementById("textbox").innerHTML += message[i];
            currentword = "";
        } else {
            currentword += message[i]
        };
    };
    tippy(".word", {
        onShow(instance) {
            // fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + messagewords[instance.id])
            //     .then((response) => response.json())
            //     .then((data) => console.log(data));
            
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