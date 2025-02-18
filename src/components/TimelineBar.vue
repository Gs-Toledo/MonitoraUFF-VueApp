<template>
  <div>
    <v-text-field
      label="Data Início"
      v-model="selectedDate"
      type="date"
      @update:modelValue="updateDate"
    ></v-text-field>
  </div>

  <div class="timeline-container"  v-show="events.length > 0">
    <canvas
      id="timeline"
      ref="timelineCanvas"
      :width="800"
      :height="100"
      @mousedown="startDragging"
      @mousemove="drag"
      @mouseup="stopDragging"
      @mouseleave="stopDragging"
    ></canvas>
    <span id="scrubleft">{{ formatToBrazilDate(startTime) }}</span>
    <span id="scrubright">
      {{ formatToBrazilDate(endTime) }}
    </span>
    <span id="scruboutput" :style="{ left: scrubOutputPosition + 'px' }">
      {{ formatToBrazilDate(selectedTime) }}
    </span>
  </div>
</template>

<script>
import { formatToBrazilDate } from '@/utils/formatUtils'
import { parseISO, startOfDay, endOfDay, isSameDay, addSeconds } from 'date-fns'

export default {
  emits: ['update-dates'],
  props: {
    events: {
      type: Array,
      default: () => []
    }
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
      this.eventMarkers = this.events
        .filter((event) => isSameDay(parseISO(event.Event.StartDateTime), this.startTime))
        .map((event) => ({
          start: parseISO(event.Event.StartDateTime),
          end: parseISO(event.Event.EndDateTime)
        }))

      this.drawTimeline()
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
      const x = Math.max(0, Math.min(event.clientX - rect.left, 800))

      const totalSeconds = (this.endTime - this.startTime) / 1000
      const secondsPerPixel = totalSeconds / 800
      const selectedSeconds = x * secondsPerPixel
      this.selectedTime = addSeconds(this.startTime, selectedSeconds)

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
      const canvas = this.$refs.timelineCanvas
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, 800, 100)
      ctx.fillStyle = '#eaeaea'
      ctx.fillRect(0, 0, 800, 100)

      ctx.strokeStyle = '#555'
      ctx.lineWidth = 1

      const totalSeconds = (this.endTime - this.startTime) / 1000
      const secondsPerPixel = totalSeconds / 800

      for (let x = 0; x <= 800; x += 50) {
        const timeAtMarker = new Date(this.startTime.getTime() + x * secondsPerPixel * 1000)
        const timeLabel = timeAtMarker.toTimeString().split(' ')[0].substring(0, 5)

        ctx.beginPath()
        ctx.moveTo(x, 80)
        ctx.lineTo(x, 100)
        ctx.stroke()

        ctx.fillStyle = '#000'
        ctx.font = '10px Arial'
        ctx.fillText(timeLabel, x + 2, 75)
      }

      this.eventMarkers.forEach((event) => {
        const eventStartPosition = (event.start - this.startTime) / 1000 / secondsPerPixel
        const eventEndPosition = (event.end - this.startTime) / 1000 / secondsPerPixel

        ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'
        ctx.fillRect(eventStartPosition, 0, eventEndPosition - eventStartPosition, 100)
      })

      ctx.strokeStyle = 'red'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(this.currentMarkerPosition, 0)
      ctx.lineTo(this.currentMarkerPosition, 100)
      ctx.stroke()
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

canvas {
  display: block;
  cursor: pointer;
  border: 1px solid #ccc;
}
</style>
