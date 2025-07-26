'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// nayapay

// function good() {
//   console.log('-------good job hamza 👍 keep it up-------');
// }
// // setTimeout(good, 1500);
// Data;
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,

//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Akmal Shahzad',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2024-03-13T10:51:36.790Z',
    '2024-07-01T10:51:36.790Z',
    '2024-07-05T10:51:36.790Z',
    '2024-07-06T10:51:36.790Z',
    '2024-07-07T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Hamza Nazir',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
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

const accounts = [account1, account2];

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
containerApp.style.opacity = 0;

/////////////////////////////////////////////////
// /////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

let euroToUsd = 1.1;
const MovementUsd = movements.map(mov => mov * euroToUsd);
let time, timer;
////
/////
///-/// UPDATE UI
function updateUI(acc) {
  const currentDate = new Date();

  // const date = `${currentDate.getDate()}`.padStart(2, '0');
  // const month = `${currentDate.getMonth() + 1}`.padStart(2, '0');
  // const year = currentDate.getFullYear();
  // const hours = `${currentDate.getHours()}`.padStart(2, '0');
  // const minute = `${currentDate.getMinutes()}`.padStart(2, '0');
  // labelDate.textContent = `${date}/${month}/${year} ${hours}:${minute}`;
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  };
  // const locale = navigator.language;
  labelDate.textContent = new Intl.DateTimeFormat(acc.locale, options).format(
    now
  );

  // CALCULATE BALLANCE AND DISPLAY
  calcurrcuentballence(acc);

  ///CALCUALTE SUMMMARY AND DISPLAY
  calcDisplaySummary(acc);

  //DISPLAY MOVEMENTS
  displaymovement(acc);
}

////log out timmer
function logouttimer() {
  time = 300;

  const tick = function () {
    const min = `${Math.trunc(Math.abs(time / 60))}`.padStart(2, 0);
    const sec = `${Math.trunc(Math.abs(time % 60))}`.padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
    time--;
    // tick();
  };
  // tick();
  timer = setInterval(tick, 1000);
}

////
///
//    CALCULATE NUMBER

const displayNumber = function (num, locale, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };
  const number = new Intl.NumberFormat(locale, options).format(num);
  return number;
};

//////
////
// DISPLAY MOVEMENTS
function displaymovement(acc1, sort = false) {
  const move = document.querySelector('.movements');
  move.innerHTML = '';
  console.log('!'.repeat(3000));
  // console.log([...acc1.movements].sort((a, b) => a - b));
  let mov = sort
    ? acc1.movements.slice().sort((a, b) => a - b)
    : acc1.movements;

  // console.log(mov);
  // `${date}/${month}/${year} ${hours}:${minute}`;
  mov.forEach(function (v, i) {
    //v-> value
    //i-> index

    const displaydate = dateandtime(new Date(acc1.movementsDates[i]), acc1);
    ////
    // console.log(i, v);
    let sate = v > 0 ? 'deposit' : 'withdrawal';
    let text = `
    <div class="movements__row">
    <div class="movements__type movements__type--${sate}">
      ${i} ${sate}
    </div>
        <div class="movements__date">${displaydate}</div>

    <div class="movements__value">${displayNumber(
      v,
      acc1.locale,
      acc1.currency
    )}</div>
  </div>`;
    move.insertAdjacentHTML('afterbegin', text);
  });
}

///
///
///////CALCULATE AND DISPLAY BALLANCE
const calcurrcuentballence = function (acc) {
  acc.ballance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = displayNumber(
    acc.ballance,
    acc.locale,
    acc.currency
  );
};

////
///
////// USERNAME
// let str = 'Steven Thomas Williams';
function username(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(ent => ent[0])
      .join('');
  });
}
username(accounts);

//////
///
/////////// TOTAL DEPOSIT , TOTAL WITHDRAW  , TOTAL INTEREST
function calcDisplaySummary(acc) {
  // TOTAL DEPOSIT
  const dep = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = displayNumber(dep, acc.locale, acc.currency);

  // TOTAL WITHDRAW
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = displayNumber(out, acc.locale, acc.currency);
  // console.log(move);
  // TOTAL INTEREST
  const interest = acc.movements
    .filter((int1, i, arr) => {
      // console.log('int 1    ' + arr);
      return int1 > 0;
    })
    .map((int2, o, arr) => {
      // console.log('int 2    ' + arr);
      return (int2 * acc.interestRate) / 100;
    })
    .filter((int3, o, arr) => {
      // console.log('int 3   ' + arr);
      return int3 >= 1;
    })
    .reduce((acc, int4, o, arr) => {
      // console.log('int 4   ' + arr);
      return acc + int4;
    }, 0);
  labelSumInterest.textContent = displayNumber(
    interest,
    acc.locale,
    acc.currency
  );
}

