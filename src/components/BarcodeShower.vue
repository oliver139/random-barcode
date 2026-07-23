<template>
  <div class="barcode-shower">
    <button
      v-if="value"
      type="button"
      :disabled
      aria-label="Click to refresh"
      @click="$emit('refresh')"
    >
      <p class="hint-text">
        <i-material-symbols-refresh-rounded />
        <span>輕觸條碼以刷新</span>
      </p>
      <!-- eslint-disable-next-line vue/html-self-closing -->
      <svg ref="svgRef" class="barcode-img" aria-label="Invoice carrier"></svg>
    </button>
    <button v-else type="button" class="no-barcode" @click="$emit('addNew')">
      <i-material-symbols-add />
    </button>

    <button v-if="disabled" type="button" class="request-new" @click="$emit('requestNew')">
      <i-material-symbols-refresh-rounded style="transform: scaleX(-1);" />
    </button>
  </div>
</template>

<script setup lang="ts">
import JsBarcode from 'jsbarcode'

const props = defineProps<{
  value?: string
  disabled: boolean
}>()

defineEmits<{
  refresh: []
  addNew: []
  requestNew: []
}>()

const svgRef = ref<SVGSVGElement | null>(null)

function renderBarcode(value: string) {
  if (!svgRef.value || !value) return

  JsBarcode(svgRef.value, value, {
    format: 'CODE39',
    displayValue: true,
    fontSize: 18,
    textMargin: 10,
    width: 2,
    height: 80,
    margin: 10,
  })
}

watchImmediate(() => props.value, (v) => {
  if (!props.value) {
    if (svgRef.value) svgRef.value.innerHTML = ''
    return
  }

  if (svgRef.value) svgRef.value.innerHTML = ''
  if (v) renderBarcode(v)
}, { flush: 'post' })
</script>

<style scoped>
.hint-text {
  font-size: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  margin: 0 0 .25rem;
  gap: .25rem;
}
button {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
}

.barcode-shower {
  position: relative;
}
.barcode-shower .barcode-img {
  max-width: 100%;
}

.no-barcode {
  color: #94a3b8;
  font-size: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 340px;
  height: 128px;
  border: 1px dashed currentColor;
  border-radius: .25rem;
}

.request-new {
  color: #374151;
  font-size: 4rem;
  position: absolute;
  inset: -.5rem;
  background: #e2e8f0d9;
}
</style>
