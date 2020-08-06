module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能（feature）
        'fix', // 修补 bug
        'docs', // 文档（documentation）的变动
        'style', // 格式（不影响代码运行的变动）
        'refactor', // 重构（即不是新增功能，也不是修改bug的代码变动）
        'perf', // 性能优化
        'test', // 增加测试或者更正已经存在的测试
        'build', // 更改影响构建系统或者额外的依赖（例如：gulp，npm）
        'ci', // 更改CI配置文件和脚本（例如：Travis，Circle）
        'chore', // 构建过程或辅助工具的变动
        'revert', // 如果返回之前的提交时说明的 type 类型使用 revert
        'update', // 更新某功能
      ],
    ],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
  },
};
