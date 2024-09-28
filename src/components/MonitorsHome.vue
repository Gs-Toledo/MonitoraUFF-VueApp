<template>
  <div v-if="loading">Carregando...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    VideoStream:
    <img width="500" height="600" :src="streamUrl" alt="Monitor Stream" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ZoneminderService from '@/services/zoneminderService'
export default {
  data() {
    return {
      monitors: null,
      streamUrl: '',
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

        const token = this.getToken
        const connkey = Math.floor(Math.random() * 100000) // Gera um connkey aleatório
        this.streamUrl = `/cgi-bin/nph-zms?scale=100&width=500&height=600&mode=jpeg&maxfps=5&buffer=1000&monitor=3&token=${token}&connkey=${connkey}`
      } catch (error) {
        this.error = 'Erro ao carregar stream do monitor'
      } finally {
        this.loading = false
      }
    }
  },
  async mounted() {
    await this.getObsMonitor()
  }
}
</script>
