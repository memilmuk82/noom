const socket = io(); // io() -> socket.io를 실행하고 있는 서버 탐색
// socket.io가 웹 소켓을 이용해 기능 수행

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true; // 채팅룸 초기 값 -> 채팅룸 off

let roomName; // 룸 이름을 저장할 변수 roonName 선언

function addMessage(message){
    const ul = room.querySelector("ul"); // #room 아래의 ul태그를 선택
    const li = document.createElement("li");  // li태그 요소
    li.innerText = message; // li태그에 message로 전달된 텍스트 추가
    ul.appendChild(li); // ul태그의 하위 태그로 li 추가
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("input"); // #room 아래의 input 태그를 선택
    const value = input.value;
    socket.emit("new_message", value, roomName, () => {
        // new_message 이벤트 발생 -> 서버에는 입력된 값, 채팅룸 이름과 함께 콜백 함수 전달 -> addMessage 함수 호출
        addMessage(`You: ${value}`);
    })
    input.value = "";
}

function showRoom(){ // showRoom 함수 호출
    welcome.hidden = true; // 룸 이름 off
    room.hidden = false; // 채팅룸 on
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`; // 룸 이름을 입력하면 값이 대입되어 h3에 표시
    const form = room.querySelector("form")
    form.addEventListener("submit", handleMessageSubmit);
    // 폼에서 적은 메시지 처리를 위해 이벤트 핸들러 함수 등록 추가
}

function handleRoomSubmit(event){ // input에 입력된 값을 읽고, 이를 소켓을 통해 서버로 전송
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    // socket.emit 메소드 -> 이벤트 발생 
    // JSON객체를 통한 문자열 변환을 하지 않아도 원활하게 데이터 전송이 이루어짐.    
    // enter_room 이벤트 발생 -> showRoom 함수 실행 -> 메시지 입력 폼 on, 룸 이름 입력 폼 off
    // emit메소드를 통해 showRoom함수를 서버로 전달 
    // -> enter_room 이벤트 발생 시 서버에서 이를 호출해주어야 함.
    roomName = input.value; // 입력된 값을 roomName 변수에 저장
    input.value = "";
};

form.addEventListener("submit", handleRoomSubmit); // submit 이벤트 발생 -> handleRoomSubmit

socket.on("welcome", () => { // welcome 이벤트 발생
    addMessage("someone joined!"); 
    // addMessage 함수 호출 -> 화면에 "someone joined!" 출력
});

socket.on("bye", () => {  // bye 이벤트 발생
    addMessage("someone left ㅠㅠ");
}); // addMessage 함수 호출 -> 화면에 "someone left ㅠㅠ" 출력

socket.on("new_message", (msg) => {  // new_message 이벤트 발생
    addMessage(msg);
}); // addMessage 함수 호출 -> 메시지를 같은 채팅룸의 모든 사용자에게 출력
