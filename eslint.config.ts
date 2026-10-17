import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  {
    name: 'app/fsd-public-api',
    files: ['src/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@/(pages|widgets|features|entities)/[^/]+/.+',
              message: 'Імпортуйте слайс тільки через його Public API (index.ts).',
            },
            {
              regex: '^@/shared/[^/]+/.+',
              message: 'Імпортуйте з shared тільки через Public API сегмента (index.ts).',
            },
            {
              regex: '^@/app(/|$)',
              message: 'Шар app не можна імпортувати з інших шарів.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'ImportExpression[source.value=/^@\\/(pages|widgets|features|entities)\\/[^/]+\\/.+/]',
          message: 'Імпортуйте слайс тільки через його Public API (index.ts).',
        },
      ],
    },
  },

  skipFormatting,
)
