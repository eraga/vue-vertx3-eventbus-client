import EventBus from 'vertx3-eventbus-client'

export default {
  install (Vue, options) {
    options.host = options.host || window.location.protocol + '//' + window.location.hostname
    options.port = options.port || window.location.port
    options.path = options.path || ''
    options.options = options.options || {}

    let address = window.location.protocol + '//' + window.location.hostname + ':' + options.port + options.path

    let eb = new EventBus(address, options.ebOptions)
    Vue.prototype.$eventBus = eb

    function initComponentEventBus (context, dataInit, handlers) {
      dataInit(context)

      handlers.forEach(function (handler) {
        eb.registerHandler(handler.address, handler.headers, handler.callback)
        console.debug('registerHandler', handler.address)
      })
    }

    let addListeners = function () {
      if (!this.$options['eventbus']) { return }
      let dataInit = function () {}
      let handlers = []

      if (this.$options['eventbus'].data) {
        if (typeof this.$options['eventbus'].data !== 'function') {
          console.error('`data` must be function')
        }

        dataInit = this.$options['eventbus'].data
      }

      if (this.$options['eventbus'].handlers) {
        handlers = this.$options['eventbus'].handlers
      }

      let context = this

      if (eb.state === EventBus.OPEN) {
        initComponentEventBus(context, dataInit, handlers)
      } else {
        console.log(eb.state)
        eb.onopen = function () {
          initComponentEventBus(context, dataInit, handlers)
          eb.onopen = undefined
        }
      }
    }

    let removeListeners = function () {
      if (!this.$options['eventbus']) { return }
      if (!this.$options['eventbus'].handlers) { return }
      let handlers = this.$options['eventbus'].handlers
      if (eb.state === EventBus.OPEN) {
        handlers.forEach(function (handler) {
          console.debug('unregisterHandler', handler.address)
          eb.unregisterHandler(handler.address, handler.headers, handler.callback)
        })
      }
    }

    Vue.mixin({
      created: addListeners,
      beforeDestroy: removeListeners
    })
  }
}