<template>
  <base-user-authenticated>
    <div v-if="isLoading && !hasError">Carregando...</div>
    <div v-else-if="!isLoading && !hasError" class="flex flex-column gap-4">
      <div class="monitor-event-div">
        <router-link class="monitor-anchor" :to="`/monitor/${id}`">Voltar</router-link>
        <h4 class="text-center">Monitor {{ monitor.Name }}: Evento {{ event.Event.Name }}</h4>
        <img
          width="500"
          height="600"
          :src="generateEventStreamUrl(eventId)"
          alt="Monitor Stream"
          class="monitor"
        />

        <div class="flex justify-between mt-6">
          <v-btn color="primary" class="flex-1 mx-2" @click="goBack"> Voltar </v-btn>

          <v-btn :color="isPaused ? 'green' : 'red'" class="flex-1 mx-2" @click="togglePause">
            {{ isPaused ? 'Retomar' : 'Pausar' }}
          </v-btn>

          <v-btn color="primary" class="flex-1 mx-2" @click="goForward"> Avançar </v-btn>
        </div>
      </div>
    </div>
    <div class="errorDiv" v-else-if="hasError && !isLoading">
      Erro na requisição, tente novamente mais tarde...
    </div>
  </base-user-authenticated>
</template>

<script>
import BaseUserAuthenticated from '@/components/BaseUserAuthenticated.vue'
import ZoneminderService from '@/services/zoneminderService'
import { formatToBrazilDate } from '@/utils/formatUtils'
import { generateEventStreamUrl } from '@/utils/monitorUtils'

export default {
  props: ['eventId', 'id'],
  components: {
    BaseUserAuthenticated
  },
  data() {
    return {
      monitor: {},
      event: {},
      isLoading: true,
      hasError: false,
      isPaused: false
    }
  },
  methods: {
    async getEventosFromMonitor() {
      let zoneminderService = new ZoneminderService()
      try {
        const response = await zoneminderService.getEvent(this.eventId)
        console.log(this.event)
        this.event = response.event
      } catch (error) {
        console.error('Erro ao buscar evento:', error)
        throw Error(error)
      }
    },
    async getAndShowMonitorFromId() {
      let zoneminderService = new ZoneminderService()
      try {
        let response = await zoneminderService.getMonitor(this.id)
        console.log('monitor:  ', response)
        this.monitor = response.Monitor
      } catch (error) {
        console.error('erro ao buscar o monitor', error)
        throw Error(error)
      }
    },
    async initEventMonitorRequests() {
      try {
        this.isLoading = true
        this.hasError = false
        Promise.all([this.getEventosFromMonitor(), this.getAndShowMonitorFromId()])
      } catch (error) {
        console.error('erro na chamada de requisicoes', error)
        this.hasError = true
      } finally {
        this.isLoading = false
      }
    },
    downloadEvent(eventId) {
      let zoneminderService = new ZoneminderService()

      return zoneminderService.downloadEvent(eventId)
    },
    generateEventStreamUrl,
    formatToBrazilDate
  },
  async mounted() {
    await this.initEventMonitorRequests()
  }
}
</script>
