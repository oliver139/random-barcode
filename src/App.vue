<template>
  <main class="page">
    <section class="content">
      <header>
        <h1>{{ selectedBarcode?.name ?? '還沒有條碼資料' }}</h1>
        <p v-if="refreshedCount">已刷新過了 {{ refreshedCount }} 次</p>
      </header>

      <BarcodeShower
        :value="selectedBarcode?.code"
        :disabled="doneRecording"
        @refresh="getRandomBarcode()"
        @add-new="settingDialog?.showDialog()"
        @request-new="newBarcode()"
      />

      <footer>
        <ul v-if="barcodes.length">
          <li>
            <button type="button" class="stat-btn" @click="recordDialog?.showDialog()">
              <i-material-symbols-bar-chart-rounded style="transform: scaleX(-1);" />
            </button>
          </li>
          <li>
            <button type="button" class="setting-btn" @click="settingDialog?.showDialog()">
              <i-material-symbols-settings />
            </button>
          </li>
          <li>
            <button type="button" class="confirm-btn" :disabled="doneRecording" @click="recordResult()">
              <i-material-symbols-check />
            </button>
          </li>
        </ul>
      </footer>
    </section>

    <SettingDialog ref="settingDialog" @done="doneSetting()" />
    <RecordDialog ref="recordDialog" />
  </main>
</template>

<script setup lang="ts">
import type { BarcodeInfo, UsageRecord } from './type/general'
import random from 'random'
import BarcodeShower from './components/BarcodeShower.vue'

const barcodes = useLocalStorage<BarcodeInfo[]>('barcodes', [])
const selectedBarcode = shallowRef<BarcodeInfo | null>(null)
const records = useLocalStorage<Record<string, UsageRecord>>('records', {})
const doneRecording = ref(false)

const refreshedCount = ref(0)

function getRandomBarcode(ensureDifferent = false) {
  if (barcodes.value.length === 0) {
    selectedBarcode.value = null
    return
  }
  if (barcodes.value.length === 1) {
    selectedBarcode.value = barcodes.value[0]
    return
  }

  refreshedCount.value += 1

  if (!ensureDifferent) {
    selectedBarcode.value = random.choice(barcodes.value)!
    return
  }

  const candidates = barcodes.value.filter(b => b.code !== selectedBarcode.value?.code)
  selectedBarcode.value = random.choice(candidates)!
}

function newBarcode() {
  nextTick(() => {
    getRandomBarcode()
    refreshedCount.value = 0
    doneRecording.value = false
  })
}

onMounted(() => {
  newBarcode()
})

const settingDialog = useTemplateRef('settingDialog')
function doneSetting() {
  newBarcode()
}
function recordResult() {
  if (!selectedBarcode.value) return

  const currentCount = records.value[selectedBarcode.value.code]?.count || 0
  records.value = {
    ...records.value,
    [selectedBarcode.value.code]: {
      name: selectedBarcode.value.name,
      count: currentCount + 1,
    },
  }
  doneRecording.value = true
}

const recordDialog = useTemplateRef('recordDialog')
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
header {
  text-align: center;
  position: absolute;
  left: 50%;
  bottom: 100%;
  margin-bottom: 2.5rem;
  transform: translateX(-50%);
  white-space: nowrap;
}
header h1 {
  font-size: 1.5rem;
  margin: 0;
}
header p {
  font-size: 1.125rem;
  margin: .75rem 0 0;
}
footer {
  position: absolute;
  left: 50%;
  top: 100%;
  margin-top: 2.5rem;
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
button:disabled {
  opacity: .4;
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
