import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  // presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [
        './**/*.vue',
        './**/*.ts',
        // './**/*.js',
      ],
    },
  },
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-mantis-700 text-white cursor-pointer !outline-none hover:bg-mantis-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
  ],
  // background: linear-gradient(92.78deg, #48F477 -13.54%, #9654D7 10.82%, #DA2AC7 35.55%, #E85B7B 63.89%, #FFDD00 82.89%);

  theme: {
    colors: {
      // black: '#0C0D0E',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose m-auto text-left'.split(' '),
})
