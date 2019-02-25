// Configuration for your app

module.exports = function (ctx) {
  return {
    boot: [],
    plugins: [],
    css: [
      'app.styl'
    ],
    extras: [
      'roboto-font',
      'material-icons' // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5',
      // 'eva-icons'
    ],
    framework: 'all', // --- includes everything; for dev only!
    // framework: {
    //   components: [
    //     'QLayout',
    //     'QHeader',
    //     'QDrawer',
    //     'QPageContainer',
    //     'QPage',
    //     'QToolbar',
    //     'QToolbarTitle',
    //     'QBtn',
    //     'QIcon',
    //     'QList',
    //     'QItem',
    //     'QItemSection',
    //     'QItemLabel'
    //   ],
    //
    //   directives: [
    //     'Ripple'
    //   ],
    //
    //   // Quasar plugins
    //   plugins: [
    //     'Notify'
    //   ]
    //
    //   // iconSet: 'ionicons-v4'
    //   // lang: 'de' // Quasar language
    // },
    supportIE: false,
    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,

      // publicPath: '/quasar-calendar',
      // distDir: 'docs',

      // extendWebpack (cfg) {
      //   cfg.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules|quasar)/
      //   })
      // }
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        })
      }
    },
    devServer: {
      // https: true,
      port: 8084,
      open: false // opens browser window automatically
    },
    ssr: {
      pwa: false
    },
    pwa: {
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
      }
    }
  }
}
