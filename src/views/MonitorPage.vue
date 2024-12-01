<template>
  <base-user-authenticated>
    <div v-if="isLoading">Carregando...</div>
    <div v-if="!isLoading" class="flex flex-column gap-4">
      <div class="monitor-div">
        <h4 class="text-center">
          {{ monitor.Monitor.Name }}
        </h4>
        <img
          width="500"
          height="600"
          :src="generateStreamUrl(id)"
          alt="Monitor Stream"
          class="monitor"
        />
      </div>

<!--       <div>
        <video controls width="370" height="130">
          <source src="@/assets/video-teste.mp4" type="video/mp4" />
          Seu navegador não é compatível com vídeo HTML5.
        </video>
      </div>
 -->
      <v-card class="mt-4" id="lista-eventos">
        <v-card-title>Histórico de Eventos</v-card-title>
        <v-list two-line>
          <v-list-item
            v-for="event in events"
            :key="event.Event.Id"
            @click="selectEvent(event)"
            class="event-list-item mb-2"
          >
            <v-list-item-content>
              <v-list-item-title>Evento {{ event.Event.Id }}</v-list-item-title>
              <v-list-item-subtitle
                >{{ formatToBrazilDate(event.Event.StartTime) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :disabled="totalPages === 1"
          class="mt-4"
          @input="getEventosFromMonitor"
        ></v-pagination>
      </v-card>

      <v-dialog id="evento-modal" v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title> Detalhes do Evento </v-card-title>
          <v-card-text>
            <p><strong>Início:</strong> {{ formatToBrazilDate(selectedEvent.StartTime) }}</p>
            <p><strong>Fim:</strong> {{ formatToBrazilDate(selectedEvent.EndTime) }}</p>
            <p><strong>Duração:</strong> {{ selectedEvent.Length }} segundos</p>
            <p>
              <router-link
                class="monitor-anchor mt-2 mb-2"
                :to="`/monitor/${id}/evento/${selectedEvent.Id}`"
                >Ver evento</router-link
              >
            </p>
            <v-btn color="primary" :href="downloadEvent(selectedEvent.Id)" target="_blank">
              Download Evento
            </v-btn>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="dialog = false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </base-user-authenticated>
</template>

<script>
import BaseUserAuthenticated from '@/components/BaseUserAuthenticated.vue'
/* import axiosZoneminder from '@/services/axiosZoneminderConfig'; */
import ZoneminderService from '@/services/zoneminderService'
import { formatToBrazilDate } from '@/utils/formatUtils'
import { generateStreamUrl } from '@/utils/monitorUtils'

export default {
  props: ['id'],
  components: {
    BaseUserAuthenticated
  },
  data() {
    return {
      monitor: {},
      events: [],
      selectedEvent: {},
      currentPage: 1,
      totalPages: 1,
      isLoading: true,
      dialog: false
    }
  },
  methods: {
    async getAndShowMonitorFromId() {
      let zoneminderService = new ZoneminderService()
      try {
        this.isLoading = true
        let response = await zoneminderService.getMonitor(this.id)
        this.monitor = response
      } catch (error) {
        console.error('erro ao buscar o monitor', error)
      } finally {
        this.isLoading = false
      }
    },
    async getEventosFromMonitor() {
      let zoneminderService = new ZoneminderService()
      try {
        this.isLoading = true
        const response = await zoneminderService.getEventsByMonitorId(this.id, this.currentPage)
        this.events = response.events
        this.currentPage = response.pagination.current
        this.totalPages = response.pagination.pageCount
      } catch (error) {
        console.error('Erro ao buscar eventos:', error)
      } finally {
        this.isLoading = false
      }
    },
    selectEvent(event) {
      this.selectedEvent = event.Event
      this.dialog = true
    },
    downloadEvent(eventId) {
      let zoneminderService = new ZoneminderService()

      return zoneminderService.downloadEvent(eventId)
    },
    generateStreamUrl,
    formatToBrazilDate
  },
  async mounted() {
    await this.getAndShowMonitorFromId()
    await this.getEventosFromMonitor()
  }
}
</script>
