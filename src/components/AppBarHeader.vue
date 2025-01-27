<template>
  <v-app-bar :elevation="2" class="bg-white shadow-md">
    <template v-slot:prepend>
      <v-app-bar-nav-icon>
        <v-icon icon="mdi-menu" @click="toggleDrawer"></v-icon>
      </v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>
      <router-link to="/home" class="text-gray-800">Monitora Uff</router-link>
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-dots-vertical"></v-btn>
      <v-btn icon="mdi-logout" @click="openLogoutModal"></v-btn>
    </template>

    <modal-logout
      :visible="showLogoutModal"
      @update:visible="showLogoutModal = $event"
      @confirm="handleLogout"
    />
  </v-app-bar>

  <sidebar-user v-model="drawer" />
</template>

<script>
import ModalLogout from './ModalLogout.vue'
import SidebarUser from './SidebarUser.vue'
import router from '@/router'
import { mapActions } from 'vuex'

export default {
  components: { ModalLogout, SidebarUser },
  data() {
    return {
      drawer: false,
      showLogoutModal: false
    }
  },
  methods: {
    ...mapActions(['logout']),
    openLogoutModal() {
      this.showLogoutModal = true
    },
    toggleDrawer() {
      this.drawer = !this.drawer
    },
    handleLogout() {
      console.log('Deslogando usuário...')
      this.logout(router)
      this.showLogoutModal = false
    }
  }
}
</script>
