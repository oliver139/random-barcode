<template>
  <main class="page">
    <section class="content">
      <BarcodeShower :value="selectedBarcode" @refresh="getRandomBarcode()" />

      <footer>
        <ul>
          <li>
            <button type="button" class="stat-btn">
              <i-material-symbols-bar-chart-rounded style="transform: scaleX(-1);" />
            </button>
          </li>
          <li>
            <button type="button" class="setting-btn" @click="settingDialog?.showDialog()">
              <i-material-symbols-settings />
            </button>
          </li>
          <li>
            <button type="button" class="confirm-btn">
              <i-material-symbols-check />
            </button>
          </li>
        </ul>
      </footer>
    </section>

    <SettingDialog ref="settingDialog" />
  </main>
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

const settingDialog = useTemplateRef('settingDialog')
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
  position: relative;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
footer {
  position: absolute;
  left: 50%;
  top: 100%;
  margin-top: 1.5rem;
  transform: translateX(-50%);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}

button {
  display: flex;
  justify-content: center;
  align-items: center;
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

.setting-btn {
  background: #f97316;
}
.setting-btn:hover {
  background: #ea580c;
}

.confirm-btn {
  background: #10b981;
}
.confirm-btn:hover {
  background: #059669;
}
</style>
