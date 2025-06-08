const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // 你可以指定 Vercel 的域名
    methods: ["GET", "POST"]
  }
});

// 房间结构：roomId -> { players, currentQuestion, scores }
const rooms = {};

const kanjiPool = [
  {
    meaning: "water",
    answer: "水",
    choices: ["火", "木", "金", "水"]
  },
  {
    meaning: "fire",
    answer: "火",
    choices: ["火", "金", "水", "風"]
  }
];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join_room", ({ roomId, username }) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        scores: {},
        turn: 0
      };
    }
    rooms[roomId].players.push({ id: socket.id, name: username });
    rooms[roomId].scores[username] = 0;

    io.to(roomId).emit("player_list", rooms[roomId].players);
  });

  socket.on("start_game", (roomId) => {
    sendQuestion(roomId);
  });

  socket.on("answer", ({ roomId, username, selected }) => {
    const currentQ = rooms[roomId].currentQuestion;
    if (!currentQ) return;
    if (selected === currentQ.answer) {
      rooms[roomId].scores[username] += 10;
      io.to(roomId).emit("correct_answer", { username });
    }

    io.to(roomId).emit("score_update", rooms[roomId].scores);
  });

  socket.on("next", (roomId) => {
    sendQuestion(roomId);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

function sendQuestion(roomId) {
  const q = kanjiPool[Math.floor(Math.random() * kanjiPool.length)];
  rooms[roomId].currentQuestion = q;
  io.to(roomId).emit("new_question", q);
}

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