//////
//////
////// LOGIN FEATURE
//FAKE LOGIN
let currentUser;
// updateUI(currentUser);
// containerApp.style.opacity = '1'; // 1 means 100%
// // console.log(currentDate);
// console.log('_CURRENT ACCOUNT_'.repeat(20));
// const dty = `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;
// console.log(dty);

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  // console.log('login');

  // STORE CURRENT USER  BY GETING USERNAME
  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);
  // console.log(currentUser.pin);

  /// PASSWORD
  // console.log(inputLoginPin.textContent);
  if (currentUser?.pin === +inputLoginPin.value) {
    //  courser blink remove and blur
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    //DISPLAY WELLCOME MESSAGE
    labelWelcome.textContent = `Wellcome Back , ${
      currentUser.owner.split(' ')[0]
    }`;

    //update ui
    updateUI(currentUser);

    containerApp.style.opacity = '1'; // 1 means 100%

    //Log out Timmer
    logouttimer();
  }
});

////
///
/////// TRANSFER MONEY ///---------///------------///-------------///------------/
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('enter transfer');
  const ammount = +inputTransferAmount.value;

  const transferTo = inputTransferTo.value;

  const reciver = accounts.find(acc => acc.username === transferTo);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    reciver !== undefined &&
    ammount > 0 &&
    ammount <= currentUser.ballance &&
    reciver.username !== currentUser.username
  ) {
    reciver.movements.push(ammount);
    currentUser.movements.push(-ammount);
    currentUser.movementsDates.push(new Date().toISOString());
    reciver.movementsDates.push(new Date().toISOString());

    //update ui
    updateUI(currentUser);

    clearInterval(timer);
    logouttimer();
  }
});

/////
//////
/////// LOG OUT FUNCTION  ///-////----------{-----------------------///---------------//

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  console.log('enter close');
  const pin = +inputClosePin.value;
  const user = inputCloseUsername.value;

  if (pin === currentUser.pin && user === currentUser.username) {
    const delAcc = accounts.findIndex(acc => acc.pin === pin);
    clearInterval(timer);
    accounts.splice(delAcc, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
});
////
//
//// LOAN FUNCTION
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const ammount = +inputLoanAmount.value;
  console.log(ammount);

  if (
    ammount > 0 &&
    currentUser.movements.some(mov => mov >= (ammount * 10) / 100)
  ) {
    setTimeout(function () {
      // add movement
      currentUser.movements.push(ammount);
      currentUser.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentUser);
    }, 2500);
    // clearInterval(tick);
    logouttimer();
  }
});

////////
////////////
////////////// SORTED OR NOT

let sort = false;
btnSort.addEventListener('click', function () {
  displaymovement(currentUser, !sort);
  sort = !sort;
});

///
/////FORMATE DATES
function dateandtime(date, acc) {
  const fromatedate = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  const days = fromatedate(new Date(), date);
  if (days === 0) {
    return 'Today';
  }
  if (days === 1) {
    return 'Yesterday';
  }
  if (days < 7) {
    return days + ' ' + 'days ago';
  } else {
    // const year1 = date.getFullYear();
    // const month1 = `${date.getMonth() + 1}`.padStart(2, '0');
    // const date1 = `${date.getDate()}`.padStart(2, '0');
    // return `${date1}/${month1}/${year1}`;
    return new Intl.DateTimeFormat(acc.locale).format(date);
  }
}
//
////
// console.log(accounts);

// filter method

// const deposit = movements.filter(mov => mov > 0);
// console.log(movements);
// console.log(deposit);

//Reduce Method
// const ballance = movements.reduce(function (acc, cur, i, arr) {
//   return acc + cur;
// }, 0);
///////////////////////////////////////////////////
//SLICE
// console.log(movements.slice(2, -2));
// console.log('orignal :', movements);

//SPLIT METHOD
// console.log(movements.splice(2, 3));
// console.log('orignal :', movements);

//REVERSE
// console.log(movements.reverse());
// console.log('orignal :', movements);

