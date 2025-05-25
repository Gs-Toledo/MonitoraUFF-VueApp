<template>
  <v-navigation-drawer v-model="value" app class=" !bg-[#1A375B]" permanent clipped>
    <v-list>
      <v-list-item
        v-for="(item, index) in navigationItems"
        :key="index"
        @click="navigateTo(item.route)"
        
        
      >
        <v-icon :icon="item.icon"></v-icon>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  data() {
    return {
      navigationItems: [
        { title: 'Home', icon: 'mdi-home', route: '/home' },
        { title: 'Câmeras', icon: 'mdi-monitor', route: '/cameras' },
        { title: 'Filtro de Gravações', icon: 'mdi-film', route: '/filtro-gravacoes' }
      ]
    }
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route)
      this.$emit('update:modelValue', false)
    }
  }
}
</script>
