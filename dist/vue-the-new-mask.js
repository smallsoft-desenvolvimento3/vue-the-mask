/*!
 * vue-the-new-mask v0.13.1
 * (c) Marcos Neves <marcos.neves@gmail.com> (https://vuejs-tips.github.io/)
 * Released under the MIT License.
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).VueTheNewMask={})}(this,(function(e){"use strict";var t={"#":{pattern:/\d/},X:{pattern:/[0-9a-zA-Z]/},S:{pattern:/[a-zA-Z]/},A:{pattern:/[a-zA-Z]/,transform:e=>e.toLocaleUpperCase()},a:{pattern:/[a-zA-Z]/,transform:e=>e.toLocaleLowerCase()},"!":{escape:!0}};function n(e,t,n=!0,s){e=e||"",t=t||"";for(var r=0,a="",i=0,o="";r<t.length&&i<e.length;){var u=s[a=t[r]],l=e[i];u&&!u.escape?(u.pattern.test(l)&&(o+=u.transform?u.transform(l):l,r++),i++):(u&&u.escape&&(a=t[++r]),n&&(o+=a),l===a&&i++,r++)}for(var d="";r<t.length&&n;){if(s[a=t[r]]){d="";break}d+=a,r++}return o+d}function s(e,t,s=!0,r){return Array.isArray(t)?function(e,t,n){return t=t.sort((e,t)=>e.length-t.length),function(s,r,a=!0){for(var i=0;i<t.length;){var o=t[i];i++;var u=t[i];if(!(u&&e(s,u,!0,n).length>o.length))return e(s,o,a,n)}return""}}(n,t,r)(e,t,s,r):n(e,t,s,r)}function r(e){return new Event(e)}let a;function i(e,n){var i=n.value;if((Array.isArray(i)||"string"==typeof i)&&(i={mask:i,tokens:t}),"INPUT"!==e.tagName.toLocaleUpperCase()&&!(e=e.querySelector("input:not([type=hidden])")))throw new Error("v-mask directive requires an input");if(e.oninput=function(t){if(t.isTrusted)try{if(["deleteContentBackward","deleteContentForward"].includes(t.inputType))return;var n=e.selectionEnd,a=e.value[n-1];for(e.value=s(e.value,i.mask,!0,i.tokens);n<e.value.length&&e.value.charAt(n-1)!==a;)n++;e===document.activeElement&&(e.setSelectionRange(n,n),setTimeout((function(){e.setSelectionRange(n,n)}),0))}finally{e.dispatchEvent(r("input"))}},!a){a=!0;var o=s(e.value,i.mask,!0,i.tokens);o!==e.value&&(e.value=o,e.dispatchEvent(r("input")))}}function o(e,t,n,s,r,a,i,o,u,l){"boolean"!=typeof i&&(u=o,o=i,i=!1);const d="function"==typeof n?n.options:n;let c;if(e&&e.render&&(d.render=e.render,d.staticRenderFns=e.staticRenderFns,d._compiled=!0,r&&(d.functional=!0)),s&&(d._scopeId=s),a?(c=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),t&&t.call(this,u(e)),e&&e._registeredComponents&&e._registeredComponents.add(a)},d._ssrRegister=c):t&&(c=i?function(e){t.call(this,l(e,this.$root.$options.shadowRoot))}:function(e){t.call(this,o(e))}),c)if(d.functional){const e=d.render;d.render=function(t,n){return c.call(n),e(t,n)}}else{const e=d.beforeCreate;d.beforeCreate=e?[].concat(e,c):[c]}return n}const u=o({render:function(){var e=this.$createElement;return(this._self._c||e)("input",{directives:[{name:"mask",rawName:"v-mask",value:this.config,expression:"config"}],attrs:{type:"text"},domProps:{value:this.display},on:{input:this.onInput}})},staticRenderFns:[]},void 0,{name:"TheMask",props:{value:[String,Number],mask:{type:[String,Array],required:!0},masked:{type:Boolean,default:!1},tokens:{type:Object,default:()=>t}},directives:{mask:i},data(){return{lastValue:null,display:this.value}},watch:{value(e){e!==this.lastValue&&(this.display=e)},masked(){this.refresh(this.display)}},computed:{config(){return{mask:this.mask,tokens:this.tokens,masked:this.masked}}},methods:{onInput(e){e.isTrusted||this.refresh(e.target.value)},refresh(e){this.display=e,(e=s(e,this.mask,this.masked,this.tokens))!==this.lastValue&&(this.lastValue=e,this.$emit("input",e))}}},void 0,!1,void 0,!1,void 0,void 0,void 0);function l(e){e.component(u.name,u),e.directive("mask",i)}"undefined"!=typeof window&&window.Vue&&window.Vue.use(l),e.TheMask=u,e.default=l,e.mask=i,e.tokens=t,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=index.umd.min.js.map
