<template>
  <div class="page">
    <div class="content">
      <BarcodeShower :value="selectedBarcode" @refresh="getRandomBarcode()" />
      <ul>
        <li>
          <button type="button" class="stat-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path fill="currentColor" d="M7.755 13.38v6.83a1.54 1.54 0 0 1-1.54 1.54h-1.81a1.54 1.54 0 0 1-1.55-1.54v-6.83a1.54 1.54 0 0 1 1.55-1.55h1.81a1.54 1.54 0 0 1 1.54 1.55m6.7-9.58v16.41a1.54 1.54 0 0 1-1.55 1.54h-1.81a1.55 1.55 0 0 1-1.55-1.54V3.8a1.56 1.56 0 0 1 1.55-1.55h1.81a1.55 1.55 0 0 1 1.55 1.55m6.69 5.18v11.23a1.54 1.54 0 0 1-1.54 1.54h-1.81a1.54 1.54 0 0 1-1.55-1.54V8.98a1.55 1.55 0 0 1 1.55-1.55h1.85a1.55 1.55 0 0 1 1.5 1.55" />
            </svg>
          </button>
        </li>
        <li>
          <button type="button" class="confirm-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path fill="currentColor" d="M9 15.59L4.71 11.3L3.3 12.71l5 5c.2.2.45.29.71.29s.51-.1.71-.29l11-11l-1.41-1.41L9.02 15.59Z" />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import random from 'random'
import BarcodeShower from './components/BarcodeShower.vue'
import barcodes from './data/barcode'

const defaultBarcode = ''
const selectedBarcode = ref('')

function pickBarcode(ensureDifferent = false) {
  if (barcodes.length === 0) {
    selectedBarcode.value = defaultBarcode
    return
  }

  if (!ensureDifferent || barcodes.length === 1) {
    selectedBarcode.value = random.choice(barcodes) || defaultBarcode
    return
  }

  const candidates = barcodes.filter(b => b !== selectedBarcode.value)
  selectedBarcode.value = random.choice(candidates) || defaultBarcode
}

function getRandomBarcode() {
  pickBarcode(true)
}

onMounted(() => {
  pickBarcode()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .5rem;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

button {
  display: flex;
  padding: .5rem;
  border: none;
  border-radius: 9999px;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  transition: all .3s ease;
}

.stat-btn {
  background: #facc15;
}
.stat-btn:hover {
  background: #eab308;
}

.confirm-btn {
  background: #10b981;
}
.confirm-btn:hover {
  background: #059669;
}
</style>
