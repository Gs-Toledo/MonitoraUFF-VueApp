import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css';



export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: false,
        colors: {
          background: '#0F315C',
          surface: '#1D1D1D',
          primary: '#215CAA',
          'on-primary': '#FFFFFF',
        },
      },
    },
  },
});