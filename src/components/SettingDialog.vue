<template>
  <!-- <button command="show-modal" commandfor="my-dialog">Open dialog</button> -->
  <dialog id="setting-dialog" ref="dialog">
    <form method="dialog" class="setting-dialog__content" @submit="saveSetting">
      <div class="form-content">
        <div class="title">條碼列表（名字，條碼）</div>
        <textarea v-model="barcodeList" autocomplete="off" rows="10" />
      </div>
      <ul class="btn-list">
        <li>
          <button type="button" class="close-dialog" commandfor="setting-dialog" command="close">
            <i-material-symbols-close />
          </button>
        </li>
        <li>
          <button type="submit" class="submit-dialog">
            <i-material-symbols-check />
          </button>
        </li>
      </ul>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import type { BarcodeInfo, UsageRecord } from '@/type/general'

const emit = defineEmits<{
  done: []
}>()

const dialog = useTemplateRef('dialog')
const barcodes = useLocalStorage<BarcodeInfo[]>('barcodes', [])
const records = useLocalStorage<Record<string, UsageRecord>>('records', {})

const barcodeList = ref('')
function isBarcodeText(code: string) {
  return code.trim().startsWith('/') && code.trim().length === 8
}
function saveSetting() {
  barcodes.value = barcodeList.value.replaceAll('，', ',').split('\n').filter((item) => {
    return item.includes(',') ? item.split(',').some(b => isBarcodeText(b.trim())) : isBarcodeText(item.trim())
  }).map<BarcodeInfo>((item) => {
    if (!item.includes(',')) return { name: '這誰？', code: item }

    const [v1, v2] = item.split(',').map(b => b.trim())
    return isBarcodeText(v1) ? { name: v2 || '這誰？', code: v1 } : { name: v1 || '這誰？', code: v2 }
  })
  records.value = {}
  emit('done')
}

function showDialog() {
  barcodeList.value = barcodes.value.map(item => Object.values(item).join(',')).join('\n')
  dialog.value?.showModal()
}

defineExpose({
  showDialog,
})
</script>

<style scoped>
dialog {
  width: min(24rem, 100%);
  opacity: 0;
  background: none;
  border: none;
  border-radius: 0;
  padding: 0;
  transition: all .3s ease allow-discrete;
  overflow: visible;
}
dialog::backdrop {
  background: rgb(255 255 255 / 0%);
  backdrop-filter: blur(0);
  transition: all .3s ease allow-discrete;
}

dialog[open] {
  display: flex;
  flex-flow: column nowrap;
  opacity: 1;
}
dialog[open]::backdrop {
  background: rgb(255 255 255 / 60%);
  backdrop-filter: blur(6px);
}

@starting-style {
  dialog[open] {
    opacity: 0;
  }
  dialog[open]::backdrop {
    background: rgb(255 255 255 / 0%);
    backdrop-filter: blur(0);
  }
}

.setting-dialog__content {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

.form-content {
  display: flex;
  width: 100%;
  position: relative;
  flex-flow: column nowrap;
  justify-content: center;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

ul {
  list-style: none;
}
.btn-list {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0;
  margin: 1.5rem 0 0;
}
.btn-list button {
  color: white;
  font-size: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 9999px;
  padding: .5rem;
  transition: background-color 0.2s ease;
  transition: all .3s ease;
  cursor: pointer;
}
.close-dialog {
  background: #f87171;
}
.close-dialog:hover {
  background: #ef4444;
}
.submit-dialog {
  background: #10b981;
}
.submit-dialog:hover {
  background: #059669;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

textarea {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: .5rem;
  padding: .75rem 1rem;
}
</style>
