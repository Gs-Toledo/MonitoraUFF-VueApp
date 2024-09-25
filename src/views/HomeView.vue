<template>
  <main>
    teste
  </main>
</template>

<script>
import axios from 'axios'
export default {
  methods: {
    async zoneMinderRequest() {
      let ip = '192.168.1.107'
      let port = '88'
       let url = `http://${ip}:${port}/zm/api/host/login.json?user=admin&pass=admin`
      //let url = '/zm/api/host/login.json?user=admin&pass=admin'

      try {
        let response = await axios.post(url)
  
        console.log(response)
      } catch (error) {
        console.error('erro na api do zoneminder', error)
        console.log(url)
      }
    }
  },
  async mounted() {
    await this.zoneMinderRequest()
  }
}
</script>
