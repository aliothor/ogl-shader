import { defineConfig } from '@farmfe/core'

export default defineConfig({
  compilation: {
    input: {
      index: './template/index.html',
      main: './template/main.html',
      base: './template/base.html',
      texture: './template/texture.html',
    },
    output:{
      publicPath:"/ogl-shader/"
    },
    sourcemap: false,
    presetEnv: false,
  },
})
