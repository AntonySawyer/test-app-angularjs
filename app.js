angular
  .module('tests', [])
  .controller('TestsList', mainCtrl);

function mainCtrl() {
  this.list = [
    {
      title: 'Test #1',
      inProgress: '',
      result: '',
      reason: '',
      rqParam: {
        url: 'http://postman-echo.com/status/200',
        method: 'GET'
      }
    },
    {
      title: 'Test #2',
      inProgress: '',
      result: '',
      reason: '',
      rqParam: {
        url: 'https://postman-echo.com/status/200',
        method: 'GET'
      }
    },
    {
      title: 'Test #3',
      inProgress: '',
      result: '',
      reason: '',
      rqParam: {
        url: 'https://postman-echo.com/status/200',
        method: 'GET'
      }
    },
    {
      title: 'Test #4',
      inProgress: '',
      result: '',
      reason: '',
      rqParam: {
        url: 'https://postman-echo.com/status/200',
        method: 'GET'
      }
    },
    {
      title: 'Test #5',
      inProgress: '',
      result: '',
      reason: '',
      rqParam: {
        url: 'https://postman-echo.com/status/200',
        method: 'GET'
      }
    },
    {
      title: 'Test #6',
      inProgress: '',
      result: '',
      reason: '',
      rqParam: {
        url: 'https://postman-echo.com/status/20',
        method: 'GET'
      }
    }];

  this.runAll = () => {
    this.list.map(test => test.inProgress = true);
    this.list.forEach((test, index) => this.checkRQ(test.rqParam, index));
    this.changeResult(5,[]);
  };

  this.checkStatus = (status) => {
    console.log('in status with ' + status);
    return status === 200 ? false : `Status - ${status}`;
  }

  this.changeResult = (id, errors) => {
    console.log('in change');
    console.log(errors);
    this.list[id].inProgress = false;
    this.list[id].result = errors.length === 0;
    if (errors.length !== 0) {
      this.list[id].reason = errors.join('\n');
    }
    console.log(this.list[id]);
  }

  this.checkRQ = (param, id) => {
    const errors = [];
    fetch(param.url, {
      method: param.method
    })
      .then(rs => errors.push(this.checkStatus(rs.status)))
      .then(() => this.changeResult(id, errors.filter(isError => isError)))
      .catch(err => {
        errors.push(err);
        this.changeResult(id, errors.filter(isError => isError)
      );
    });
  }
}