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
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "prettier/prettier": ["error", { "endOfLine": "auto" }],
      "@typescript-eslint/no-explicit-any": ["off"] // 新增这句话，关闭any报错
    }
}
