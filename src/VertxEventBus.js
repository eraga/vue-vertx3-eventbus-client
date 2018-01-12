import EventBus from 'vertx3-eventbus-client'

// noinspection JSUnusedGlobalSymbols
export default {
  install (Vue, config) {
    config = config || {}
    config.schema = config.schema || window.location.protocol
    config.host = config.host || window.location.hostname
    config.port = config.port || window.location.port
    config.path = config.path || ''
    config.options = config.options || {}

    let address = window.location.protocol + '//' + config.host + ':' + config.port + config.path

    let eb = new EventBus(address, config.options)
    // noinspection JSUnusedGlobalSymbols
    Vue.prototype.$eventBus = eb

    eb.onclose = function () {
      console.log('eb closed!!!')
      handlersToReg = []
      handlersToUnReg = []
    }

    /**
     * Directives
     */

    /**
     * v-eb-handler:address.data="tableData"
     * v-eb-handler:address.method="ebCallback"
     * v-eb-handler:address="{headers:{}, data: tableData, method: ebCallback}"
     */
    // Vue.directive('eb-handler', {
    //   bind (el, binding, vnode, oldVnode) {
    //     if (binding.modifiers.data && binding.modifiers.method) {
    //       throw new TypeError('can`t have both data and method binding.modifiers', binding.modifiers)
    //     }
    //
    //     let handler = {}
    //
    //     handler.address = binding.arg
    //
    //     console.log(vnode.context.$options)
    //     if (binding.modifiers.data) {
    //       console.log('data', binding.value)
    //     } else if (binding.modifiers.method) {
    //       console.log('meth', binding.value)
    //     } else {
    //       console.log('json', binding.value, binding.expression)
    //     }
    //
    //     handler.headers = binding.expression
    //     handler.callback = binding.modifiers[0]
    //     console.log(handler, binding.modifiers)
    //     eb.registerHandler(handler.address, handler.headers, handler.callback)
    //   },
    //   unbind (el, binding, vnode, oldVnode) {
    //     //
    //   },
    // })

    /**
     * Mixin methods
     */

    let hooks = []
    let handlersToReg = []
    let handlersToUnReg = []

    let regHandlers = function (handler) {
      eb.registerHandler(handler.address, handler.headers, handler.callback)
    }

    let unRegHandlers = function (handler) {
      eb.unregisterHandler(handler.address, handler.headers, handler.callback)
    }

    let ebOnOpen = function () {
      hooks.forEach((hook) => {
        hook.hook(hook.context, eb)
      })

      handlersToReg.forEach(regHandlers)

      handlersToUnReg.forEach(unRegHandlers)
    }

    function safeExecuteHook (hook, context) {
      if (eb.state === EventBus.OPEN) {
        hook(context, eb)
      } else {
        hooks.push({
          hook: hook,
          context: context,
        })
        eb.onopen = ebOnOpen
      }
    }

    let addHandlers = function (context) {
      if (!context.$options['eventbus'].handlers) {
        return
      }
      let handlers = context.$options['eventbus'].handlers

      if (eb.state === EventBus.OPEN) {
        handlers.forEach(regHandlers)
      } else {
        handlersToReg.concat(handlers)
        eb.onopen = ebOnOpen
      }
    }

    let removeHandlers = function (context) {
      if (!context.$options['eventbus'].handlers) {
        return
      }
      let handlers = context.$options['eventbus'].handlers

      if (eb.state === EventBus.OPEN) {
        handlers.forEach(unRegHandlers)
      } else {
        handlersToUnReg.concat(handlers)
        eb.onopen = ebOnOpen
      }
    }

    let runLifecicleHook = function (context, hookName) {
      if (!context.$options['eventbus'].lifecycleHooks) {
        return
      }

      if (context.$options['eventbus'].lifecycleHooks[hookName]) {
        safeExecuteHook(context.$options['eventbus'].lifecycleHooks[hookName], context)
      }
    }

    let beforeCreate = function () {
      if (!this.$options['eventbus']) {
        return
      }

      runLifecicleHook(this, 'beforeCreate')
      addHandlers(this)
    }

    let created = function () {
      if (!this.$options['eventbus']) {
        return
      }

      runLifecicleHook(this, 'created')
    }

    let beforeMount = function () {
      if (!this.$options['eventbus']) {
        return
      }

      runLifecicleHook(this, 'beforeMount')
    }

    let mounted = function () {
      if (!this.$options['eventbus']) {
        return
      }

      runLifecicleHook(this, 'mounted')
    }

    let beforeUpdate = function () {
      if (!this.$options['eventbus']) {
        return
      }

      runLifecicleHook(this, 'beforeUpdate')
    }

    let updated = function () {
      if (!this.$options['eventbus']) {
        return
      }

      runLifecicleHook(this, 'updated')
    }

    let beforeDestroy = function () {
      if (!this.$options['eventbus']) {
        return
      }

      runLifecicleHook(this, 'beforeDestroy')

      removeHandlers(this)
    }
    let destroyed = function () {
      if (!this.$options['eventbus']) {
        return
      }

      runLifecicleHook(this, 'destroyed')
    }

    Vue.mixin({
      beforeCreate: beforeCreate,
      created: created,
      beforeMount: beforeMount,
      mounted: mounted,
      beforeUpdate: beforeUpdate,
      updated: updated,
      beforeDestroy: beforeDestroy,
      destroyed: destroyed,
    })
  },
}
