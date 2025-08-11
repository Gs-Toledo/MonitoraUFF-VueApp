<template>
  <v-dialog :model-value="visible" max-width="400" @update:model-value="updateVisible">
    <v-card class="rounded-2xl shadow-lg">
      <v-card-title class="text-lg font-semibold">{{ title }}</v-card-title>
      <v-card-text class="text-gray-700">{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn class="text-gray-500" @click="closeModal">Cancelar</v-btn>
        <v-btn color="blue darken-1" class="text-blue-600" @click="confirmLogout">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  title?: string
  message?: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void
}>()

const updateVisible = (value: boolean) => {
  emit('update:visible', value)
}

const closeModal = () => {
  emit('update:visible', false)
}

const confirmLogout = () => {
  emit('confirm')
}
</script>
