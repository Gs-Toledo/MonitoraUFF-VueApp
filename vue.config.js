
module.exports = {
    devServer: {
      proxy: {
        '/zm': {
          target: 'https://192.168.1.107:88', // nootebook com o zoneminder, porta 88
          changeOrigin: true
        }
      }
    }
  }