// //CONCAT
// let arr1 = [12, 12, 1, 1221, 21212, 1221, 1, 2, 12, 212, 12];
// console.log(arr1.concat(movements));
// console.log([...arr1, ...movements]);

// //join
// console.log(movements.join('_'));

// //at method
// console.log(movements.at(-1));
// console.log(movements[movements.length - 1]);
// console.log(movements.slice(-1)[0]);

// // //SPLIT METHOD
// console.log('-------------');
// movements.forEach((i, j) => {
//   console.log('[' + j + ']', i, ':');
// });

// const map12 = new Map([
//   [12, 'asdsadas'],
//   [323, '32323232323'],
//   ['Sda', [121212, 12, 12, 121, 212, 121, 2121, 21]],

//   [12121, '121212dswsdsd'],
//   [322323, 'vcbjxuhv sbjufnhs dfnfkjdn'],
// ]);
// console.log(map12);

// map12.forEach(function (i, j, k) {
//   console.log(j, i);
// });

// const set121 = new Set([12, 1212, 12, 1, 212, 12, 121]);
// console.log(set121);
// set121.forEach((a, _, c) => {
//   console.log(a);
// });

// let arr1 = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr1.slice(1));
// // console.log('orignal  :-> ', arr1);

// // console.log('SPLICE');
// // //SPLICE
// // console.log(arr1.splice(1, 4));
// // console.log(arr1);

// // REVERSE

// console.log(arr1.reverse());
// console.log(arr1);

// //CONCAT
// let arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// let a = arr1.concat(arr2);

// console.log(a.length);

// console.log(['1', 2, 4, [34, 65], { na: 'loger' }, 8].join('-'));
// console.log(a);
// console.log(a.at(-1));
// console.log(a.slice(-1)[0]);
// console.log(a);
// // a.forEach(function (i, b, c) {
// //   console.log(i, '  ', b, );
// // });

// // array.forEach(element => {

// // });
// console.log('<-<>->'.repeat(100));
// //FOR EACH FOR SETS AND MAPS
// const map1 = new Map([
//   ['1 ', [1, 4, 7, 9]],
//   ['hamza ', 'ham,za kim jeho'],
//   ['logo ', [1, 4, 7, 9]],
//   ['toto', 'helo'],
// ]);
// map1.forEach(function (a, b, c) {
//   console.log(b, ' ', a);
// });

// const set1 = new Set(['a', 'a', 1, 2, 3, 4, 5, 6, 6, 6, 6]);
// console.log(set1);
// set1.forEach(function (a, v) {
//   console.log(a, ' ', v);
// });
// console.log(set1.length);
// for (let index = 0; index < 6; index++) {
//   console.log(set1[index]);
// }

// console.log([...set1].length);

// ///////////////////////////////////////////////////////////////////////MOVEMENTS
// console.log('> '.repeat(200));
// function checkDogs(dogsJulia, dogsKate) {
//   // console.log(dogsJulia);
//   let juliadogs = [...dogsJulia.slice(1, -2)];
//   // console.log(juliadogs);

//   let merage = [...juliadogs, ...dogsKate];
//   merage.forEach((v, i) => {
//     console.log(
//       `Dog number ${i + 1} is an ${
//         v >= 3 ? 'adult' : 'puppy'
//       }, and is ${v} years old`
//     );
//   });
// }
// // // § Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// // § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

// // checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// function calcAverageHumanAge(ages) {
//   // const humanAge = ages.map(function (age) {
//   //   if (age <= 2) return 2 * age;
//   //   if (age > 2) return 16 + age * 4;
//   // });
//   // const adultdog = humanAge.filter(age => age >= 18);
//   // const average = adultdog.reduce((acc, val) => acc + val, 0) / adultdog.length;

//   // console.log(ages);
//   // console.log(humanAge);
//   // console.log(adultdog);
//   // console.log(average);

//   const average = ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, val, a, arr) => acc + val / arr.length, 0);
//   return average;
// }

// // Data 1: c
// //  Data 2: [16, 6, 10, 5, 6, 1, 4]
// console.log('data 1 for coding challange');
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

//PRACTICE OF FIND METHOD
//FIND METHOD
// console.log('FIND METHOD');
// const firstWith = movements.find(mov => mov < 0);
// console.log(firstWith);
// console.log(accounts.find(mov => mov.owner.startsWith('Jessica')));
// // for (const chz of accounts) {
// //   if (chz.owner.startsWith('Jessica')) {
// //     console.log(chz);
// //     break;
// //   }
// //   // console.log(chz);
// // }
// ///
// ////
// /////FIND INDEX

