angular
  .module('tests', [])
  .controller('TestsList', mainCtrl)
  .filter('progressFilter', progressFilter);

function mainCtrl($scope) {
  this.list = [{
      result: '',
      reason: '',
      unit: {
        title: 'Success',
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
        title: 'Wrong method',
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
        title: 'Bad request',
        id: 2,
        url: 'https://postman-echo.com/status/400',
        method: 'GET',
        criteria: [1]
      }
    }, {
      result: '',
      reason: '',
      unit: {
        title: 'Get ip',
        id: 3,
        url: 'https://postman-echo.com/ip',
        method: 'GET',
        criteria: [1, 2]
      }
    }, {
      result: '',
      reason: '',
      unit: {
        title: 'Set params',
        id: 4,
        url: 'https://postman-echo.com/get?foo1=bar1&foo2=bar2',
        method: 'GET',
        criteria: [1]
      }
    }, {
      result: '',
      reason: '',
      unit: {
        title: 'Post string',
        id: 5,
        url: 'https://postman-echo.com/post',
        method: 'POST',
        body: 'This is test string for POST.',
        criteria: [1, 2, 3]
      }
    }, {
      result: '',
      reason: '',
      unit: {
        title: 'Put sring',
        id: 6,
        url: 'https://postman-echo.com/put',
        method: 'PUT',
        body: 'This is test string for PUT.',
        criteria: [1, 2, 3]
      }
    }
  ];

  this.getResult = (unit) => {
    const { id, url, method, body, criteria } = unit;
    fetch(`http://cors-anywhere.herokuapp.com/${url}`, { method, body }) //TODO: fix it
      .then(rs => {
        const errors = checkList(criteria, rs, body);
        if (errors.length === 0) {
          this.list[id].result = true;
          this.list[id].reason = `${criteria.length} from ${criteria.length} passed.`
        } else {
          this.list[id].result = false;
          this.list[id].reason = `${errors.length} from ${criteria.length} failed: \n ${errors.join('\n')}`;
        }
        $scope.$apply(); //TODO: fix it
      })
      .catch(err => {
        this.list[id].result = false;
        this.list[id].reason = `Can't testing: \n ${err}`;
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

function checkList(criteria, rs, rqBody) {
  const funcToCheck = {
    1: checkStatus,
    2: validJSON,
    3: compareBody
  };
  const results = [];
  criteria.forEach(id => results.push(funcToCheck[id](rs, rqBody)));
  return results.filter(i => !!i); // i: null || "str: error"
}

function checkStatus(rs) {
  return rs.status === 200 ? null : `Status ${rs.status}: ${rs.statusText}`;
}

function validJSON(rs) {
  try {
    rs.json()
    .then(data => {
      console.log(data);
      return null;
    })
    .catch(err => { return err })
  }
  catch (e) {
    return e;
  }
}

function compareBody(rs, rqBody) {
  rs.json()
  .then(data => {return rqBody === data ? null : `Got ${data} across ${rqBody}`})
}