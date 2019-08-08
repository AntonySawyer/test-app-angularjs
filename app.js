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
        criteria: [1, 2]
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
        criteria: [1, 2]
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
        criteria: [1, 2]
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
          this.list[id].reason = errors.join('\n');
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

function checkList(criteria, rs) {
  const funcToCheck = {
    1: checkStatus,
    2: validJSON
  };
  const results = [];
  criteria.forEach(id => results.push(funcToCheck[id](rs)));
  return results.filter(i => !!i); // i: null || "str: error"
}

function checkStatus(rs) {
  if (rs.status === 200) {
    return null;
  } else {
    return `Status ${rs.status}: ${rs.statusText}`;
  }
}

function validJSON(rs) { //doesn't work correct yet
  return null; 
  // try {
  //   const json = JSON.parse(rs);
  //   return typeof json === Object ? null : 'Invalid JSON';
  // }
  // catch (e) {
  //   console.log(e)
  //   return e;
  // }
}