<template>
  <base-user-authenticated>
    <div class="h-full w-full">
      <!-- Barra de timeline -->
      <timeline-bar
        @update-dates="updateFilterDate"
        :events="events"
       
      />

      <div class="flex flex-col p-4 space-y-4">
        <!-- Skeleton Loader para o select -->
        <template v-if="loading">
          <v-skeleton-loader class="w-full" type="list-item" max-height="50px" />
        </template>

        <!-- Select Múltiplo -->
        <div v-else class="w-full">
          <v-select
            v-model="selectedMonitors"
            :items="monitors"
            item-value="id"
            item-title="name"
            bg-color="white"
            label="Selecione as Câmeras"
            multiple
            outlined
            class="w-full"
          ></v-select>
          <v-btn
            block
            class="mt-4"
            color="blue"
            variant="tonal"
            :disabled="isSendingRequest"
            @click="getEventsByMonitorId"
          >
            Filtrar
          </v-btn>
        </div>

        <!-- Exibição das Câmeras selecionadas -->
        <div
          v-if="filteredEvents.length > 0 && !loading && !isSendingRequest"
          class="w-full space-y-4"
        >
          <h3 class="text-xl font-bold">Gravações Filtradas:</h3>
          <div
            v-for="evento in filteredEvents"
            :key="evento.id"
            class="w-full p-4 border rounded-lg shadow-sm"
          >
            <b>{{ evento.monitorName }}</b> - Gravação: {{ evento.Event.Name }}
            <video
              autoplay
              controls
              class="w-full mt-2 rounded-lg"
              @loadedmetadata="setVideoTime(evento, $event.target)"
            >
              <source :src="generateEventVideoStreamUrl(evento.Event.Id)" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
<!-- 
       
        <div
          v-else-if="filteredEvents.length == 0 && !loading && !isSendingRequest"
          class="w-full text-center py-8"
        >
          <p class="text-gray-600">{{ resultMsg }}</p>
        </div>
 -->
        <v-alert v-if="error" type="error" class="mt-4">
          {{ error }}
        </v-alert>
      </div>
    </div>
  </base-user-authenticated>
</template>
<script>
import BaseUserAuthenticated from '@/components/BaseUserAuthenticated.vue'
import TimelineBar from '@/components/TimelineBar.vue'
import ZoneminderService from '@/services/zoneminderService'
import { generateEventVideoStreamUrl } from '@/utils/monitorUtils'
import { isValid, parse, differenceInSeconds } from 'date-fns'

export default {
  components: {
    BaseUserAuthenticated,
    TimelineBar
  },
  data() {
    return {
      monitors: [],
      filterDate: {
        startDate: '',
        endDate: '',
        selectedDate: ''
      },
      selectedMonitors: [],
      events: [],
      filteredEvents: [],
      isSendingRequest: false,
      error: '',
      loading: true
    }
  },
  methods: {
    async getAllMonitors() {
      try {
        this.error = ''
        this.loading = true
        const zoneminderService = new ZoneminderService()
        const responseData = await zoneminderService.getMonitors()
        this.monitors = responseData.map((monitor) => ({
          id: monitor.Monitor.Id,
          name: monitor.Monitor.Name
        }))
      } catch (error) {
        this.error = 'Erro ao carregar stream do monitor.'
      } finally {
        this.loading = false
      }
    },
    async getEventsByMonitorId() {
      if (this.selectedMonitors.length == 0) {
        alert('Escolha ao menos uma camera')
      } else if (this.filterDate.selectedDate == null) {
        alert('Selecione uma data. ')
      }

      try {
        this.isSendingRequest = true
        this.loading = true
        const zoneminderService = new ZoneminderService()
        this.events = []
        this.filteredEvents = []

        for (let monitorId of this.selectedMonitors) {
          const responseData = await zoneminderService.getEventsByMonitorId(
            monitorId,
            this.filterDate
          )

          this.events = [...this.events, ...responseData.events]

          const selectedTime = new Date(this.filterDate.selectedDate)
          let closestEvent = null
          let minTimeDiff = Infinity

          responseData.events.forEach((evento) => {
            const monitor = this.monitors.find((m) => m.id === monitorId)
            evento.monitorName = monitor ? monitor.name : 'Camera Desconhecida'

            const eventStart = new Date(evento.Event.StartDateTime)
            const eventEnd = new Date(evento.Event.EndDateTime)

            if (selectedTime >= eventStart && selectedTime <= eventEnd) {
              const timeDiff = Math.abs(selectedTime - eventStart)
              if (timeDiff < minTimeDiff) {
                minTimeDiff = timeDiff
                closestEvent = evento
              }
            }
          })

          if (closestEvent) {
            this.filteredEvents.push(closestEvent)
          }
        }
      } catch (error) {
        this.error = 'Erro ao carregar stream da câmera.'
      } finally {
        this.loading = false
        this.isSendingRequest = false
      }
    },
    updateFilterDate({ startDate, endDate, selectedDate }) {
      this.filterDate = { startDate, endDate, selectedDate }
    },
    setVideoTime(evento, videoElement) {
      if (!videoElement || !this.filterDate.startDate) return

      let eventStart = evento.Event.StartDateTime
      let eventEnd = evento.Event.EndDateTime
      let selectedTime = this.filterDate.selectedDate

      console.log('teste de datas', {
        eventStart: evento.Event.StartDateTime,
        eventEnd: evento.Event.EndDateTime,
        selectedTime: this.filterDate.selectedDate
      })

      eventStart =
        typeof eventStart === 'string'
          ? parse(eventStart, 'yyyy-MM-dd HH:mm:ss', new Date())
          : new Date(eventStart)
      eventEnd =
        typeof eventEnd === 'string'
          ? parse(eventEnd, 'yyyy-MM-dd HH:mm:ss', new Date())
          : new Date(eventEnd)
      selectedTime = selectedTime instanceof Date ? selectedTime : new Date(selectedTime)

      console.log('Datas convertidas:', { eventStart, eventEnd, selectedTime })

      if (!isValid(eventStart) || !isValid(eventEnd) || !isValid(selectedTime)) {
        console.error('Data inválida detectada!', { eventStart, eventEnd, selectedTime })
        return
      }

      let newTime = 0

      console.log('teste do if', selectedTime >= eventStart, selectedTime <= eventEnd)
      if (selectedTime >= eventStart && selectedTime <= eventEnd) {
        newTime = differenceInSeconds(selectedTime, eventStart)
      } else if (selectedTime > eventEnd) {
        newTime = differenceInSeconds(eventEnd, eventStart) // tempo max do evento
      }

      console.log(`Setando currentTime para: ${newTime} segundos`)

      const handleCanPlay = () => {
        videoElement.currentTime = newTime
        videoElement.removeEventListener('canplay', handleCanPlay)
      }

      videoElement.addEventListener('canplay', handleCanPlay, { once: true })
    },
    generateEventVideoStreamUrl
  },
  async mounted() {
    await this.getAllMonitors()
  }
}
</script>
