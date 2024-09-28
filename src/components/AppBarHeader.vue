<template>
<v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon>
          <v-icon icon="mdi-menu"></v-icon>
        </v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>Monitora Uff</v-app-bar-title>
      <template v-slot:append>
        <v-btn icon="mdi-dots-vertical"></v-btn>
        <v-btn icon="mdi-logout" @click="userlogout"></v-btn>
      </template>
    </v-app-bar>
</template>


<script>
export default {
    methods: {
        userlogout() {
            console.log('deslogando...')
        }
    }
}
</script>