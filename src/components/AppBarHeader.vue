<template>
  <v-app-bar :elevation="2" class="!bg-[#1A375B] shadow-md">
    <template v-slot:prepend>
      <v-app-bar-nav-icon>
        <v-icon icon="mdi-menu" @click="toggleDrawer"></v-icon>
      </v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>
      <router-link to="/home" class="">Monitora Uff</router-link>
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

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const ModalLogout = defineAsyncComponent({
  loader: () => import('./ModalLogout.vue'),
  timeout: 10000
})

const SidebarUser = defineAsyncComponent({
  loader: () => import('./SidebarUser.vue')
})

const drawer = ref(false)
const showLogoutModal = ref(false)

const store = useStore()
const router = useRouter()

function openLogoutModal() {
  showLogoutModal.value = true
}
function toggleDrawer() {
  drawer.value = !drawer.value
}
function handleLogout() {
  console.log('Deslogando usuário...')
  store.dispatch('logout', router)
  showLogoutModal.value = false
}
</script>
