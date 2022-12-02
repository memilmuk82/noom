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
        // socket.on -> 이벤트 핸들링 메소드
        // 첫번째 인자 -> 이벤트 이름, 두번째 인자 -> 이벤트 핸들러 함수
        // 매개변수 roonName -> 프론트엔드에서 emit메소드를 통해 보낸 객체가 전달됨.
        console.log(roomName);
        setTimeout(() => {
            done();
        }, 5000);
    });
});    

const handleListen = () => console.log("Listening on http://localhost:3000");
httpserver.listen(3000, handleListen);