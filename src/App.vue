<template>
  <main ref="main" class="page">
    <section class="content" :class="{ up: barcodes.length && layout !== 'down' && (displayTop || layout === 'up') }">
      <header>
        <h1>{{ selectedBarcode?.name ?? '還沒有條碼資料' }}</h1>
        <p v-if="refreshedCount">已刷新過了 {{ refreshedCount }} 次</p>
      </header>

      <BarcodeShower
        :value="selectedBarcode?.code"
        :disabled="doneRecording"
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
          <li>
            <button type="button" class="refresh-btn" @click="doneRecording ? newBarcode() : getRandomBarcode()">
              <i-material-symbols-refresh-rounded style="transform: scaleX(-1);" />
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
import type { BarcodeInfo, Layout, UsageRecord } from './type/general'
import random from 'random'
import BarcodeShower from './components/BarcodeShower.vue'

const barcodes = useLocalStorage<BarcodeInfo[]>('barcodes', [])
const selectedBarcode = shallowRef<BarcodeInfo | null>(null)
const records = useLocalStorage<Record<string, UsageRecord>>('records', {})
const layout = useLocalStorage<Layout>('layout', 'swipe')

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

// Swipe function
const mainEle = useTemplateRef('main')
const displayTop = ref(false)
const { distanceY } = usePointerSwipe(mainEle, {
  disableTextSelect: true,
  onSwipeEnd: (_, direction) => {
    if (!mainEle.value || layout.value !== 'swipe') return
    if (direction !== 'up' && direction !== 'down') return
    if (Math.abs(distanceY.value) < 200) return

    displayTop.value = direction === 'up'
  },
})
whenever(() => layout.value !== 'swipe', () => displayTop.value = false)
</script>

<style scoped>
.page {
  --header-footer-height: 4rem;
  --barcode-height: 8rem;
  --content-item-gap: 2.5rem;
  --content-height: calc(var(--header-footer-height) * 2 + var(--barcode-height) + var(--content-item-gap) * 2);

  min-height: 100vh;
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  padding: .5rem;
}

.content {
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: var(--content-height);
  gap: var(--content-item-gap);
  transform: translateY(-50%);
}

header, footer {
  text-align: center;
  position: absolute;
  width: 100%;
  height: var(--header-footer-height);
}
header {
  display: flex;
  flex-flow: column;
  bottom: 100%;
  justify-content: flex-end;
  transform: translateY(100%);
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
  bottom: 0;
}
.barcode-shower {
  position: absolute;
  top: 50%;
  width: 100%;
  height: var(--barcode-height);
  transform: translateY(-50%);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .5rem;
  border: none;
  border-radius: 9999px;
  color: white;
  font-size: 2.25rem;
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

.refresh-btn {
  background: #60a5fa;
}
.refresh-btn:hover {
  background: #3b82f6;
}

.content, .content > * {
  transition: all .4s cubic-bezier(.56, 1.89, .69, .64);
}

.content.up {
  height: 100%;
  top: 0;
  transform: translateY(0);
}
.content.up header {
  bottom: calc(var(--header-footer-height) * 2 + 5rem);
}
.content.up footer {
  bottom: 2.5rem;
}
.content.up .barcode-shower {
  transform: translateY(0);
  top: 1.5rem;
}
</style>
