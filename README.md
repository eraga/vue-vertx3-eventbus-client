# vue-vertx3-eventbus-client [![NPM version](https://img.shields.io/npm/v/vue-vertx3-eventbus-client.svg)](https://www.npmjs.com/package/vue-vertx3-eventbus-client)
![VueJS v2.x compatible](https://img.shields.io/badge/vue%202.x-compatible-green.svg)

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
It is possible to pass `vertx3-eventbus-client` options too:
```js
Vue.use(VertxEventBus, {
    host: 'www.example.com',
    path: '/eventbus',
    options: {
      opt: ''
    }
  })
```


Use it in your components:
```html
<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        tableData: []
      }
    },
    methods: {
    },
    eventbus: {
      data (self) {
        let headers = {
          action: 'fetchAllPages'
        }

        let payload = {}

        self.$eventBus.send('eventbus.address', payload, headers, function (err, reply) {
          if (err) {
            console.error('Failed to get list of initiatives', err)
            return
          }
          // console.log(reply)
          self.tableData = reply.body
        })
      },
      // Array of message handler objects
      handlers: [
        {
          address: 'eventbus.address',
          headers: {},
          callback: function (error, message) {
            if (error) {
              console.error(error)
            }
          }
        }
      ]
    }
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