<template>
  <main>
    <div>
      <div>
        <label for="usernameInput">Username</label>
        <input type="text" id="usernameInput" v-model="username" />
      </div>

      <div>
        <label for="passwordInput">Password</label>
        <input type="password" id="passwordInput" v-model="password" />
      </div>

      <button type="button" id="button-login" @click="executeLogin">Enviar</button>
      <div v-if="errorMessage">{{ errorMessage }}</div>
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
        console.log(loginData)
        await this.login(loginData)
        this.$router.push('/home')
      } catch (error) {
        this.errorMessage = 'Login falhou. Verifique suas credenciais.'
      }
    }
  }
}
</script>
