<template>
  <base-user-authenticated> Monitor {{ id }} </base-user-authenticated>
</template>

<script>
import BaseUserAuthenticated from '@/components/BaseUserAuthenticated.vue'
export default {
  props: ['id'],
  components: {
    BaseUserAuthenticated
  }
}
</script>
