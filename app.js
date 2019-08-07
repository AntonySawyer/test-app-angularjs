angular
  .module('tests', [])
  .controller('TestsList', mainCtrl);

function mainCtrl() {
  this.list = [
    { title: 'Test #1', inProgress: '', result: '', reason: '', function: () => this.changeResult(0, { success: true, descr: '' }) },
    { title: 'Test #2', inProgress: '', result: '', reason: '', function: () => this.changeResult(1, { success: true, descr: '' }) },
    { title: 'Test #3', inProgress: '', result: '', reason: '', function: () => this.changeResult(2, { success: false, descr: 'error' }) },
    { title: 'Test #4', inProgress: '', result: '', reason: '', function: () => this.changeResult(3, { success: true, descr: '' }) },
    { title: 'Test #5', inProgress: '', result: '', reason: '', function: () => this.changeResult(4, { success: false, descr: 'another error' }) },
    { title: 'Test #6', inProgress: '', result: '', reason: '', function: () => this.changeResult(5, { success: true, descr: '' }) }];

  this.changeResult = (id, result) => {
    this.list[id].inProgress = false;
    this.list[id].result = result.success;
    this.list[id].reason = result.descr;
  }

  this.runAll = () => {
    this.list.map(test => test.inProgress = true);
    this.list.forEach(test => test.function());
  };


}