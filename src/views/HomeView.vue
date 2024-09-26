<template>
  <main>teste</main>
</template>

<script>
import axios from 'axios'

export default {
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
            user: 'admin',
            pass: 'admin'
          })
        )

        console.log(response.data)
      } catch (error) {
        console.error('Erro na API do ZoneMinder', error)
        console.log(url)
      }
    }
  },
  async mounted() {
    await this.zoneMinderRequest()
  }
}
</script>
