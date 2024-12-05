/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-require-imports */
;(window as any).global = window
global.process = require('process')
if (typeof globalThis === 'undefined') {
  ;(window as any).globalThis = window
}
