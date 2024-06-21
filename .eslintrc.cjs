module.exports = {
  root: true,
  extends: ['@vben'],
  rules: {
    'no-undef': 'off',
  },
  parserOptions: {
    "project": ["tsconfig.json", "tsconfig.node.json"]
  }
};
