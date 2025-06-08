<template>
  <div class="p-6">
    <h1 class="text-xl font-bold">房间号：{{ roomId }}</h1>
    <p class="mb-2">你的名字：{{ username }}</p>

    <!-- 房主视角显示二维码 -->
    <div v-if="isHost" class="mt-4">
      <p class="mb-1">📷 让其他人扫码加入：</p>
      <qrcode-vue :value="fullUrl" :size="200" />
      <p class="text-xs mt-1 text-gray-500">{{ fullUrl }}</p>
    </div>

    <div v-if="question" class="mt-6">
      <p class="text-lg mb-2">意思是「{{ question.meaning }}」的汉字是？</p>
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="choice in question.choices"
          :key="choice"
          class="border p-2 text-lg"
          @click="select(choice)"
        >
          {{ choice }}
        </button>
      </div>
    </div>

    <div v-if="Object.keys(scores).length" class="mt-6">
      <h2 class="font-semibold">🏆 当前得分</h2>
      <ul>
        <li v-for="(s, name) in scores" :key="name">
          {{ name }}：{{ s }}
        </li>
      </ul>
    </div>

    <button
      @click="startGame"
      v-if="isHost"
      class="bg-green-500 text-white px-4 py-2 mt-6"
    >
      开始游戏
    </button>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { io } from 'socket.io-client'

const socket = io('https://kanji-game-test.onrender.com')

const route = useRoute()
const roomId = route.params.roomId
const username = ref('Player' + Math.floor(Math.random() * 1000))
const isHost = ref(false)

const question = ref(null)
const scores = ref({})

const fullUrl = computed(() =>
  typeof window !== 'undefined'
    ? window.location.origin + '/room/' + roomId
    : ''
)

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  isHost.value = urlParams.get('host') === '1'

  socket.emit('join_room', {
    roomId,
    username: username.value
  })

  socket.on('new_question', (q) => {
    question.value = q
  })

  socket.on('score_update', (s) => {
    scores.value = s
  })
})

function startGame() {
  socket.emit('start_game', roomId)
}

function select(choice) {
  socket.emit('answer', {
    roomId,
    username: username.value,
    selected: choice
  })
  socket.emit('next', roomId)
}
</script>
