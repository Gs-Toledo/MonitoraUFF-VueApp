<template>
    <v-dialog :model-value="visible" max-width="400" @update:model-value="updateVisible">
      <v-card class="rounded-2xl shadow-lg">
        <v-card-title class="text-lg font-semibold">{{ title }}</v-card-title>
        <v-card-text class="text-gray-700">{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text class="text-gray-500" @click="closeModal">Cancelar</v-btn>
          <v-btn color="blue darken-1" text class="text-blue-600" @click="confirmLogout">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      visible: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
        default: 'Confirmar Logout',
      },
      message: {
        type: String,
        default: 'Você tem certeza que deseja sair?',
      },
    },
    emits: ['update:visible', 'confirm'],
    methods: {
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      closeModal() {
        this.$emit('update:visible', false);
      },
      confirmLogout() {
        this.$emit('confirm');
      },
    },
  };
  </script>
  