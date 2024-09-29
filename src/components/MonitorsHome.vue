<template>
  <div v-if="loading">Carregando...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="!loading && !error" id="monitors-div">
    <div v-for="(monitor, index) in monitors" :key="index">
      <h4>{{ monitor.Monitor.Name }}</h4>
      <img
        width="500"
        height="600"
        :src="generateStreamUrl(monitor.Monitor_Status.MonitorId)"
        alt="Monitor Stream"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ZoneminderService from '@/services/zoneminderService'
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
    async getObsMonitor() {
      try {
        const zoneminderService = new ZoneminderService()
        this.monitors = await zoneminderService.getMonitors()
      } catch (error) {
        this.error = 'Erro ao carregar stream do monitor'
      } finally {
        this.loading = false
      }
    },
    generateConnKey() {
      // Gera um connkey aleatorio para um stream (é recomendado pela API)
      return Math.floor(Math.random() * 100000)
    },
    generateStreamUrl(monitorId) {
      const baseUri =
        '/cgi-bin/nph-zms?scale=100&width=500&height=600&mode=jpeg&maxfps=5&buffer=1000'
      return `${baseUri}&monitor=${monitorId}&token=${this.getToken}&connkey=${this.generateConnKey}`
    }
  },
  async mounted() {
    await this.getObsMonitor()
  }
}
</script>
