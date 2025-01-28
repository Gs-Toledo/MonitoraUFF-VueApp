<template>
  <base-user-authenticated>
    <monitors-home />
  </base-user-authenticated>
</template>

<script>
import BaseUserAuthenticated from '@/components/BaseUserAuthenticated.vue'
import MonitorsHome from '@/components/MonitorsHome.vue'

export default {
  components: {
    BaseUserAuthenticated,
    MonitorsHome
  }
}
</script>
