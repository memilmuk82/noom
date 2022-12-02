const socket = io(); // io() -> socket.io를 실행하고 있는 서버 탐색
// socket.io가 웹 소켓을 이용해 기능 수행

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function handleRoomSubmit(event){ // input에 입력된 값을 읽고, 이를 소켓을 통해 서버로 전송
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, () => {
        // 첫번째 인자: 이벤트명, 두번째 인자: 서버에 전쇼ㅗㅇ할 데이터, 세번째 인자: 익명 함수
        console.log("server is done!");
    });
    // socket.emit 메소드 -> 이벤트 발생 / JSON객체를 통한 문자열 변환을 하지 않아도 원활하게 데이터 전송이 이루어짐.    
    input.value = "";
};

form.addEventListener("submit", handleRoomSubmit); // submit 이벤트 발생 -> handleRoomSubmit