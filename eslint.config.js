import antfu from '@antfu/eslint-config'
import checkFile from 'eslint-plugin-check-file'

export default antfu({
  unocss: true,
  plugins: {
    'check-file': checkFile,
  },
  ignorePatterns: [
    'public/**/*',
  ],
  rules: {
    'eslint-comments/no-unlimited-disable': 'off',
    'arrow-body-style': ['error', 'as-needed'],
    'prefer-arrow-callback': ['error'],
    'antfu/top-level-function': 'off',
    'func-style': ['error', 'expression'],
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'node/prefer-global/process': 'off',
    'vue/attributes-order': ['error', {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        ['UNIQUE', 'SLOT'],
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'OTHER_ATTR',
        'EVENTS',
        'CONTENT',
      ],
      alphabetical: false,
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 1,
      },
      multiline: {
        max: 1,
      },
    }],
    'vue/html-self-closing': ['error', {
      html: {
        void: 'never',
        normal: 'always',
        component: 'always',
      },
      svg: 'always',
      math: 'always',
    }],
    'vue/html-indent': [
      'error',
      4,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      },
    ],
    // 'vue/component-name-in-template-casing': ['error', 'kebab-case', {
    //   registeredComponentsOnly: true,
    // }],
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        registeredComponentsOnly: false,
      },
    ],

    'vue/no-irregular-whitespace': ['error', {
      skipStrings: true,
      skipComments: false,
      skipRegExps: false,
      skipTemplates: false,
      skipHTMLAttributeValues: false,
      skipHTMLTextContents: false,
    }],
    // 'comma-dangle': ['error', {
    //   arrays: 'never',
    //   objects: 'never',
    //   imports: 'never',
    //   exports: 'never',
    //   functions: 'never'
    // }],
    'linebreak-style': ['error', 'unix'],
    'no-console': 'error',
    'no-debugger': 'error',
    'no-plusplus': 'off',
    'constructor-super': 'off',
    'no-mixed-operators': [
      'error',
      {
        groups: [
          ['+', '-', '*', '/', '%', '**'],
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
        allowSamePrecedence: true,
      },
    ],
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'no-unused-expressions': 'error',
    'no-param-reassign': 'off',
    'prefer-destructuring': ['error', {
      array: true,
      object: true,
    }, {
      enforceForRenamedProperties: false,
    }],
    'no-bitwise': ['error', { allow: ['~'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'max-len': ['error', { code: 320 }],
    'object-curly-newline': ['error', {
      ObjectExpression: { multiline: true, consistent: true },
      ObjectPattern: { multiline: true, consistent: true },
    }],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'check-file/folder-naming-convention': [
      'error',
      {
        '**/*.{ts,vue}': 'KEBAB_CASE',
      },
    ],
    'check-file/filename-naming-convention': [
      'error',
      {
        '**/!(*.config).{js,ts,vue}': 'KEBAB_CASE',
      },
    ],
  },
})
