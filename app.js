angular
  .module('tests', [])
  .controller('TestsList', mainCtrl)
  .filter('progressFilter', progressFilter);

function mainCtrl($scope) {
  this.list = [{
      result: '',
      reason: '',
      unit: {
        title: 'Test',
        id: 0,
        url: 'https://postman-echo.com/status/200',
        method: 'GET',
        criteria: [1]
      }
    },
    {
      result: '',
      reason: '',
      unit: {
        title: 'Test',
        id: 1,
        url: 'https://postman-echo.com/status/200',
        method: 'FAIL',
        criteria: [1]
      }
    },
    {
      result: '',
      reason: '',
      unit: {
        title: 'Test',
        id: 2,
        url: 'https://postman-echo.com/status/400',
        method: 'GET',
        criteria: [1]
      }
    }
  ];

  this.getResult = (unit) => {
    const { id, url, method, criteria } = unit;
    fetch(url, { method })
      .then(rs => {
        console.log(rs);
        const errors = checkList(criteria, rs);
        if (errors.length === 0) {
          this.list[id].result = true;
        } else {
          this.list[id].result = false;
          this.list[id].reason = errors.join('; ');
        }
        $scope.$apply(); //TODO: fix it
      })
      .catch(err => {
        console.log(err)
        this.list[id].result = false;
        this.list[id].reason = err;
        $scope.$apply(); //TODO: fix it
      });
  }

  this.runAll = () => {
    this.list.map(test => test.result = 'run');
    this.list.forEach(test => this.getResult(test.unit));
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

function checkList(params, rs) {
  const check = {
    1: (rs) => checkStatus(rs)
  }
  const results = [];
  params.forEach(id => results.push(check[id](rs)));
  return results.filter(i => !!i); // i: null || "str: error"
}

function checkStatus(rs) {
  if (rs.status === 200) {
    return null;
  } else {
    return `Status ${rs.status}: ${rs.statusText}`;
  }
}