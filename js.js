'use strict';

const account1 = {
  owner: 'Dmitrii Fokeev',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-07-28T17:01:17.194Z',
    '2023-07-31T23:36:17.929Z',
    '2023-08-01T21:31:17.178Z',
  ],
  currency: 'UAN',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Anna Filimonova',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Polina Filimonova',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'es-PE',
};

const account4 = {
  owner: 'Stanislav Ivanchenko',
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
  currency: 'USD',
  locale: 'ua-UA',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

function FormatMovementDate(date) {
  const calcDaysPassed = function (date1, date2) {
    return Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
  };
  const dayPassed = calcDaysPassed(new Date(), date);
  //console.log(dayPassed);

  if (dayPassed === 0) return 'Нинька';
  if (dayPassed === 1) return 'Вчора';
  if (dayPassed >= 2 && dayPassed <= 4) return `Прийшло ${dayPassed} дні`;
  if (dayPassed <= 7) return `Прийшло ${dayPassed} днів`;

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const hours = `${date.getHours()}`.padStart(2, 0);
  const minutes = `${date.getMinutes()}`.padStart(2, 0);

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function printCarencyAndLocal(params) {
  const options = {
    style: 'currency',
    currency: currentAccount.currency,
  };
  return Intl.NumberFormat(currentAccount.locale, options).format(params);
}

// Вивід на сторінку всіх поповнень і відправлень
function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (value, i) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const typeMessage = value > 0 ? 'внесение' : 'снятие';

    const date = new Date(acc.movementsDates[i]);

    const options = {
      style: 'currency',
      currency: currentAccount.currency,
    };
    const num = Intl.NumberFormat(currentAccount.locale, options).format(value);

    const dispayDate = FormatMovementDate(date);
    // console.log(date);
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${typeMessage}
          </div>
          <div class="movements__date">${dispayDate}</div>
          <div class="movements__value">${printCarencyAndLocal(value)}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

//  Стоврення логіна з ПІБ в об'єкті
function createLogIn(accs) {
  accs.forEach(function (acc) {
    acc.logIn = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (val) {
        return val[0];
      })
      .join('');
  });
}
createLogIn(accounts);

// Підрахунок балансу і вивід на сторінку загального балансу
function calcPrintBalance(acc) {
  acc.balance = acc.movements.reduce(function (acc, val) {
    return acc + val;
  });

  const options = {
    style: 'currency',
    currency: currentAccount.currency,
  };

  labelBalance.textContent = `${printCarencyAndLocal(acc.balance)} `;
}

// Сумма і вивід на сторінку поповлення і відправлень в footer
function calcDisplaySum(movements) {
  const incomes = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${printCarencyAndLocal(incomes)}`;

  const out = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${printCarencyAndLocal(Math.abs(out))}`;

  labelSumInterest.textContent = `${printCarencyAndLocal(incomes + out)}`;
}

//Оновлення інтерфейсу
function updateUi(acc) {
  displayMovements(acc);
  calcPrintBalance(acc);
  calcDisplaySum(acc.movements);
}

//Час timeout & interval
function startLogOut() {
  let time = 600;

  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const second = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}: ${second}`;

    if (time == 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
    }
    time--;
  }
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}
//Кнопка входу в акаунт
let currentAccount;
let timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('Login');
  currentAccount = accounts.find(function (acc) {
    return acc.logIn === inputLoginUsername.value;
  });
  console.log(currentAccount);
  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;

    inputLoginPin.value = inputLoginUsername.value = '';
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const date = `${now.getDate()}`.padStart(2, 0);
    const hours = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);

    const local = navigator.language;
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'long',
      hour12: false,
    };
    labelDate.textContent = Intl.DateTimeFormat(local, options).format(
      new Date()
    );

    if (timer) {
      console.log(timer);
      console.log('Вище таймер');
      clearInterval(timer);
    }
    timer = startLogOut();
    updateUi(currentAccount);
  }
});

//Переказ коштів на інший акаунт
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const reciveAcc = accounts.find(function (acc) {
    return acc.logIn === inputTransferTo.value;
  });
  const amount = Number(inputTransferAmount.value);
  console.log(amount, reciveAcc);
  if (
    reciveAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    reciveAcc.logIn !== currentAccount.logIn
  ) {
    currentAccount.movements.push(-amount);
    reciveAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());

    clearInterval(timer);
    timer = startLogOut();
    updateUi(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});

//Видалення акаунта
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.logIn &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.logIn === currentAccount.logIn;
    });
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    console.log(accounts);
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//Внесення коштів на сайт
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0) {
    currentAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());

    clearInterval(timer);
    timer = startLogOut();

    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});

// Загальний баланс коротко
const overalBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

//Сортування по надходженнях і відправленнях
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//Зміна значка валюти
labelBalance.addEventListener('click', function () {
  Array.from(document.querySelectorAll('.movements__value'), function (val, i) {
    return (val.innerText = val.textContent.replace('$', 'USD'));
  });
});

console.log(641 % 60);
