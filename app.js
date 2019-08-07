angular.module('tests', [])
  .controller('TestsList', function() {
    const tests = this;

    tests.list = [
      { title: 'Test #1' },
      { title: 'Test #2' },
      { title: 'Test #3' },
      { title: 'Test #4' },
      { title: 'Test #5' },
      { title: 'Test #6' }];
 
    tests.runAll = function() {
      tests.list.forEach(test => test.function())
    };
  });