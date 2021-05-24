import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// QRcode gnerator
import VueQRCodeComponent from 'vue-qrcode-component'
Vue.component('qr-code', VueQRCodeComponent)

// barcode generator
import VueBarcode from 'vue-barcode'
Vue.component('barcode', VueBarcode)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
