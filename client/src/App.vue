<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">🎌 Kanji Guessing Game</h1>

    <div v-if="!joined">
      <input v-model="username" placeholder="Your name" class="border p-2 mr-2" />
      <input v-model="roomId" placeholder="Room ID" class="border p-2 mr-2" />
      <button @click="joinRoom" class="bg-blue-500 text-white px-4 py-2">Join</button>
    </div>

    <div v-else>
      <p>Room: {{ roomId }}</p>
      <p>Player: {{ username }}</p>

      <button @click="startGame" class="bg-green-500 text-white px-4 py-2 mt-4">Start Game</button>

      <div v-if="question">
        <p class="mt-6 text-xl">What kanji means: <strong>{{ question.meaning }}</strong>?</p>
        <div class="grid grid-cols-2 gap-4 mt-4">
          <button
            v-for="choice in question.choices"
            :key="choice"
            class="border px-4 py-2 text-xl"
            @click="select(choice)"
          >
            {{ choice }}
          </button>
        </div>
      </div>

      <div v-if="scores">
        <h2 class="mt-8 text-lg font-bold">🏆 Scores:</h2>
        <ul>
          <li v-for="(s, name) in scores" :key="name">{{ name }}: {{ s }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { io } from "socket.io-client";
import { ref } from "vue";

const socket = io("http://localhost:3000");

const username = ref("");
const roomId = ref("");
const joined = ref(false);
const question = ref(null);
const scores = ref({});

function joinRoom() {
  socket.emit("join_room", { roomId: roomId.value, username: username.value });
  joined.value = true;
}

function startGame() {
  socket.emit("start_game", roomId.value);
}

function select(choice) {
  socket.emit("answer", {
    roomId: roomId.value,
    username: username.value,
    selected: choice
  });
  socket.emit("next", roomId.value);
}

socket.on("new_question", (q) => {
  question.value = q;
});

socket.on("score_update", (s) => {
  scores.value = s;
});
</script>
