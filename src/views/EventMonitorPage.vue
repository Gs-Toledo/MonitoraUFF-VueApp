<template>
    <base-user-authenticated>
      <div v-if="isLoading">Carregando...</div>
      <div v-else-if="!isLoading" class="flex flex-column gap-4">
        <div class="monitor-event-div">
          <h4 class="text-center">
            Evento {{ event }} do Monitor {{ monitor.Monitor.Name }}
          </h4>
          <img
            width="500"
            height="600"
            :src="generateEventStreamUrl(id, eventId)"
            alt="Monitor Stream"
            class="monitor"
          />
        </div>
      </div>
    </base-user-authenticated>
  </template>
  
  <script>
  import BaseUserAuthenticated from '@/components/BaseUserAuthenticated.vue'
  import ZoneminderService from '@/services/zoneminderService'
  import { formatToBrazilDate } from '@/utils/formatUtils'
  import { generateEventStreamUrl } from '@/utils/monitorUtils'
  
  export default {
    props: ['eventId'],
    components: {
      BaseUserAuthenticated
    },
    data() {
      return {
        monitor: {},
        event: {},
        isLoading: true,
      }
    },
    methods: {
      async getEventosFromMonitor() {
        let zoneminderService = new ZoneminderService()
        try {
          this.isLoading = true
          const response = await zoneminderService.getEvent(this.eventId)
          console.log(this.event)
          this.event = response
        } catch (error) {
          console.error('Erro ao buscar evento:', error)
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
      await this.getEventosFromMonitor()
    }
  }
  </script>
  