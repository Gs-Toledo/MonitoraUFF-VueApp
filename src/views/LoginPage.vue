<template>
  <div>
    <v-img class="mx-auto my-6" max-width="228" src="/img/uff-logo.png"></v-img>

    <v-card
      class="mx-auto pa-12 pb-8 bg-[rgba(29,29,29,0.4)] shadow-lg backdrop-blur-md text-white"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis text-white">Login</div>
      <v-form @submit.prevent="executeLogin" @keyup.enter="executeLogin">
        <v-text-field
          density="compact"
          placeholder="Insira o Login"
          prepend-inner-icon="mdi-email-outline"
          v-model="username"
          variant="outlined"
          theme="dark"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Senha

          <!--    <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
          Esqueceu a senha?</a> -->
        </div>

        <v-text-field
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="isPasswordVisible ? 'text' : 'password'"
          density="compact"
          placeholder="Insira a senha"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          v-model="password"
          theme="dark"
        ></v-text-field>

        <v-btn
          block
          class="mb-8"
          color=""
          size="large"
          variant="tonal"
          :disabled="isSendingRequest"
          @click="executeLogin"
          theme="dark"
        >
          Entrar
        </v-btn>
      </v-form>
      <!-- <v-card-text class="text-center">
        <a
          class="text-blue text-decoration-none"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Cadastre-se <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text> -->
      <div v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</div>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      isSendingRequest: false,
      isPasswordVisible: false
    }
  },
  methods: {
    ...mapActions(['login']),
    async executeLogin() {
      this.isSendingRequest = true
      try {
        const loginData = { user: this.username, pass: this.password }
        await this.login(loginData)
        this.$router.push('/home')
      } catch (error) {
        console.log(error)
        this.errorMessage = 'Login falhou. Verifique suas credenciais.'
      } finally {
        this.isSendingRequest = false
      }
    }
  }
}
</script>
