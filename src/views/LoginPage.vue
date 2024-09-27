<template>
<main class="flex justify-center items-center min-h-screen bg-black">
    <div class="border-2 border-green-500 p-6 rounded-lg bg-gray-800">
      <div class="mb-4">
        <label for="usernameInput" class="block text-white">Username</label>
        <input type="text" id="usernameInput" v-model="username" class="border p-2 w-full bg-gray-700 text-white" />
      </div>

      <div class="mb-4">
        <label for="passwordInput" class="block text-white">Password</label>
        <input type="password" id="passwordInput" v-model="password" class="border p-2 w-full bg-gray-700 text-white" />
      </div>

      <button type="button" id="button-login" @click="executeLogin" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Enviar</button>
      <div v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</div>
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    ...mapActions(['login']),
    async executeLogin() {
      try {
        const loginData = { user: this.username, pass: this.password }
        await this.login(loginData)
        this.$router.push('/home')
      } catch (error) {
        this.errorMessage = 'Login falhou. Verifique suas credenciais.'
      }
    }
  }
}
</script>
