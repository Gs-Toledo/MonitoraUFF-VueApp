<template>
  <div>
    <v-text-field
      label="Data Início"
      v-model="selectedDate"
      type="date"
      @update:modelValue="updateDate"
    ></v-text-field>
  </div>

  <div id="timelinediv" class="w-full overflow-x-auto" v-show="events.length > 0">
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
import { parseISO, startOfDay, endOfDay, isSameDay } from 'date-fns'

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
      canvasWidth: 896,
      canvasHeight: 94,
      dragging: false,
      scrubOutputPosition: 275,
      selectedDate: '2024-12-09',
      startTime: null,
      endTime: null,
      selectedTime: null,
      currentMarkerPosition: 0,
      eventMarkers: [],
      filtered: false, // Flag para controlar quando os eventos devem ser desenhados
    }
  },
  watch: {
    events: {
      immediate: false,
      handler(newEvents) {
        if (this.filtered && newEvents.length > 0) {
          this.processEvents();
        }
      }
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
      this.selectedTime = this.startTime 

      this.$emit('update-dates', {
        startDate: this.startTime,
        endDate: this.endTime,
        selectedDate: this.selectedTime
      })
    },

    applyFilter() {
      this.filtered = true;
      this.processEvents();
    },

    processEvents() {
      this.eventMarkers = this.events
        .filter(event => isSameDay(parseISO(event.Event.StartDateTime), this.startTime))
        .map(event => ({
          start: parseISO(event.Event.StartDateTime),
          end: parseISO(event.Event.EndDateTime)
        }));

      this.drawTimeline();
    },

    drawTimeline() {
      const canvas = this.$refs.timelineCanvas;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      ctx.fillStyle = '#eaeaea';
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1;

      const totalSeconds = (this.endTime.getTime() - this.startTime.getTime()) / 1000;
      const secondsPerPixel = totalSeconds / this.canvasWidth;

      for (let x = 0; x <= this.canvasWidth; x += 50) {
        const timeAtMarker = new Date(this.startTime.getTime() + x * secondsPerPixel * 1000);
        const timeLabel = this.formatTime(timeAtMarker).split(' ')[1];

        ctx.beginPath();
        ctx.moveTo(x, this.canvasHeight - 20);
        ctx.lineTo(x, this.canvasHeight);
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.fillText(timeLabel, x + 2, this.canvasHeight - 25);
      }

      this.eventMarkers.forEach(event => {
        const eventStartPosition = (event.start.getTime() - this.startTime.getTime()) / 1000 / secondsPerPixel;
        const eventEndPosition = (event.end.getTime() - this.startTime.getTime()) / 1000 / secondsPerPixel;

        ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
        ctx.fillRect(eventStartPosition, 0, eventEndPosition - eventStartPosition, this.canvasHeight);
      });

      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.currentMarkerPosition, 0);
      ctx.lineTo(this.currentMarkerPosition, this.canvasHeight);
      ctx.stroke();
    },
  },
  mounted() {
    this.updateDate(this.selectedDate);
  this.$nextTick(() => {
    this.processEvents()
    this.drawTimeline();
  });
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