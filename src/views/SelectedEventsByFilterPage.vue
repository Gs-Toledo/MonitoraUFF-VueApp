<template>
  <base-user-authenticated>
    <div class="h-full w-full">
      <!-- Barra de timeline -->
      <TimelineBar @update-dates="updateFilterDate" :events="events" />

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
          <v-btn
            v-if="events.length > 0"
            block
            class="mt-4"
            color="green"
            variant="tonal"
            :disabled="isSendingRequest"
            @click="downloadRecordings"
            >Baixar Selecionados</v-btn
          >
        </div>

        <!-- Exibição das Câmeras selecionadas -->
        <h3
          v-if="filteredEvents.length > 0 && !loading && !isSendingRequest"
          class="text-xl font-bold"
        >
          Gravações Filtradas:
        </h3>
        <div
          v-if="filteredEvents.length > 0 && !loading && !isSendingRequest"
          class="w-full d-flex"
        >
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
        <v-alert v-if="errorMsg" type="error" class="mt-4">
          {{ errorMsg }}
        </v-alert>
      </div>
    </div>
  </base-user-authenticated>
</template>

<script setup lang="ts">
import BaseUserAuthenticated from '@/components/BaseUserAuthenticated.vue'
import { MonitoraAPiService } from '@/services/MonitoraApiService'
import ZoneminderService from '@/services/zoneminderService'
import { generateEventVideoStreamUrl } from '@/utils/monitorUtils'
import { isValid, parse, differenceInSeconds } from 'date-fns'
import { defineAsyncComponent, onMounted, ref } from 'vue'

interface TimelinefilterParams {
  startDate: string
  endDate: string
  selectedDate: string
}

const TimelineBar = defineAsyncComponent({
  loader: () => import('@/components/TimelineBar.vue')
})

const monitors = ref<{ id: number; name: string }[]>([])
const filterDate = ref({ startDate: '', endDate: '', selectedDate: '' })
const selectedMonitors = ref<number[]>([])
const events = ref([])

const filteredEvents = ref([])
const isSendingRequest = ref(false)
const errorMsg = ref('')
const loading = ref(true)

async function getAllMonitors() {
  try {
    errorMsg.value = ''
    loading.value = true
    const zoneminderService = new ZoneminderService()
    const responseData = await zoneminderService.getMonitors()
    monitors.value = responseData.map((monitor) => ({
      id: monitor.Monitor.Id,
      name: monitor.Monitor.Name
    }))
  } catch (error) {
    errorMsg.value = 'Erro ao carregar stream do monitor.'
    console.error(errorMsg.value, error)
  } finally {
    loading.value = false
  }
}

async function getEventsByMonitorId() {
  if (selectedMonitors.value.length == 0) {
    alert('Escolha ao menos uma camera')
  } else if (filterDate.value.selectedDate == null) {
    alert('Selecione uma data. ')
  }

  try {
    isSendingRequest.value = true
    loading.value = true
    const zoneminderService = new ZoneminderService()
    events.value = []
    filteredEvents.value = []

    for (let monitorId of selectedMonitors.value) {
      const responseData = await zoneminderService.getEventsByMonitorId(monitorId, filterDate.value)

      events.value = [...events.value, ...responseData.events]

      const selectedTime = new Date(filterDate.value.selectedDate)
      let closestEvent = null
      let minTimeDiff = Infinity

      responseData.events.forEach((evento) => {
        const monitor = monitors.value.find((m) => m.id === monitorId)
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
        filteredEvents.value.push(closestEvent)
      }
    }
  } catch (error) {
    errorMsg.value = 'Erro ao carregar stream da câmera.'
    console.error(errorMsg.value, error)
  } finally {
    loading.value = false
    isSendingRequest.value = false
  }
}

function updateFilterDate({ startDate, endDate, selectedDate }: TimelinefilterParams) {
  filterDate.value = { startDate, endDate, selectedDate }
}

function setVideoTime(evento, videoElement) {
  if (!videoElement || !filterDate.value.startDate) return

  let eventStart = evento.Event.StartDateTime
  let eventEnd = evento.Event.EndDateTime
  let selectedTime = filterDate.value.selectedDate

  console.log('teste de datas', {
    eventStart: evento.Event.StartDateTime,
    eventEnd: evento.Event.EndDateTime,
    selectedTime: filterDate.value.selectedDate
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
}

async function downloadRecordings() {
  try {
    isSendingRequest.value = true
    const { startDate, endDate } = filterDate.value

    const monitors = selectedMonitors.value.map((monitor) => {
      return { zoneminderInstanceId: 1, cameraId: monitor }
    })

    await MonitoraAPiService.downloadGravações(monitors, startDate, endDate)
  } catch (error) {
    errorMsg.value = error
    console.error('Erro no download de gravações:', error)
  } finally {
    isSendingRequest.value = false
  }
}

onMounted(() => {
  getAllMonitors()
})
</script>
