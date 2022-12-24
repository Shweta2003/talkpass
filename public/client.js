const socket = io();

let name;

let textarea = document.querySelector('#textarea');

let messageArea = document.querySelector('.message-area');

var audio = new Audio(src="notification.mp3", muted=true);
let p = 'password';
let t = "";
let s;
do{
    s = prompt("Enter correct the Password To join the room");
    if (s == p){
        t = p;
        alert("Welcome to the chat room");
    }
    else{
        alert("Wrong password.. try again");
    }
}while(t == "");

do{
    name = prompt("Please enter your name ");
}while(!name)

if(name){
    socket.emit('new-user',name);
}


textarea.addEventListener('keyup',(e) => {
    if(e.key === 'Enter'){
        sendMessage(e.target.value)
    }
})

function sendMessage(msg){
    let msg1 = {
        user : name,
        message : msg.trim()
    }
    //Append
    appendMessage('You',msg1.message,'outgoing');
    textarea.value = '';
    scrolltoBottom();

    //Send to server
    socket.emit('message',msg1);
}

function appendMessage(name,message, type){
    let mainDiv = document.createElement('div');
    let classname = type;
    mainDiv.classList.add(classname,'message');

    if(type == 'incoming'){
        audio.play();
    }

    let markup = `
        <h4>${name}</h4>
        <p>${message}</p>
    `
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv)
}

function alertMessage(name, type){
    let alertDiv = document.createElement('div');
    let classname = 'added';
    alertDiv.classList.add(classname);
    audio.play();

    let markup2;
    if(type == 'added'){
        markup2 = `
            <h4>${name} joined the chat</h4>
        `
    }
    else if (type == 'left'){
        markup2 = `
            <h4>${name} left the chat</h4>
        `
    }
    
    alertDiv.innerHTML = markup2;
    messageArea.appendChild(alertDiv)
}

//receive
socket.on('message',(msg1) => {
    appendMessage(msg1.user,msg1.message,'incoming');
    scrolltoBottom();
})

socket.on('new-user',(name) =>{
    alertMessage(name,'added');
    scrolltoBottom();
})

socket.on('left',(name) =>{
    alertMessage(name,'left');
    scrolltoBottom();
})

function scrolltoBottom(){
    messageArea.scrollTop = messageArea.scrollHeight;
}