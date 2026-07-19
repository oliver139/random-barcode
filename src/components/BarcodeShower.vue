<template>
  <div class="barcode-shower">
    <!-- eslint-disable-next-line vue/html-self-closing -->
    <svg ref="svgRef" aria-label="Invoice carrier"></svg>
  </div>
</template>

<script setup lang="ts">
import JsBarcode from 'jsbarcode'

const props = defineProps<{
  value: string
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
