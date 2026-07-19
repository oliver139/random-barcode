<template>
  <div class="barcode-shower">
    <button type="button" aria-label="Click to refresh" @click="$emit('refresh')">
      <!-- eslint-disable-next-line vue/html-self-closing -->
      <svg ref="svgRef" aria-label="Invoice carrier"></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import JsBarcode from 'jsbarcode'

const props = defineProps<{
  value: string
}>()

defineEmits<{
  refresh: []
}>()

const svgRef = ref<SVGSVGElement | null>(null)

function renderBarcode(value: string) {
  if (!svgRef.value || !value) return

  JsBarcode(svgRef.value, value, {
    format: 'CODE39',
    displayValue: true,
    fontSize: 18,
    width: 2,
    height: 80,
    margin: 10,
  })
}

onMounted(() => {
  if (props.value) renderBarcode(props.value)
})

watch(() => props.value, (v) => {
  if (svgRef.value) svgRef.value.innerHTML = ''
  if (v) renderBarcode(v)
})
</script>

<style scoped>
button {
  cursor: pointer;
  display: flex;
  background: none;
  border: none;
  padding: 0;
}
.barcode-shower {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.barcode-shower svg {
  max-width: 100%;
  width: 320px;
  height: auto;
}
</style>
