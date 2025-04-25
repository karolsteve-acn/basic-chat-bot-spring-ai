const appBar = document.getElementById("appBar")
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");
const prompt = document.getElementById("prompt");
const inputPanel = document.getElementById("inputPanel");

sendBtn.addEventListener('click', async function(e) {
    if(prompt.value.length == 0) {
        return;
    }
    let promptValue = prompt.value;
    const messageContainer = createMessageBox('User');
    messageContainer.innerHTML = promptValue;
    messages.scrollTop = messages.scrollHeight;
    prompt.value = '';
    
    const botMessageContainer = createMessageBox('🤖 Bot');
    let response = await makeRequest(promptValue);
    let reader = response.body.getReader();
    await processResponse(reader, botMessageContainer);
});

async function processResponse(reader, botMessageContainer) {
    var decoder = new TextDecoder("utf-8");
    while(true) {
        const {done, value} = await reader.read();
        if(done) {
            break;
        }
        botMessageContainer.innerHTML += decoder.decode(value, {stream: true});
        messages.scrollTop = messages.scrollHeight;
    }
}

async function makeRequest(promptValue) {
    var response = await fetch("/chat?prompt=" + encodeURIComponent(promptValue));
    return response;
}

function createMessageBox(userName) {
    var title = document.createElement('strong');
    title.textContent = userName;

    var message = document.createElement('p');
    message.classList = ["messageContent"];

    var div = document.createElement('div');
    div.appendChild(title);
    div.appendChild(message);

    if(userName == 'User') {
        var divParent = document.createElement('div');
        divParent.appendChild(div);
        divParent.classList = ["userMessage"];
        messages.appendChild(divParent);
    } else {
        div.classList = ["botMessage"];
        messages.appendChild(div);
    }
    return message;
}

window.onload = window.onresize = function(){
    const window_height = window.innerHeight;
    messages.style.height = (window_height - 110) + 'px';
}