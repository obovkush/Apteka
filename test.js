const end = '2022-04-17';

const day = Number(new Date().getDate());
const rightDay = (day < 10) ? `0${day}` : day;
const month = Number((new Date().getMonth()) + 1);
const rightMonth = (month < 10) ? `0${month}` : month;
console.log(rightMonth);
const year = Number(new Date().getFullYear());
const now = `${year}-${rightMonth}-${rightDay}`;
console.log('now', now);

const start = '2022-04-11';
// const startDate = start.slice(8);
// const startMonth = start.slice(5, 7);
// const startYear = start.slice(0, 4);
console.log(start);

console.log(start < now);
console.log(end > now);
console.log (start < now && end > now);
