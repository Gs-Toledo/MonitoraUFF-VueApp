<template>
  <base-user-authenticated>
    <div>
      <!-- Barra de timeline -->
      <timeline-bar @update-dates="updateFilterDate" />

      <!-- Container principal -->
      <div class="d-flex flex-column p-4">
        <!-- Skeleton Loader para o select -->
        <template v-if="loading">
          <v-skeleton-loader
            class="mx-auto"
            :loading="loading"
            type="list-item"
            max-height="50px"
          />
        </template>

        <!-- Select Múltiplo -->
        <template v-else>
          <v-select
            v-model="selectedMonitors"
            :items="monitors"
            item-value="id"
            item-title="name"
            label="Selecione os Monitores"
            multiple
            outlined
            class="mt-4"
          ></v-select>
          <v-btn
            block
            class="mb-8"
            color="blue"
            variant="tonal"
            :disabled="isSendingRequest"
            @click="getEventsByMonitorId"
            >Filtrar</v-btn
          >
        </template>

        <!-- Exibição dos monitores selecionados -->
        <div class="mt-4" v-if="events.length > 0 && !loading && !isSendingRequest">
          <h3>Gravações Filtradas:</h3>
          <div v-for="evento in events" :key="evento.id" class="ma-2">
            {{ evento.Event.Name }}

            <!--   @canplay
                @loadeddata
                @loadedmetadata -->
            <video
              autoplay
              controls
              id="videoobj_html5_api"
              class="vjs-tech"
              @loadedmetadata="setVideoTime(evento, $event.target)"
            >
              <source :src="generateEventVideoStreamUrl(evento.Event.Id)" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

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
      try {
        this.isSendingRequest = true
        this.loading = true
        const zoneminderService = new ZoneminderService()
        this.events = []

        console.log('before request', this.filterDate)
        for (let monitorId of this.selectedMonitors) {
          const responseData = await zoneminderService.getEventsByMonitorId(
            monitorId,
            this.filterDate
          )
          this.events = [...responseData.events, ...this.events]
        }
      } catch (error) {
        this.error = 'Erro ao carregar stream da camera.'
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
