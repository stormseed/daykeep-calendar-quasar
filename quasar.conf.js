// Configuration for your app
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = function (ctx) {
  return {
    boot: [],
    plugins: [],
    sourceFiles: {
      rootComponent: 'demo/App.vue',
      router: 'demo/router/index.js',
      // store: 'src/store/index.js',
      indexHtmlTemplate: 'demo/index.template.html',
    },
    css: [
      'app.styl'
      // 'component/calendar/styles-common/app.styl',
      // 'component/calendar/styles-common/calendar.vars.styl'
    ],
    animations: 'all',
    extras: [
      'roboto-font',
      'material-icons' // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5',
      // 'eva-icons'
    ],
    // framework: 'all', // --- includes everything; for dev only!
    framework: {},
    supportIE: false,
    build: {
      publicPath: '/quasar-calendar',
      distDir: 'docs',
      scopeHoisting: true,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          src: path.resolve(__dirname, './demo'),
          components: path.resolve(__dirname, './component'),
          layouts: path.resolve(__dirname, './demo/layouts'),
          pages: path.resolve(__dirname, './demo/pages'),
          assets: path.resolve(__dirname, './demo/assets'),
          boot: path.resolve(__dirname, './demo/boot')
        }
        cfg.plugins.push(
          new CopyPlugin([
            { from: 'demo/statics', to: 'statics' }
          ])
        )
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
        theme_color: '#027be3'
      }
    }
  }
}
