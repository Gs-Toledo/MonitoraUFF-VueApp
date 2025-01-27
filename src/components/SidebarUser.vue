<template>
  <v-navigation-drawer v-model="value" app class="bg-gray-100" permanent clipped>
    <v-list>
      <v-list-item-group>
        <v-list-item
          v-for="(item, index) in navigationItems"
          :key="index"
          @click="navigateTo(item.route)"
          class="hover:bg-gray-200"
        >
          
            <v-icon :icon="item.icon"></v-icon>
         
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
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
        { title: 'Monitores', icon: 'mdi-monitor', route: '/monitor' }
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
