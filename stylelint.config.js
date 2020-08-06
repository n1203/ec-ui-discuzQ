// https://stylelint.io/user-guide/get-started
// http://stylelint.cn/user-guide/rules/
module.exports = {
  defaultSeverity: 'error',
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    indentation: 2,
    // 不要使用已被 autoprefixer 支持的浏览器前缀
    'media-feature-name-no-vendor-prefix': true,
    'at-rule-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'comment-empty-line-before': null,
    'function-name-case': [
      'lower',
      {
        ignoreFunctions: ['/colorPalette/'],
      },
    ],
    'no-invalid-double-slash-comments': null,
    'no-descending-specificity': null,
    'declaration-empty-line-before': null,
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['upx', 'rpx'],
      },
    ],
    // SASS
    // All @includes after properties
    // Nested selectors after properties

    // Variables dash-dashed
    // This regexp matches:
    // $button-text-background-color--hover-hola
    // regex under construction
    // 'scss/dollar-variable-pattern': '\b[a-z]+(?:-)+(\b[a-z]+(?:-))*',

    // forbid extend
    'at-rule-blacklist': ['extend'],

    // Nesting depth
    'max-nesting-depth': 3,

    /* ==========================================================================
      Best practices
       ========================================================================== */
    // Specificity
    // https://gist.github.com/angelzou/dbd70b78242043f4d479f2a15fc0b341
    // To learn more about this:
    // http://csswizardry.com/2014/07/hacks-for-dealing-with-specificity/
    // "id,class,type",
    // selector-max-specificity
    'declaration-no-important': true,
    'selector-max-compound-selectors': 3,
    'selector-no-qualifying-type': true,

    // Selectors
    'no-duplicate-selectors': true,

    // Blocks
    'block-no-empty': true,
    // 每个样式规则前后都有空行，除了第一条规则与规则前有注释
    'at-rule-empty-line-before': null,
    // More styling rules for more consistency
    'at-rule-name-case': 'lower',

    // Colors
    'color-hex-case': 'lower',
    'color-hex-length': 'short',
    'color-no-invalid-hex': true,

    // strings
    'string-quotes': 'single',
    'selector-pseudo-element-colon-notation': 'single',

    // Values
    // Disallow vendor prefix, they are added by autoprefixer
    'value-no-vendor-prefix': true,
    'value-list-comma-space-after': 'always-single-line',

    // Disallows margin: 1px 1px 1px 1px;
    'shorthand-property-no-redundant-values': true,

    'function-comma-space-before': 'never',

    // Numbers
    // 属性值 0 后面不加单位
    'length-zero-no-unit': true,
    'number-no-trailing-zeros': true,

    // 每个属性声明末尾都要加分号
    'declaration-block-trailing-semicolon': 'always',

    // Declaration blocks
    'declaration-block-no-duplicate-properties': true,

    // Prevents adding unnecesary Specificity or complicated sass stuff
    'scss/selector-no-redundant-nesting-selector': true,

    // 空格
    // 注释 "/*" 后和 "*/" 前必须有空格
    'comment-whitespace-inside': 'always',
    // 属性名 ":" 后必须有空格
    'declaration-colon-space-after': 'always',
    // 属性名 ":" 前不能有空格
    'declaration-colon-space-before': 'never',
    // 声明属性末尾 ";" 前不能有空格
    'declaration-block-semicolon-space-before': 'never',
    // 属性值中的 "," 后必须有空格
    'function-comma-space-after': 'always',
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['page', 'checkbox', 'uni-checkbox'],
      },
    ],
    'value-keyword-case': [
      'lower',
      {
        ignoreKeywords: ['/--qui-/'],
      },
    ],
    'no-empty-source':null,
    'order/properties-order': [
      // 指定声明块内属性的字母顺序
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'float',
      'width',
      'height',
      'max-width',
      'max-height',
      'min-width',
      'min-height',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'margin-collapse',
      'margin-top-collapse',
      'margin-right-collapse',
      'margin-bottom-collapse',
      'margin-left-collapse',
      'overflow',
      'overflow-x',
      'overflow-y',
      'clip',
      'clear',
      'font',
      'font-family',
      'font-size',
      'font-style',
      'font-smoothing',
      'osx-font-smoothing',
      'font-weight',
      'hyphens',
      'src',
      'line-height',
      'letter-spacing',
      'word-spacing',
      'color',
      'text-align',
      'text-decoration',
      'text-indent',
      'text-overflow',
      'text-rendering',
      'text-size-adjust',
      'text-shadow',
      'text-transform',
      'word-break',
      'word-wrap',
      'white-space',
      'vertical-align',
      'list-style',
      'list-style-type',
      'list-style-position',
      'list-style-image',
      'pointer-events',
      'cursor',
      'background',
      'background-attachment',
      'background-color',
      'background-image',
      'background-position',
      'background-repeat',
      'background-size',
      'border',
      'border-collapse',
      'border-top',
      'border-right',
      'border-bottom',
      'border-left',
      'border-color',
      'border-image',
      'border-top-color',
      'border-right-color',
      'border-bottom-color',
      'border-left-color',
      'border-spacing',
      'border-style',
      'border-top-style',
      'border-right-style',
      'border-bottom-style',
      'border-left-style',
      'border-width',
      'border-top-width',
      'border-right-width',
      'border-bottom-width',
      'border-left-width',
      'border-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius',
      'border-top-left-radius',
      'border-radius-topright',
      'border-radius-bottomright',
      'border-radius-bottomleft',
      'border-radius-topleft',
      'content',
      'quotes',
      'outline',
      'outline-offset',
      'opacity',
      'filter',
      'visibility',
      'size',
      'zoom',
      'transform',
      'box-align',
      'box-flex',
      'box-orient',
      'box-pack',
      'box-shadow',
      'box-sizing',
      'table-layout',
      'animation',
      'animation-delay',
      'animation-duration',
      'animation-iteration-count',
      'animation-name',
      'animation-play-state',
      'animation-timing-function',
      'animation-fill-mode',
      'transition',
      'transition-delay',
      'transition-duration',
      'transition-property',
      'transition-timing-function',
      'background-clip',
      'backface-visibility',
      'resize',
      'appearance',
      'user-select',
      'interpolation-mode',
      'direction',
      'marks',
      'page',
      'set-link-source',
      'unicode-bidi',
      'speak',
    ],
  },
};