// // let arr = [1, 2, 3, 4, 5, 6, 7, 89, 22];
// // console.log('hamza');
// // console.log(arr.findIndex(acc => 3 < acc));
// // console.log(arr[3]);

// console.log('some method');
// console.log(...movements);
// console.log(movements.some(mov => mov > 0));
// console.log('includes ');
// console.log(movements.includes(-130));

// console.log(movements.every(mov => mov > 0));

// // flat method

// let arr = [1, [2, [12, 121, 2121], 4], 5, 6, 7, [4, 3, 3]];
// console.log(arr);
// console.log(arr.flat(3));

// console.log(
//   accounts
//     .map(mov => mov.movements)
//     .flat()
//     .reduce((acc, val) => acc + val)
// );

// console.log(
//   accounts.flatMap(acc => acc.movements).reduce((acc, val) => acc + val)
// );

// console.log(arr.flatMap(i => i));

// /// SORTING METHODS IN ARRAY

// let arr12 = ['hamza', 'rahim', 'paki', 'zaia', 'asas'];
// console.log(arr12);
// // arr12.sort();
// // console.log(arr12);

// console.log('-----------');

// console.log(movements);
// movements.sort();
// console.log(movements);
// const arr2 = [1, 10, 2, 3, 13, 4, 5, 7, 8, 9, 6];
// console.log(arr2);
// // return < 0 , A,B
// // return > 0 , B,A
// arr2.sort((a, b) => {
//   // // console.log('a', a);
//   // // console.log('b', b);
//   // // return a - b;
//   // // if (a > b) re;

//   // if (a > b) return 1;
//   // if (b < a) return -1;
//   return a - b;
// });
// console.log(arr2);

////

///
///  ARRAY IN PRACTACE ---- / // // / // / //  ------ ///

// console.log(accounts);
const totaldeposit = accounts
  .flatMap(acc => acc.movements)
  .filter(acc => acc > 0)
  .reduce((acc, val) => acc + val, 0);
// console.log(totaldeposit);

// 2;

// console.log('___2____');
//how many deposit at least 1000 dollers
const totaldepost100 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, val, i) => (val >= 100 ? i + 1 : '', 0));
console.log(totaldepost100);

//3
// const sum = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, val) => (val > 0 ? acc.dep++ : acc.withdraw++), {
//     dep: 0,
//     withdraw: 0,
//   });
// console.log(sum);

// const sum = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (acc, val) => {
//       if (val > 0) {
//         acc.dep++;
//       } else {
//         acc.withdraw++;
//       }
//       return acc;
//     },
//     { dep: 0, withdraw: 0 }
//   );

// console.log(sum);

////3
// //................(3)................
// const sum = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (acc, val) => {
//       if (val > 0) acc.dep++;
//       else acc.withdraw++;

// //       return acc;
// //     },/
// //     {
// //       dep: 0,
// //       withdraw: 0,
// //     }
// //   );
// // console.log(sum);

// //4 ------------//---------//---------------//
// // this is nice title -> This Is a Nice Title

// function convertTitleCase(title) {
//   const expection = ['a', 'an', 'the', 'but', 'or', 'in', 'with', 'and'];
//   const out = title
//     .split(' ')
//     .map(word =>
//       expection.includes(word)
//         ? word
//         : word[0].toUpperCase() + word.slice(1).toLowerCase()
//     )
//     .join(' ');

// //   return out[0].toUpperCase() + out.slice(1);
// // }

// // console.log(convertTitleCase('this is nice a title'));
// // console.log(convertTitleCase('for more and more things EVER SZA'));
// // console.log(convertTitleCase('a nice man see'));
// // console.log(convertTitleCase('djsn sjdnsj jwndjns shbdjsb sbdhjbsj'));

// //////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////////////
// // CODING CHALLANGE
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// //1
// dogs.forEach(dog => {
//   dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
// });

// let saradog = dogs[dogs.findIndex(d => d.owners.includes('Sarah'))];
// let saradogseating =
//   saradog.curFood > saradog.recommendedFood ? 'too musch' : 'too little';
// console.log(`${saradog.owners.join(' and ')} dog's eating ${saradogseating}`);

