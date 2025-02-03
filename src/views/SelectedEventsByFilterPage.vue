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
          <h3>Eventos Filtrados:</h3>
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
        endDate: ''
      },
      selectedMonitors: [],
      events: [],
      isSendingRequest: false,
      error: '',
      loading: true
    }
  },
  computed: {
    videoCurrentTimes() {
      if (!this.filterDate.startDate) return {}
      console.log('stardate', this.filterDate.startDate)
      const selectedTime = new Date(this.filterDate.startDate).getTime()
      return this.events.reduce((acc, evento) => {
        const eventStart = new Date(evento.Event.StartDateTime).getTime()
        console.log({ selectedTime: selectedTime, eventStart: eventStart })
        acc[evento.Event.Id] = selectedTime >= eventStart ? (selectedTime - eventStart) / 1000 : 0
        return acc
      }, {})
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
        for (let monitorId of this.selectedMonitors) {
          const responseData = await zoneminderService.getEventsByMonitorId(
            monitorId,
            this.filterDate
          )
          this.events = [...responseData.events, ...this.events]
        }
      } catch (error) {
        this.error = 'Erro ao carregar stream do monitor.'
      } finally {
        this.loading = false
        this.isSendingRequest = false
      }
    },
    updateFilterDate({ startDate, endDate }) {
      this.filterDate = { startDate, endDate }
    },
    setVideoTime(evento, videoElement) {
      if (!videoElement || !this.filterDate.startDate) return

      const eventStart = new Date(evento.Event.StartDateTime + 'Z').getTime();
      const selectedTime = this.filterDate.startDate.getTime();

      
      const newTime = selectedTime >= eventStart ? (selectedTime - eventStart) / 1000 : 0
      console.log('selectedTime, eventStart', selectedTime, eventStart, newTime)
      console.log('Formato das datas:', evento.Event.StartDateTime, this.filterDate.startDate);


      const handleCanPlay = () => {
        videoElement.currentTime = newTime
        console.log(`Setando currentTime para: ${newTime}`)

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
