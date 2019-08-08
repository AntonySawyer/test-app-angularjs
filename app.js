angular
  .module('tests', [])
  .controller('TestsList', mainCtrl)
  .filter('progressFilter', progressFilter);

function mainCtrl($scope, $http) {
  this.list = [{
      title: 'Test #1',
      result: '',
      reason: '',
      function: () => this.getResult(0, {
        url: 'https://postman-echo.com/status/200',
        method: 'GET'
      })
    },
    {
      title: 'Test #2',
      result: '',
      reason: '',
      function: () => this.getResult(1, {
        url: 'https://postman-echo.com/status/20',
        method: 'GET'
      })
    },
    {
      title: 'Test #3',
      result: '',
      reason: '',
      function: () => this.getResult(2, {
        url: 'https://postman-echo.com/status/200',
        method: 'GETd'
      })
    }
  ];

  this.getResult = (id, rqParams) => {
    fetch(rqParams.url, {
        method: rqParams.method
      })
      .then(rs => {
        if (rs.status === 200) {
          this.list[id].result = true;
        } else {
        this.list[id].result = false;
        this.list[id].reason = `Status ${rs.status}: ${rs.statusText}`;
        }
        $scope.$apply(); //TODO: fix it
      })
      .catch(err => {
        this.list[id].result = false;
        this.list[id].reason = err;
        $scope.$apply(); //TODO: fix it
      });
  }

  this.runAll = () => {
    this.list.map(test => test.result = 'run');
    this.list.forEach(test => test.function());
  };
}

function progressFilter() {
  return state => {
    switch (state) {
      case true:
        return 'Test successfull completed.'
      case false:
        return 'Something is wrong.'
      case 'run':
        return 'Waiting for results...'
      default:
        return 'Not running.'
    }
  }
}