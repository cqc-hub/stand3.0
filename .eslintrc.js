module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "plugin:vue/vue3-essential",
  "parserOptions": {
    "ecmaVersion": "latest",
    "parser": "@typescript-eslint/parser"
  },
  "plugins": [
    "vue",
    "@typescript-eslint"
  ],
  "rules": {
    "vue/multi-word-component-names": "off",
    // 'no-console': 'warn'
  }
}