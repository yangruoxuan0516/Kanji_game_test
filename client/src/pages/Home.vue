<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">🎌 创建 Kanji 游戏</h1>
    <button @click="createRoom" class="bg-blue-500 text-white px-4 py-2">
      创建新房间
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function createRoom() {
  const roomId = 'room-' + Math.random().toString(36).substring(2, 8)
  router.push(`/room/${roomId}?host=1`)
}
</script>
