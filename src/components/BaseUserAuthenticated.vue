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

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const AppBarHeader = defineAsyncComponent({
  loader: () => import('@/components/AppBarHeader.vue')
})
</script>
