<template>
  <v-app>
    <app-bar-header />
    <v-main>
      <v-container class="fill-height">
        <monitors-home />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppBarHeader from '@/components/AppBarHeader.vue';
import MonitorsHome from '@/components/MonitorsHome.vue';
export default {
  components: {
    AppBarHeader,
    MonitorsHome
  }
}
</script>
