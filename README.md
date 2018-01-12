# vue-vertx3-eventbus-client [![NPM version](https://img.shields.io/npm/v/vue-vertx3-eventbus-client.svg)](https://www.npmjs.com/package/vue-vertx3-eventbus-client)
![VueJS v2.x compatible](https://img.shields.io/badge/vue%202.x-compatible-green.svg) ![VertX v3.5 compatible](https://img.shields.io/badge/VertX%203.5-compatible-green.svg)

Vertx 3.5 EventBus plugin for VueJS that wraps official [vertx3-eventbus-client@3.5.0](https://www.npmjs.com/package/vertx3-eventbus-client).


## Install
### NPM
You can install it via [NPM](http://npmjs.org/).
```
$ npm install vue-vertx3-eventbus-client
```
### Manual
Download zip package and unpack and add the `vue-vertx3-eventbus-client.js` file to your project from dist folder.
```
https://github.com/eraga/vue-vertx3-eventbus-client/archive/master.zip
```

## Usage
Register the plugin, it will connect to `/`
```js
import VertxEventBus from 'vue-vertx3-eventbus-client'
Vue.use(VertxEventBus, { path: '/eventbus', port: 8082 })
```
or connect to other address:
```js
Vue.use(VertxEventBus, {
    host: 'www.example.com',
    path: '/eventbus'
  })
```
It is possible to pass `vertx3-eventbus-client` and `SockJS` options too:
```js
Vue.use(VertxEventBus, {
  path: '/eventbus',
  port: 8082,
  options: {
    transports: [ // whitelist "long polling" and "websocket" Sock JS transports
      'xhr-polling',
      'websocket',
    ],
  },
})
```


Use it in your components with configuration at `eventbus` section:
```html
<script>
  export default {
    name: 'Hello Vertx EventBus',
    data () {
      return {
        tableData: []
      }
    },
    methods: {
    },
    eventbus: {
      lifecycleHooks: {
        created (context, eventbus) {

          let header = {
            action: 'fetchAllPages',
          }
          
          let payload = {}

          eventbus.send('pages.db.queue', payload, header, function (err, reply) {
            if (err) {
              console.error('Failed to get list of pages', err)
              return
            }
            
            context.tableData = reply.body
          })
        },
      },
      handlers: [
        {
          address: 'page.saved',
          headers: {},
          callback: function () {
            // execute something upon receipt 
          },
        },
      ],
    },
  }
</script>
```

`lifecycleHooks` are executed together with corresponding Vue hooks: `created`, `mounted`, etc.
Put your `handler` objects to `handlers` section. They will be registered at `beforeCreate` and unregistered at `beforeDestroy`.


EventBusClient object can be reached with `this.$eventBus`:
```html
<script>
export default {
    name: 'Hello Vertx EventBus',
    data () {
      return {
        form: {}, // object contaning form fields
        saving: false //saving indicator 
      }
    },
    methods: {
      formSubmit () {
        
        let header = {action: 'savePage'}
        if (!this.$route.params.id) {
          header.action = 'createPage'
        }
        this.saving = true

        let body = JSON.parse(JSON.stringify(this.form))

        let context = this
        this.$eventBus.send('pages.db.queue', body, header, function (err, reply) {
          if (err) {
            console.error('Failed to save page', err)
            context.saving = false
            return
          }
          context.saving = false
        })
      }
    },
}
</script>
```

## Build
This command will build a distributable version in the `dist` directory.
```bash
npm run build
```

## Contribution
Pull requests improving the usage and fixing bugs are welcome!

## Contact

Copyleft © 2018 eRaga Infosystems and @tntclaus

[![@eraga](https://img.shields.io/badge/github-eraga-blue.svg)](https://github.com/eraga) [![@eraga](https://img.shields.io/badge/www-eraga.net-orange.svg)](https://www.eraga.net/)