<template>
  <main>
    <div>

      <div>
        <label for="usernameInput">Username</label>
        <input type="text" id="usernameInput" v-model="username">
      </div>

      <div>
        <label for="passwordInput">Password</label>
        <input type="text" id="passwordInput" v-model="password">
      </div>

      <button type="button" id="button-login" @click="zoneMinderRequest">Enviar</button>
      <div v-if="acessToken">
        Token de acesso: {{ acessToken }}
      </div>
    </div>

  </main>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      username:'',
      password: '',
      acessToken: ''
    }
  },
  methods: {
    async zoneMinderRequest() {
      /*  let ip = '192.168.1.107'; */
      /* let port = '88' */
      /*       let url = `http://localhost:${port}/api/host/login.json`;
       */
      let url = '/api/host/login.json'
      try {
        let response = await axios.post(
          url,
          new URLSearchParams({
            user: this.username,
            pass: this.password
          })
        )

        console.log(response.data)
        this.acessToken = response.data.access_token
      } catch (error) {
        console.error('Erro na API do ZoneMinder', error)
        console.log(url)
      }
    }
  },
}
</script>