// let ownersEatTooMuch = dogs
//   .map(d => {
//     if (d.curFood > d.recommendedFood) return d.owners;
//   })
//   // .filter(v => v !== undefined)
//   .filter(Boolean)
//   .flat(2);

// let ownersEatTooLittledogs = dogs
//   .map(d => {
//     if (d.curFood < d.recommendedFood) return d.owners;
//   })
//   // .filter(v => v !== undefined)
//   .filter(Boolean)
//   .flat(2);

// console.log(ownersEatTooMuch.join(' and ') + ' dogs eat too much ');
// console.log(ownersEatTooLittledogs.join(' and ') + " dogs eat's too little");

// // Log to the console whether there is any dog eating exactly the amount of food
// // that is recommended (just true or false)
// // 6. Log to the console whether there is any dog eating an okay amount of food
// // (just true or false)
// // 7. Create an array containing the dogs that are eating an okay amount of food (try
// // to reuse the condition used in 6.

// console.log(
//   'exectly ammount of food ' + dogs.some(d => d.curFood === d.recommendedFood)
// );
// console.log(
//   'Okay ammount of food ' +
//     dogs.some(
//       d =>
//         d.curFood > d.recommendedFood * 0.9 &&
//         d.curFood < d.recommendedFood * 1.1
//     )
// );

// const okFood = dogs.filter(
//   d =>
//     d.curFood > d.recommendedFood * 0.9 && d.curFood < d.recommendedFood * 1.1
// );
// console.log(okFood);

// console.log(dogs);
// const ShallowCopydog = dogs
//   .slice()
//   .sort((a, b) => a.recommendedFood - b.recommendedFood);
// console.log(ShallowCopydog);
// ///-------------------------------SECTION 12-----------------------------///
// //-----------
// //JS ERROR
// console.log(0.1 + 0.2); //0.30000000000000004
// console.log(Number.parseInt('23h.4hpx'));
// console.log(Number.parseFloat('3.5px'));
// console.log(+Math.PI.toFixed(2));

// console.log(Number.isInteger(32.4));
// console.log(Number.isFinite(32.4));
// const arr = Array.from({ length: 5 }, (_, i) => {
//   let v = (Math.round(Math.random() * (i + 1)) * -1).toFixed(2);
//   return Number(v);
// });
// console.log(arr);
// console.log(Math.min(...arr));
// console.log(Math.max(...arr));
// console.log(arr[1].toFixed(2));
// let v = 3.4449;
// v = v.toFixed(2);
// console.log(+v);
// // console.log(Array.from({ length: 100 }, (_, i) => (i % 3 === 0 ? i : '_')));

// let a = '4.3_43_543';

// const b = a.split('_');
// console.log(b);
// console.log(b);
// console.log(+b.join('') + 1 + 1);
// console.log(a);

// console.log(2 ** 53 + 1);
// console.log(2 ** 53 + 2);
// console.log(2 ** 53 + 3);
// console.log(2 ** 53 + 4);
// console.log(2 ** 53 + 5);
// console.log(2 ** 53 + 6);
// console.log(2 ** 53 + 7);
// console.log(2 ** 53 + 2323);
// console.log(2 ** 53 + 8);
// console.log(2 ** 53 + 8);
// console.log(2 ** 53 + 8);
// console.log(BigInt(2 ** 53) + 80000000000000000000000000n);

// console.log('hamza ramay');
// console.log('--'.repeat(100));
// console.log(new Date('December 24,2015'));
// // console.log(new Date(10000 * 24 * 60 * 60 * 1000));

// console.log('-');
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getMonth());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime()); //timestsmps
// console.log(Date.now());
// future.setFullYear(2040);
// console.log(future);
// // future.
// const fromatedate = (date1, date2) =>
//   Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

// console.log(fromatedate(new Date(), new Date(account1.movementsDates[0])));
// console.log('---++++---++_=_+__');
// let num = 98232323232323.22;
// console.log(new Intl.NumberFormat('en-US').format(num));
// console.log(new Intl.NumberFormat('ur-PK').format(num));
// console.log(new Intl.NumberFormat().format(num));
// const options = {
//   style: 'currency',
//   currency: 'USD',
//   useGrouping: false,
//   // unit: '',
// };

// console.log(new Intl.NumberFormat(navigator.language, options).format(num));
// console.log('');
// console.log('');

// setInterval(() => console.log('hr 3 '), 3000);
