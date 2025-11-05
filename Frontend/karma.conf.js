module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-junit-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-coverage')
    ],
    reporters: ['progress', 'junit', 'coverage'],

    junitReporter: {
      outputDir: 'test-results',
      outputFile: 'test-results.xml',
      useBrowserName: false
    },

    // ✅ Configuración del reporte de cobertura
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' },
        { type: 'lcov', subdir: '.', file: 'lcov.info' }
      ]
    },

    // ✅ Archivos a instrumentar para la cobertura
    preprocessors: {
      'src/**/*.ts': ['coverage']
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,

    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--headless=new',
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--disable-software-rasterizer',
          '--remote-debugging-port=9222',
          '--window-size=1920,1080'
        ]
      }
    },

    captureTimeout: 300000,
    browserDisconnectTimeout: 300000,
    browserNoActivityTimeout: 300000,
    browserDisconnectTolerance: 5,

    singleRun: true,
    restartOnFileChange: false
  });
};