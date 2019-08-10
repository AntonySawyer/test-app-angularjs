angular
  .module('tests', [])
  .controller('TestsList', mainCtrl)
  .filter('progressFilter', progressFilter);

const endpoint = 'https://postman-echo.com';

function mainCtrl($scope) {
  this.list = [{
      result: '',
      reason: '',
      unit: {
        title: 'Success',
        id: 0,
        url: '/status/200',
        method: 'GET',
        criteria: [1,2]
      }
    },
    {
      result: '',
      reason: '',
      unit: {
        title: 'Wrong method',
        id: 1,
        url: '/status/200',
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
        url: '/status/400',
        method: 'GET',
        criteria: [1, 2]
      }
    }, {
      result: '',
      reason: '',
      unit: {
        title: 'Get ip',
        id: 3,
        url: '/ip',
        method: 'GET',
        criteria: [1, 2]
      }
    }, {
      result: '',
      reason: '',
      unit: {
        title: 'Set params',
        id: 4,
        url: '/get?foo1=bar1&foo2=bar2',
        method: 'GET',
        criteria: [1, 2, 5]
      }
    }, {
      result: '',
      reason: '',
      unit: {
        title: 'Post string',
        id: 5,
        url: '/post',
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
        url: '/put',
        method: 'PUT',
        body: 'This is test string for PUT.',
        criteria: [1, 2, 3]
      }
    }, {
      result: '',
      reason: '',
      unit: {
        title: 'Delete method',
        id: 7,
        url: '/delete',
        method: 'DELETE',
        body: 'This is test string for DELETE.',
        criteria: [1, 2, 3]
      }
    }, {
      result: '',
      reason: '',
      unit: {
        title: 'Path method',
        id: 8,
        url: '/patch',
        method: 'PATCH',
        body: 'This is test string for PATCH.',
        criteria: [1, 2, 3]
      }
    }, {
      result: '',
      reason: '',
      unit: {
        title: 'Post form-urlencoded',
        id: 9,
        url: '/post',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: toUrlEncoded({"key1": "val1", "key2": "val2"}),
        criteria: [1, 2, 4]
      }
    }
  ];

  this.getResult = (unit) => {
    const { id, url, method, headers, body, criteria } = unit;
    const toCheck = {request: {url, method, headers, body}, response: {status: '', statusText: '', body: {}}};
    let errors = [];
    fetch(`http://cors-anywhere.herokuapp.com/${endpoint}${url}`, 
            { method, headers, body }) //TODO: fix cors url
      .then(rs => {
        toCheck.response.status = rs.status;
        toCheck.response.statusText = rs.statusText;

        rs.json().then(data => toCheck.response.body = data)
        .then(() => errors = checkList(criteria, toCheck))
        .then(() => {
          if (errors.length === 0) {
            this.list[id].result = true;
            this.list[id].reason = `${criteria.length} from ${criteria.length} passed.`
          } else {
            this.list[id].result = false;
            this.list[id].reason = `${errors.length} from ${criteria.length} failed: \n ${errors.join('\n')}`;
          }
          $scope.$apply(); //TODO: fix it
        });

      })
      .catch(err => {
        this.list[id].result = false;
        this.list[id].reason = `Can't fetching: \n ${err}`;
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

const toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');

function checkList(criteria, toCheck) {
  const funcToCheck = {
    1: checkStatus,
    2: validJSON,
    3: compareBody,
    4: compareForm,
    5: checkArgs
  };
  const results = [];
  criteria.forEach(id => results.push(funcToCheck[id](toCheck)));
  return results.filter(i => !!i); // i: null || "str: error"
}

function checkStatus(toCheck) {
  const rs = toCheck.response; 
  return rs.status === 200 ? null : `Status ${rs.status}: ${rs.statusText}`;
}

function validJSON(toCheck) {
  const rsBody = toCheck.response.body;
  return rsBody && rsBody instanceof Object && rsBody.constructor === Object
        ? null
        : 'Response data is not JSON';
}

function compareBody(toCheck) {
  const rqBody = toCheck.request.body;
  const rsBody = toCheck.response.body;
  return rqBody === rsBody.data ? null : `Got ${rsBody.data} across ${rqBody}`;
}

function compareForm(toCheck) {
  const rsForm = toUrlEncoded(toCheck.response.body.form);
  const rqForm = toCheck.request.body;
  return rqForm === rsForm ? null : `Got ${rsForm} across ${rqForm}`;
}

function checkArgs(toCheck) {
  const rsArgs = toCheck.response.body.args;
  const rqArgs = new URL(`${endpoint}${toCheck.request.url}`);
  const rsArgsKeys = Object.keys(rsArgs);
  const rqArgsKeys = [];
  for (let key of rqArgs.searchParams.keys()) {
    rqArgsKeys.push(key);
  }
  if (rsArgsKeys.length === rqArgsKeys.length) {
    const keyDiff = rsArgsKeys.filter(i => !rqArgsKeys.includes(i));
    if (keyDiff.length === 0) {
      const valDiff = [];
      rsArgsKeys.map(i => {
        if (rqArgs.searchParams.get(i) !== rsArgs[i]) {
          valDiff.push(rsArgs[i]);
        }
      });
      return valDiff.length === 0 ? null : `Unexpected values: ${valDiff.join(', ')}`;
    } else {
      return `Unknown arguments: ${keyDiff.join(', ')}`;
    }
  } else {
    return `Request has ${rqArgsKeys.length} arguments, but response have ${rsArgsKeys.length}`;
  }
}