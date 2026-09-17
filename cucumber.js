module.exports = {
  default: {
    require: [
      'src/support/world.ts',
      'src/hooks/hooks.ts',
      'src/steps/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    retry: 0,
    parallel: 1,
    timeout: 60000,
    worldParameters: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }
  }
};
