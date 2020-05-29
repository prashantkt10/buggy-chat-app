window.onload = function () {
    let ws = new WebSocket('ws://localhost:9001');
    const joinChatContainer = document.getElementById('joinChatContainer');
    const joinChatInput = document.getElementById('joinChatInput');
    const joinChatBtn = document.getElementById('joinChatBtn');
    const errorMessageText = document.getElementById('errorMessageText');
    const liveChatContainer = document.getElementById('liveChatContainer');
    const newChatInput = document.getElementById('newChatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const msgList = document.getElementById('msgList');

    const disableChatForm = function (txtInput, btn, handleBtn) {
        txtInput.disabled = true;
        btn.style.cursor = 'not-allowed';
        btn.removeEventListener('click', handleBtn);
        errorMessageText.style.color = 'red';
        errorMessageText.innerText = 'Connecting with server...';
        errorMessageText.style.display = 'block';
        return;
    }

    const enableChatForm = function (txtInput, btn, handleBtn) {
        txtInput.disabled = false;
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', handleBtn);
        errorMessageText.style.color = 'green';
        errorMessageText.innerText = 'Server connected.';
        errorMessageText.style.display = 'block';
        return;
    }

    const moveDownErrMsg = function () {
        errorMessageText.style.top = '83%';
        return;
    }

    const moveUpErrMsg = function () {
        errorMessageText.style.top = '70%';
        return;
    }

    const showSendChatContainer = function () {
        liveChatContainer.style.display = 'block';
        joinChatContainer.style.display = 'none';
        moveDownErrMsg();
        return;
    }

    const setUserName = function (userName) {
        if (!userName || userName.length < 3) return;
        localStorage.setItem('buggyUser', userName);
        return;
    }

    const getUserName = function (key) {
        if (!key) return;
        return localStorage.getItem(key);
    }

    const startChat = function () {
        if (!joinChatInput.value || joinChatInput.value.length < 3) return;
        showSendChatContainer();
        setUserName(joinChatInput.value);
        return;
    }

    const sendMessage = function () {
        if (!newChatInput.value || newChatInput.value.length < 2 || !getUserName('buggyUser')) return;
        const chatMessage = { 'from': getUserName('buggyUser'), 'message': newChatInput.value };
        ws.send(JSON.stringify(chatMessage));
    }
    let uniqueColor = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    const addMessageToList = function (msg) {
        if (!msg) return;
        let p = document.createElement('p');
        p.innerHTML = `<p><b style="color:${uniqueColor}">${msg.from}: </b>${msg.message}<p>`;
        let msgList = document.getElementById('msgList');
        msgList.appendChild(p);
    }

    const connectToWSServer = function () {
        ws = new WebSocket('ws://localhost:9001');
        ws.onerror = function () {
            ws.close();
        }
        return;
    }

    ws.onmessage = function (msg) {
        addMessageToList(JSON.parse(msg.data));
    }


    let formsEnabled = false;
    setInterval(function () {
        console.log('ws.readyState: ', ws.readyState);
        if (ws.readyState === 0 || ws.readyState === 2 || ws.readyState === 3) {
            formsEnabled = false;
            disableChatForm(joinChatInput, joinChatBtn, startChat);
            disableChatForm(newChatInput, sendChatBtn, sendMessage);
            connectToWSServer();
            return;
        }
        if (!formsEnabled) {
            formsEnabled = true;
            enableChatForm(joinChatInput, joinChatBtn, startChat);
            enableChatForm(newChatInput, sendChatBtn, sendMessage);
            return;
        }
        return;
    }, 1000);


    if (getUserName('buggyUser')) showSendChatContainer();
    disableChatForm(joinChatInput, joinChatBtn, startChat);
    disableChatForm(newChatInput, sendChatBtn, sendMessage);
}