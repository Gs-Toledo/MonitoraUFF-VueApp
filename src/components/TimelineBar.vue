<template>
  <div>
    <v-text-field
      label="Data Início"
      v-model="selectedDate"
      bg-color="white"
      type="date"
      @change="updateDate(selectedDate)"
    ></v-text-field>
  </div>

  <div class="timeline-container" v-show="events.length > 0">
    <canvas
      id="timeline"
      ref="timelineCanvas"
      :width="800"
      :height="100"
      @mousedown="startDragging"
    ></canvas>

    <span class="no-select" id="scrubleft">{{ formatToBrazilDate(startTime) }}</span>
    <span class="no-select" id="scrubright">{{ formatToBrazilDate(endTime) }}</span>
    <span class="no-select" id="scruboutput" :style="{ left: scrubOutputPosition + 'px' }">
      {{ formatToBrazilDate(selectedTime) }}
    </span>
  </div>

  <div class="text-gray-600" v-if="events.length == 0">
    <div class="w-full text-center py-8">
      <p class="text-gray-600">Nenhuma Gravação Disponível.</p>
    </div>
  </div>
</template>

<script>
import { formatToBrazilDate } from '@/utils/formatUtils'
import { parseISO, startOfDay, endOfDay, isSameDay, addSeconds } from 'date-fns'

export default {
  emits: ['update-dates'],
  props: {
    events: { type: Array, default: () => [] }
  },
  data() {
    return {
      dragging: false,
      scrubOutputPosition: 275,
      selectedDate: '2024-12-09',
      startTime: null,
      endTime: null,
      selectedTime: null,
      currentMarkerPosition: 0,
      eventMarkers: []
    }
  },
  watch: {
    events: {
      immediate: true,
      handler() {
        this.processEvents()
      }
    }
  },
  methods: {
    formatToBrazilDate,

    updateDate(newDate) {
      if (!newDate) return
      const baseDate = parseISO(newDate)
      this.startTime = startOfDay(baseDate)
      this.endTime = endOfDay(baseDate)
      this.selectedTime = this.startTime

      this.$emit('update-dates', {
        startDate: this.startTime,
        endDate: this.endTime,
        selectedDate: this.selectedTime
      })

      this.processEvents()
    },

    processEvents() {
      if (!this.startTime) return

      this.eventMarkers = this.events
        .filter((event) => isSameDay(parseISO(event.Event.StartDateTime), this.startTime))
        .map((event) => ({
          start: parseISO(event.Event.StartDateTime),
          end: parseISO(event.Event.EndDateTime)
        }))

      this.drawTimeline()
    },

    startDragging(event) {
      event.preventDefault() // Previne ações indesejadas
      this.dragging = true
      window.addEventListener('mousemove', this.drag)
      window.addEventListener('mouseup', this.stopDragging)
      this.updateScrubOutput(event)
    },

    drag(event) {
      if (this.dragging) {
        this.updateScrubOutput(event)
      }
    },

    stopDragging() {
      this.dragging = false
      window.removeEventListener('mousemove', this.drag)
      window.removeEventListener('mouseup', this.stopDragging)
    },

    updateScrubOutput(event) {
      if (!this.startTime || !this.endTime) return

      const rect = this.$refs.timelineCanvas.getBoundingClientRect()
      const x = Math.max(0, Math.min(event.clientX - rect.left, 800))
      const totalSeconds = (this.endTime - this.startTime) / 1000
      const secondsPerPixel = totalSeconds / 800
      this.selectedTime = addSeconds(this.startTime, x * secondsPerPixel)
      this.scrubOutputPosition = Math.max(5, Math.min(x - 50, 740))
      this.currentMarkerPosition = x

      this.$emit('update-dates', {
        startDate: this.startTime,
        endDate: this.endTime,
        selectedDate: this.selectedTime
      })

      this.drawTimeline()
    },

drawTimeline() {
  const canvas = this.$refs.timelineCanvas;
  if (!canvas || !this.startTime || !this.endTime) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Fundo
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, width, height);

  const totalSeconds = (this.endTime - this.startTime) / 1000;
  const secondsPerPixel = totalSeconds / width;

  // Marcas de hora reais, iterando por tempo, não por pixel
  const timeStep = 60 * 60 * 1000; // 1 hora em ms
  const firstHour = new Date(this.startTime);
  firstHour.setMinutes(0, 0, 0); // arredonda para a hora cheia

  for (let t = firstHour.getTime(); t <= this.endTime.getTime(); t += timeStep) {
    const x = ((t - this.startTime.getTime()) / 1000) / secondsPerPixel;

    // Linha da hora
    ctx.beginPath();
    ctx.moveTo(x, 65);
    ctx.lineTo(x, height);
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Texto da hora
    const hourLabel = new Date(t).toTimeString().substring(0, 5);
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    ctx.fillText(hourLabel, x + 2, 60);
  }

  // Faixas de eventos
  this.eventMarkers.forEach((event) => {
    const startX = (event.start - this.startTime) / 1000 / secondsPerPixel;
    const endX = (event.end - this.startTime) / 1000 / secondsPerPixel;

    ctx.fillStyle = 'rgba(0, 180, 255, 0.5)';
    ctx.fillRect(startX, 0, endX - startX, height);
  });

  // Linha central vermelha (marcador atual)
  ctx.beginPath();
  ctx.moveTo(this.currentMarkerPosition, 0);
  ctx.lineTo(this.currentMarkerPosition, height);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.stroke();
}

  },

  mounted() {
    this.updateDate(this.selectedDate)
    this.$nextTick(() => {
      this.drawTimeline()
    })
  }
}
</script>

<style scoped>
.timeline-container {
  width: 800px;
  margin: auto;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background-color: #f5f5f5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

canvas {
  display: block;
  cursor: pointer;
  border-radius: 20px;
  background-color: #f5f5f5;
}

#scrubleft,
#scrubright,
#scruboutput {
  position: absolute;
  display: inline-flex;
  font-size: 12px;
  color: #333;
  bottom: 5px;
}

#scrubleft {
  left: 5px;
}

#scrubright {
  right: 5px;
}

#scruboutput {
  color: blue;
  top: 5px;
}
</style>
