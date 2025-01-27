<template>
    <base-user-authenticated>
      <timeline-bar />
      <monitors-home />
    </base-user-authenticated>
  </template>
  
  <script>
  import BaseUserAuthenticated from '@/components/BaseUserAuthenticated.vue'
  import MonitorsHome from '@/components/MonitorsHome.vue'
  import TimelineBar from '@/components/TimelineBar.vue'
  
  export default {
    components: {
      BaseUserAuthenticated,
      MonitorsHome,
      TimelineBar
    }
  }
  </script>
  