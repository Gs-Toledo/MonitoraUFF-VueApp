<template>
  <v-app>
    <app-bar-header />
    <v-main>
      <v-container fluid class="fill-height p-4 m-4">
        <v-row no-gutters class="fill-height">
          <v-col cols="12" class="fill-height">
            <slot></slot>
          </v-col>
        </v-row>
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
