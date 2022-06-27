import masker from './masker'
import tokens from './tokens'

// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#The_old-fashioned_way
function event (name) {
  return new Event(name);
}

export default function (el, binding) {
  var config = binding.value
  if (Array.isArray(config) || typeof config === 'string') {
    config = {
      mask: config,
      tokens: tokens
    }
  }

  if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
    el = el.querySelector('input:not([type=hidden])')
    if (!el) {
      throw new Error("v-mask directive requires an input")
    }
  }

  el.oninput = function (evt) {
    if (!evt.isTrusted) return // avoid infinite loop
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
   if (['deleteContentBackward', 'deleteContentForward'].includes(evt.inputType)) return
   
    // by default, keep cursor at same position as before the mask
    var position = el.selectionEnd
    // save the character just inserted
    var digit = el.value[position-1]
    el.value = masker(el.value, config.mask, true, config.tokens)
    // if the digit was changed, increment position until find the digit again
    while (position < el.value.length && el.value.charAt(position-1) !== digit) {
      position++
    }
    if (el === document.activeElement) {
      el.setSelectionRange(position, position)
      setTimeout(function () {
        el.setSelectionRange(position, position)
      }, 0)
    }
    el.dispatchEvent(event('input'))
  }

  var newDisplay = masker(el.value, config.mask, true, config.tokens)
  if (newDisplay !== el.value) {
    el.value = newDisplay
    el.dispatchEvent(event('input'))
  }
}
