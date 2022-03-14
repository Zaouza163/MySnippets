var waitFor = require('../index.js');

describe('waitFor test >', function () {
  var globalObject;

  beforeEach(function () {
    globalObject = {};
  });

  /*
    Через 1 секунду в globalObject появляется значение,
    которое способствует запуску колбеку
  */
  it('Обычная версия, ожидаемый колбек', function (done) {
    var testkey = 'testkey';

    setTimeout(function () {
      globalObject[testkey] = testkey;
    }, 1000);

    waitFor(
      function () {
        return globalObject[testkey];
      },
      function (value) {
        expect(value).toBe(testkey);
        done();
      }
    );

    expect(globalObject[testkey]).toBeUndefined();
  });

  /*
    В globalObject не появляется значение,
    но колбек всё равно срабатывает, т.к. есть условие force
  */
  it('Срабатывание без выполнения ожидаемых условий', function (done) {
    var testkey = 'testkey';

    waitFor(
      function () {
        return globalObject[testkey];
      },
      function (value) {
        expect(arguments.length).toBe(0);
        expect(value).toBeUndefined();
        done();
      },
      true,
      { timeout: 10 }
    );

    expect(globalObject[testkey]).toBeUndefined();
  });

  /*
    В globalObject не появляется значение и колбек не срабатывает.
    Время работы waitFor = 10 * 100 = 1 секунда (timeout * checkCount)
    Спустя 1.1 секунды проверяется, что колбек не сработал.
  */
  it('Без колбека', function (done) {
    var testkey = 'testkey';

    waitFor(
      function () {
        return globalObject[testkey];
      },
      function () {
        globalObject[testkey] = testkey;
      },
      false,
      { timeout: 10 }
    );

    setTimeout(function () {
      expect(globalObject[testkey]).toBeUndefined();
      done();
    }, 1100);
  });
});
