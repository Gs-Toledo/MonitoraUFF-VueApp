<template>
  <base-user-authenticated>
    <div v-if="isLoading">Carregando...</div>
    <div v-if="!isLoading" class="flex">
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
    </div>
  </base-user-authenticated>
</template>

<script>
import BaseUserAuthenticated from '@/components/BaseUserAuthenticated.vue'
import ZoneminderService from '@/services/zoneminderService'
import { generateStreamUrl } from '@/utils/monitorUtils'
export default {
  props: ['id'],
  components: {
    BaseUserAuthenticated
  },
  data() {
    return {
      monitor: {},
      isLoading: true
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
    generateStreamUrl
  },
  async mounted() {
    await this.getAndShowMonitorFromId()
  }
}
</script>
