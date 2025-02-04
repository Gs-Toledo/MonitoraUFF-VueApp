<template>
  <v-text-field
    label="Data Início"
    v-model="selectedDate"
    type="date"
    @update:modelValue="updateDate"
  ></v-text-field>

  <div id="timelinediv" class="timeline-container">
    <canvas
      id="timeline"
      ref="timelineCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="startDragging"
      @mousemove="drag"
      @mouseup="stopDragging"
      @mouseleave="stopDragging"
    ></canvas>
    <span id="scrubleft" :style="{ left: '5px' }">
      {{ formatToBrazilDate(startTime) }}
    </span>
    <span id="scrubright" :style="{ left: canvasWidth - 160 + 'px' }">
      {{ formatToBrazilDate(endTime) }}
    </span>
    <span id="scruboutput" :style="{ left: scrubOutputPosition + 'px' }">
      {{ formatToBrazilDate(selectedTime) }}
    </span>
  </div>
</template>

<script>
import { formatToBrazilDate } from '@/utils/formatUtils'
import { parseISO, startOfDay, endOfDay, addSeconds } from 'date-fns'

export default {
  emits: ['update-dates'],
  data() {
    return {
      canvasWidth: 896,
      canvasHeight: 94,
      dragging: false,
      scrubOutputPosition: 275,
      selectedDate: '2024-12-09',
      startTime: null,
      endTime: null,
      selectedTime: null,
      currentMarkerPosition: 0
    }
  },
  methods: {
    formatTime(date) {
      return date.toISOString().replace('T', ' ').split('.')[0]
    },
    formatToBrazilDate,
    updateDate(newDate) {
      if (!newDate) return

      const baseDate = parseISO(newDate)

      this.startTime = startOfDay(baseDate)
      this.endTime = endOfDay(baseDate)
      this.selectedTime = this.startTime // inicia no começo do dia


      this.$emit('update-dates', {
        startDate: this.startTime,
        endDate: this.endTime,
        selectedDate: this.selectedTime
      })


      this.drawTimeline()
    },
    drawTimeline() {
      const canvas = this.$refs.timelineCanvas
      if (!canvas) return

      const ctx = canvas.getContext('2d')

      // Clear canvas
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

      // Draw background
      ctx.fillStyle = '#eaeaea'
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

      // Draw time markers
      ctx.strokeStyle = '#555'
      ctx.lineWidth = 1

      const totalSeconds = (this.endTime.getTime() - this.startTime.getTime()) / 1000
      const secondsPerPixel = totalSeconds / this.canvasWidth

      for (let x = 0; x <= this.canvasWidth; x += 50) {
        const timeAtMarker = new Date(this.startTime.getTime() + x * secondsPerPixel * 1000)
        const timeLabel = this.formatTime(timeAtMarker).split(' ')[1]

        ctx.beginPath()
        ctx.moveTo(x, this.canvasHeight - 20)
        ctx.lineTo(x, this.canvasHeight)
        ctx.stroke()

        ctx.fillStyle = '#000'
        ctx.font = '10px Arial'
        ctx.fillText(timeLabel, x + 2, this.canvasHeight - 25)
      }

      // Draw vertical marker for current time
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(this.currentMarkerPosition, 0)
      ctx.lineTo(this.currentMarkerPosition, this.canvasHeight)
      ctx.stroke()
    },

    startDragging(event) {
      this.dragging = true
      this.updateScrubOutput(event)
    },

    drag(event) {
      if (this.dragging) {
        this.updateScrubOutput(event)
      }
    },

    stopDragging() {
      this.dragging = false
    },

    updateScrubOutput(event) {
      const rect = this.$refs.timelineCanvas.getBoundingClientRect()
      const x = event.clientX - rect.left

      const totalSeconds = (this.endTime - this.startTime) / 1000
      const secondsPerPixel = totalSeconds / this.canvasWidth

      // calcula o tempo selecionado
      const selectedSeconds = x * secondsPerPixel
      this.selectedTime = addSeconds(this.startTime, selectedSeconds)

      // evita ultrapassar os limites de 00:00 a 23:59
      if (this.selectedTime < this.startTime) this.selectedTime = this.startTime
      if (this.selectedTime > this.endTime) this.selectedTime = this.endTime

      this.scrubOutputPosition = Math.max(5, Math.min(x - 50, this.canvasWidth - 160))
      this.currentMarkerPosition = Math.max(0, Math.min(x, this.canvasWidth))

      this.$emit('update-dates', {
        startDate: this.startTime,
        endDate: this.endTime,
        selectedDate: this.selectedTime
      })

      console.log('valores',{
        startDate: this.startTime,
        endDate: this.endTime,
        selectedDate: this.selectedTime
      })
      this.drawTimeline()
    }
  },
  mounted() {
    this.updateDate(this.selectedDate)
  }
}
</script>

<style scoped>
.timeline-container {
  position: relative;
  width: 896px;
  height: 94px;
  background: #f4f4f4;
  border: 1px solid #ddd;
}

#scrubleft,
#scrubright {
  top: 9px;
}

#scrubleft,
#scrubright,
#scruboutput {
  position: absolute;
  display: inline-flex;
  font-size: 12px;
  color: #333;
}

#scruboutput {
  color: blue;
  bottom: 5px;
}

canvas {
  display: block;
  cursor: pointer;
}
</style>
