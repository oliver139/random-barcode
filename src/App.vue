<template>
  <div class="page">
    <div class="content">
      <BarcodeShower :value="selectedBarcode" />
      <button type="button" aria-label="Pick again" @click.prevent="handlePickClick()">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="currentColor" d="M6.545 8.163a.75.75 0 0 1-.487-1.044l1.66-3.535a.75.75 0 0 1 1.36.002l.732 1.569l.08-.027a8.15 8.15 0 1 1-5.8 5.903a.75.75 0 1 1 1.456.364a6.65 6.65 0 1 0 4.907-4.862l.74 1.583a.75.75 0 0 1-.872 1.043z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import random from 'random'
import BarcodeShower from './components/BarcodeShower.vue'
import barcodes from './data/barcode'

const selectedBarcode = ref('')

function pickBarcode(ensureDifferent = false) {
  if (barcodes.length === 0) {
    selectedBarcode.value = ''
    return
  }

  if (!ensureDifferent || barcodes.length === 1) {
    const index = random.int(0, barcodes.length - 1)
    selectedBarcode.value = barcodes[index] ?? ''
    return
  }

  const currentIndex = selectedBarcode.value ? barcodes.indexOf(selectedBarcode.value) : -1
  const candidates = barcodes.map((_, i) => i).filter(i => i !== currentIndex)
  const pickIdx = random.int(0, candidates.length - 1)
  const index = candidates[pickIdx]!
  selectedBarcode.value = barcodes[index] ?? ''
}

function handlePickClick() {
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
  padding: 16px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

button {
  display: flex;
  padding: .5rem;
  border: none;
  border-radius: 9999px;
  background: #2563eb;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background: #1d4ed8;
}
</style>
