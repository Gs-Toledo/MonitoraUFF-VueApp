<template>
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

export default {
  data() {
    return {
      canvasWidth: 896,
      canvasHeight: 94,
      dragging: false,
      scrubOutputPosition: 275,
      startTime: new Date('2024-12-09T14:50:25'),
      endTime: new Date('2024-12-20T10:15:25'),
      selectedTime: new Date('2024-12-09T14:59:25'),
      currentMarkerPosition: 0
    }
  },
  methods: {
    formatTime(date) {
      return date.toISOString().replace('T', ' ').split('.')[0]
    },
    formatToBrazilDate,
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

      const totalSeconds = (this.endTime.getTime() - this.startTime.getTime()) / 1000
      const secondsPerPixel = totalSeconds / this.canvasWidth

      const selectedSeconds = x * secondsPerPixel
      this.selectedTime = new Date(this.startTime.getTime() + selectedSeconds * 1000)
      this.scrubOutputPosition = Math.max(5, Math.min(x - 50, this.canvasWidth - 160))

      this.currentMarkerPosition = Math.max(0, Math.min(x, this.canvasWidth))

      this.$emit('update-dates', {
        startDate: this.selectedTime,
        endDate: this.endTime
      })

      this.drawTimeline()
    },
    startClock() {
      setInterval(() => {
        // Increment times
        this.startTime = new Date(this.startTime.getTime() + 1000)
        this.endTime = new Date(this.endTime.getTime() + 1000)
        this.selectedTime = new Date(this.selectedTime.getTime() + 1000)

        // Update marker position
        const totalSeconds = (this.endTime.getTime() - this.startTime.getTime()) / 1000
        const secondsPerPixel = totalSeconds / this.canvasWidth

        const elapsedSeconds = (this.selectedTime.getTime() - this.startTime.getTime()) / 1000
        this.currentMarkerPosition = elapsedSeconds / secondsPerPixel

        // Redraw timeline
        this.drawTimeline()
      }, 1000)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.drawTimeline()
      /* this.startClock() */
    })
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
