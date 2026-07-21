<template>
  <!-- <button command="show-modal" commandfor="my-dialog">Open dialog</button> -->
  <dialog id="record-dialog" ref="dialog" closedby="any">
    <div class="record-dialog__content">
      <div class="title">使用次數紀錄</div>
      <table class="record-list">
        <thead>
          <tr>
            <th style="text-align: left;">誰的</th>
            <th style="text-align: left;">號碼</th>
            <th style="text-align: right;">次數</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in recordList" :key="r.code">
            <td style="text-align: left;">{{ r.name }}</td>
            <td style="text-align: left;">{{ r.code }}</td>
            <td style="text-align: right;">{{ r.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <ul class="btn-list">
      <li>
        <button type="button" class="delete-record" @dblclick="clearRecord">
          <i-material-symbols-delete />
        </button>
      </li>
      <li>
        <button type="button" class="close-dialog" commandfor="record-dialog" command="close">
          <i-material-symbols-close />
        </button>
      </li>
    </ul>
  </dialog>
</template>

<script setup lang="ts">
import type { UsageRecord } from '@/type/general'

const dialog = useTemplateRef('dialog')
const records = useLocalStorage<Record<string, UsageRecord>>('records', {})
const recordList = computed(() => Object.entries(records.value).map(([code, { name, count }]) => ({ name, code, count })))

function showDialog() {
  dialog.value?.showModal()
}

function clearRecord() {
  records.value = {}
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

.record-dialog__content {
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

.record-list {
  border-collapse: collapse;
  margin-top: .75rem;
}
.record-list :is(th, td) {
  padding: .75rem .375rem;
  border-bottom: 1px solid #000;
}
.record-list th{
  border-bottom-width: 2px;
}

.btn-list {
  display: flex;
  justify-content: center;
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
.delete-record {
  background: #f87171;
}
.delete-record:hover {
  background: #ef4444;
}
.close-dialog {
  background: #94a3b8;
}
.close-dialog:hover {
  background: #64748b;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
}

textarea {
  border: 1px solid #ccc;
  border-radius: .5rem;
  padding: .75rem 1rem;
}
</style>
