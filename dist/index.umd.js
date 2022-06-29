/*!
 * vue-the-new-mask v0.13.0
 * (c) Marcos Neves <marcos.neves@gmail.com> (https://vuejs-tips.github.io/)
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueTheNewMask = {}));
})(this, (function (exports) { 'use strict';

  var tokens = {
    '#': {
      pattern: /\d/
    },
    X: {
      pattern: /[0-9a-zA-Z]/
    },
    S: {
      pattern: /[a-zA-Z]/
    },
    A: {
      pattern: /[a-zA-Z]/,
      transform: v => v.toLocaleUpperCase()
    },
    a: {
      pattern: /[a-zA-Z]/,
      transform: v => v.toLocaleLowerCase()
    },
    '!': {
      escape: true
    }
  }; // https://github.com/fernandofleury/vanilla-masker/blob/master/lib/vanilla-masker.js
  // DIGIT = "9",
  // ALPHA = "A",
  // ALPHANUM = "S"
  // https://github.com/niksmr/vue-masked-input
  // 1 - number
  // a - letter
  // A - letter, forced to upper case when entered
  // * - alphanumeric
  // # - alphanumeric, forced to upper case when entered
  // + - any character
  // https://github.com/probil/v-mask
  // #	Number (0-9)
  // A	Letter in any case (a-z,A-Z)
  // N	Number or letter
  // X	Any symbol
  // https://github.com/igorescobar/jQuery-Mask-Plugin/blob/master/src/jquery.mask.js#L518
  // '0': {pattern: /\d/},
  // '9': {pattern: /\d/, optional: true},
  // '#': {pattern: /\d/, recursive: true},
  // 'A': {pattern: /[a-zA-Z0-9]/},
  // 'S': {pattern: /[a-zA-Z]/}
  // https://github.com/the-darc/string-mask
  // 0	Any numbers
  // 9	Any numbers (Optional)
  // #	Any numbers (recursive)
  // A	Any alphanumeric character
  // a	Any alphanumeric character (Optional) Not implemented yet
  // S	Any letter
  // U	Any letter (All lower case character will be mapped to uppercase)
  // L	Any letter (All upper case character will be mapped to lowercase)
  // $	Escape character, used to escape any of the special formatting characters.

  function maskit(value, mask, masked = true, tokens) {
    value = value || '';
    mask = mask || '';
    var iMask = 0;
    var cMask = '';
    var iValue = 0;
    var output = '';

    while (iMask < mask.length && iValue < value.length) {
      cMask = mask[iMask];
      var masker = tokens[cMask];
      var cValue = value[iValue];

      if (masker && !masker.escape) {
        if (masker.pattern.test(cValue)) {
          output += masker.transform ? masker.transform(cValue) : cValue;
          iMask++;
        }

        iValue++;
      } else {
        if (masker && masker.escape) {
          iMask++; // take the next mask char and treat it as char

          cMask = mask[iMask];
        }

        if (masked) output += cMask;
        if (cValue === cMask) iValue++; // user typed the same char

        iMask++;
      }
    } // fix mask that ends with a char: (#)


    var restOutput = '';

    while (iMask < mask.length && masked) {
      cMask = mask[iMask];

      if (tokens[cMask]) {
        restOutput = '';
        break;
      }

      restOutput += cMask;
      iMask++;
    }

    return output + restOutput;
  }

  function dynamicMask(maskit, masks, tokens) {
    masks = masks.sort((a, b) => a.length - b.length);
    return function (value, mask, masked = true) {
      var i = 0;

      while (i < masks.length) {
        var currentMask = masks[i];
        i++;
        var nextMask = masks[i];

        if (!(nextMask && maskit(value, nextMask, true, tokens).length > currentMask.length)) {
          return maskit(value, currentMask, masked, tokens);
        }
      }

      return ''; // empty masks
    };
  }

  function masker (value, mask, masked = true, tokens) {
    return Array.isArray(mask) ? dynamicMask(maskit, mask, tokens)(value, mask, masked, tokens) : maskit(value, mask, masked, tokens);
  }

  function event(name) {
    return new Event(name);
  }

  let didUpdate;
  function mask (el, binding) {
    var config = binding.value;

    if (Array.isArray(config) || typeof config === 'string') {
      config = {
        mask: config,
        tokens: tokens
      };
    }

    if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
      el = el.querySelector('input:not([type=hidden])');

      if (!el) {
        throw new Error("v-mask directive requires an input");
      }
    }

    el.oninput = function (evt) {
      if (!evt.isTrusted) return; // avoid infinite loop

      /* other properties to try to diferentiate InputEvent of Event (custom)
      InputEvent (native)
        cancelable: false
        isTrusted: true
         composed: true
        isComposing: false
        which: 0
       Event (custom)
        cancelable: true
        isTrusted: false
      */

      try {
        if (['deleteContentBackward', 'deleteContentForward'].includes(evt.inputType)) return; // by default, keep cursor at same position as before the mask

        var position = el.selectionEnd; // save the character just inserted

        var digit = el.value[position - 1];
        el.value = masker(el.value, config.mask, true, config.tokens); // if the digit was changed, increment position until find the digit again

        while (position < el.value.length && el.value.charAt(position - 1) !== digit) {
          position++;
        }

        if (el === document.activeElement) {
          el.setSelectionRange(position, position);
          setTimeout(function () {
            el.setSelectionRange(position, position);
          }, 0);
        }
      } finally {
        el.dispatchEvent(event('input'));
      }
    };

    if (didUpdate) return;
    didUpdate = true;
    var newDisplay = masker(el.value, config.mask, true, config.tokens);

    if (newDisplay !== el.value) {
      el.value = newDisplay;
      el.dispatchEvent(event('input'));
    }
  }

  //
  var script = {
    name: 'TheMask',
    props: {
      value: [String, Number],
      mask: {
        type: [String, Array],
        required: true
      },
      masked: {
        // by default emits the value unformatted, change to true to format with the mask
        type: Boolean,
        default: false // raw

      },
      tokens: {
        type: Object,
        default: () => tokens
      }
    },
    directives: {
      mask
    },

    data() {
      return {
        lastValue: null,
        // avoid unecessary emit when has no change
        display: this.value
      };
    },

    watch: {
      value(newValue) {
        if (newValue !== this.lastValue) {
          this.display = newValue;
        }
      },

      masked() {
        this.refresh(this.display);
      }

    },
    computed: {
      config() {
        return {
          mask: this.mask,
          tokens: this.tokens,
          masked: this.masked
        };
      }

    },
    methods: {
      onInput(e) {
        if (e.isTrusted) return; // ignore native event

        this.refresh(e.target.value);
      },

      refresh(value) {
        this.display = value;
        value = masker(value, this.mask, this.masked, this.tokens);

        if (value !== this.lastValue) {
          this.lastValue = value;
          this.$emit('input', value);
        }
      }

    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  /* script */
  const __vue_script__ = script;
  /* template */

  var __vue_render__ = function () {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', [_vm._v("\nasdsadas\n  "), _c('input', {
      directives: [{
        name: "mask",
        rawName: "v-mask",
        value: _vm.config,
        expression: "config"
      }],
      attrs: {
        "type": "text"
      },
      domProps: {
        "value": _vm.display
      },
      on: {
        "input": _vm.onInput
      }
    })]);
  };

  var __vue_staticRenderFns__ = [];
  /* style */

  const __vue_inject_styles__ = undefined;
  /* scoped */

  const __vue_scope_id__ = undefined;
  /* module identifier */

  const __vue_module_identifier__ = undefined;
  /* functional template */

  const __vue_is_functional_template__ = false;
  /* style inject */

  /* style inject SSR */

  /* style inject shadow dom */

  const __vue_component__ = /*#__PURE__*/normalizeComponent({
    render: __vue_render__,
    staticRenderFns: __vue_staticRenderFns__
  }, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

  function install(Vue) {
    Vue.component(__vue_component__.name, __vue_component__);
    Vue.directive('mask', mask);
  }

  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(install);
  }

  exports.TheMask = __vue_component__;
  exports["default"] = install;
  exports.mask = mask;
  exports.tokens = tokens;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
