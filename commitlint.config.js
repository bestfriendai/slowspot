module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation changes
        'style',    // Code style changes (formatting, semicolons, etc)
        'refactor', // Code refactoring
        'perf',     // Performance improvements
        'test',     // Adding or modifying tests
        'build',    // Build system or external dependencies
        'ci',       // CI configuration changes
        'chore',    // Other changes that don't modify src or test files
        'revert',   // Revert a previous commit
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'mobile',   // Mobile app changes
        'web',      // Web app changes
        'shared',   // Shared code/configs
        'release',  // Release related
        'deps',     // Dependencies
        '',         // Allow empty scope
      ],
    ],
    'subject-case': [0], // Disable subject case check
    'body-max-line-length': [0], // Disable body max line length
  },
};
