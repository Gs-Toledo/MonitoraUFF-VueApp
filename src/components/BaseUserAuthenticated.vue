<template>
  <v-app>
    <app-bar-header />
    <v-main>
      <v-container class="fill-height">
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppBarHeader from '@/components/AppBarHeader.vue'

export default {
  components: {
    AppBarHeader
  }
}
</script>
