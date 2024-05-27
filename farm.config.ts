import { defineConfig } from '@farmfe/core'

export default defineConfig({
  compilation: {
    input: {
      index: './template/index.html',
      main: './template/main.html',
      base: './template/base.html',
      texture: './template/texture.html',
    },
    sourcemap: false,
    presetEnv: false,
  },
})
