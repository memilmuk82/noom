import http from "http";
import SocketIO from "socket.io";
import express from 'express';

const app = express();

app.set("view engine", "pug")
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const httpserver = http.createServer(app);
// Node.js에 기본으로 내장된 HTTP패키지를 사용해서 express.js로 만든 서버 애플리케이션 제공
// HTTP서버: httpserver, 웹소켓서버: wsServer
const wsServer = SocketIO(httpserver); // wsServer를 만들기 위해 SocketIO에 httpserver를 넘겨줌

wsServer.on("connection", (socket) => {
    socket.on("enter_room", (roomName, done) => { 
        // socket.emit("enter_room", input.value, () <- app.js emit 메소드 인자로 3개 사용됨.
        // socket.on -> 이벤트 핸들링 메소드
        // 첫번째 인자 -> 이벤트 이름, 두번째 인자 -> 이벤트 핸들러 함수(done),app.js의 showRoom함수
        // 매개변수 roonName -> 프론트엔드에서 emit메소드를 통해 보낸 객체(input.value)가 전달됨.
        done(); // app.js의 showRoom함수 호출
        socket.join(roomName); // socket.io에서 채팅룸에 접속하기 위한 메소드
        socket.to(roomName).emit("welcome"); 
        // to메소드 -> 소켓이 join메소드로 접속한 채팅룸을 대상으로 설정
        // emit 메소드 호출 -> 해당 채팅룸에 참가한 소켓들에 대해서만 이벤트 발생(이벤트명 "welcome")        
    });

    socket.on("disconnecting", () => { 
        // disconnecting 이벤트 : 브라우저 창을 닫거나 컴퓨터를 꺼서 채팅룸을 나가기 직전에 발생하는 이벤트
        socket.rooms.forEach(room => socket.to(room).emit("bye"));
        // disconnecting 이벤트 발생 -> 사용자 소켓이 bye 이벤트 발생(접속중인 채팅룸에서만 발생)
        // rooms -> 접속중인 채팅룸 목록을 뜻하는 셋(set) 객체
        // set 객체 -> 배열처럼 반복할 수 있는 객체
        // forEach 메소드 -> set이 포함하고 있는 개별 요소에 접근해 클백 함수를 호출할 수 있음.
    });

    socket.on("new_message", (msg, room, done) => { 
        // new_message 이벤트 발생 -> 메시지(msg), 채팅룸 이름(room), 콜백함수(doon)를 받아서 차리
        socket.to(room).emit("new_message", msg);
        // to 메소드를 사용 -> 같은 채팅룸 소켓을 대상으로 new_message 이벤트 발생
        done(); // 콜백 함수 호출
    });
});    

const handleListen = () => console.log("Listening on http://localhost:3000");
httpserver.listen(3000, handleListen);