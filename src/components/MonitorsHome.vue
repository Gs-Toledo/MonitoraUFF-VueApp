<template>
  <div v-if="loading">Carregando...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="!loading && !error" id="monitors-div" class="flex gap-4 justify-center">
    <div v-for="(monitor, index) in monitors" :key="index">
      <h2 class="text-center">
        <router-link class="monitor-anchor" :to="'/cameras/' + monitor.Monitor.Id">
          {{ monitor.Monitor.Name }}</router-link
        >
      </h2>
      <img
        width="500"
        height="600"
        :src="generateStreamUrl(monitor.Monitor.Id)"
        alt="Monitor Stream"
        class="monitor"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ZoneminderService from '@/services/zoneminderService'
import { generateConnKey, generateStreamUrl } from '@/utils/monitorUtils'
export default {
  data() {
    return {
      monitors: null,
      loading: true,
      error: null
    }
  },
  computed: {
    ...mapGetters(['getToken'])
  },
  methods: {
    async getAllMonitors() {
      try {
        const zoneminderService = new ZoneminderService()
        this.monitors = await zoneminderService.getMonitors()
      } catch (error) {
        this.error = 'Erro ao carregar stream do monitor'
      } finally {
        this.loading = false
      }
    },
    generateConnKey,
    generateStreamUrl
  },
  async mounted() {
    await this.getAllMonitors()
  }
}
</script>
