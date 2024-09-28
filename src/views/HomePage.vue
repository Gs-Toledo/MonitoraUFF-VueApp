<template>
  <v-app>
    <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon> <v-icon icon="mdi-menu"></v-icon></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>Monitora Uff</v-app-bar-title>
      <template v-slot:append>
        <v-btn icon="mdi-heart"></v-btn>

        <v-btn icon="mdi-magnify"></v-btn>

        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <v-container class="fill-height"> Cameras </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ZoneminderService from '@/services/zoneminderService';


export default {
 data() {
  return {
    monitors: null
  }
 },
  async mounted() {
    const zoneminderService = new ZoneminderService()
    this.monitors = await zoneminderService.getMonitors()
  }
}
</script>
