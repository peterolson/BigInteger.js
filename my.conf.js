module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'BigInteger.js',
      'spec/*spec.js'
    ],
    browsers: ['PhantomJS'],
    singleRun: true,
    reporters: ['progress', 'coverage'],
    preprocessors: { '*.js': ['coverage'] },
    coverageReporter: {
	    type : 'lcov',
	    dir : 'coverage/',
	    subdir: '.'
    },
    browserNoActivityTimeout: 60000
  });
};