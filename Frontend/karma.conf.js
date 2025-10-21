module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-junit-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    reporters: ['progress', 'junit', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' }
      ]
    },
    junitReporter: {
      outputDir: 'test-results',
      outputFile: 'test-results.xml',
      useBrowserName: false
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,

    // ✅ Lanzador personalizado para Azure DevOps / CI
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',               // necesario en entornos CI
          '--disable-gpu',
          '--disable-dev-shm-usage',    // evita bloqueos por memoria compartida
          '--remote-debugging-port=9222'
        ]
      }
    },

    // ✅ Timeouts más amplios (evita desconexiones)
    captureTimeout: 120000,
    browserDisconnectTimeout: 120000,
    browserNoActivityTimeout: 120000,

    singleRun: true,
    restartOnFileChange: true
  });
};
