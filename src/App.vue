<template>
  <div class="page">
    <div class="content">
      <svg ref="svgRef" aria-label="Random barcode" />
      <button type="button" @click="handlePickClick">Pick again</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import JsBarcode from 'jsbarcode'
import random from 'random'
import { onMounted, ref } from 'vue'
import barcodes from './data/barcode'

const svgRef = ref<SVGSVGElement | null>(null)
const selectedBarcode = ref('')

function pickBarcode(ensureDifferent = false) {
  if (barcodes.length === 0) {
    selectedBarcode.value = ''
    return
  }

  if (!ensureDifferent || barcodes.length === 1) {
    const index = random.int(0, barcodes.length - 1)
    selectedBarcode.value = barcodes[index] ?? ''
    renderBarcode()
    return
  }

  // Ensure the new pick is different from the current one
  const currentIndex = selectedBarcode.value ? barcodes.indexOf(selectedBarcode.value) : -1
  const candidates = barcodes.map((_, i) => i).filter(i => i !== currentIndex)
  const pickIdx = random.int(0, candidates.length - 1)
  const index = candidates[pickIdx]!
  selectedBarcode.value = barcodes[index] ?? ''
  renderBarcode()
}

function renderBarcode() {
  if (!svgRef.value || !selectedBarcode.value) {
    return
  }

  JsBarcode(svgRef.value, selectedBarcode.value, {
    format: 'CODE39',
    displayValue: true,
    fontSize: 18,
    width: 2,
    height: 80,
    margin: 10,
  })
}

function handlePickClick(e: Event) {
  e.preventDefault()
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
  background: #f8fafc;
  padding: 16px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

svg {
  max-width: 100%;
  width: 320px;
  height: auto;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 9999px;
  background: #2563eb;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background: #1d4ed8;
}
</style>
