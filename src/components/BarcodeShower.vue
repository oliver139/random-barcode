<template>
  <div class="barcode-shower">
    <button type="button" aria-label="Click to refresh" @click="$emit('refresh')">
      <p class="hint-text">
        <i-material-symbols-refresh-rounded />
        <span>輕觸以刷新</span>
      </p>
      <!-- eslint-disable-next-line vue/html-self-closing -->
      <svg ref="svgRef" class="barcode-img" aria-label="Invoice carrier"></svg>
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.barcode-shower .barcode-img {
  max-width: 100%;
  width: 320px;
  height: auto;
}
</style>
