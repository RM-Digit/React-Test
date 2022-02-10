export const stringToDate = (str) => {
  if (str === '*') {
    return new Date(str);
  }

  const [month, year] = str.split('-');
  return new Date(`${month} 1 20${year}`);
};

export const dateToString = (d) => {
  if (isNaN(d.valueOf())) {
    return '*';
  }

  const [_, month, __, year] = d.toString().split(' ');
  return `${month.toUpperCase()}-${year.slice(2, 4)}`;
};

export const parseCSV = (str) => {
  let [headers, ...lines] = str.split(';\n');

  headers = headers.split(';');

  return lines.map((line) => {
    return line.split(';').reduce((acc, value, i) => {
      if (['ACCOUNT', 'DEBIT', 'CREDIT'].includes(headers[i])) {
        acc[headers[i]] = parseInt(value, 10);
      } else if (headers[i] === 'PERIOD') {
        acc[headers[i]] = stringToDate(value);
      } else {
        acc[headers[i]] = value;
      }
      return acc;
    }, {});
  });
};

export const toCSV = (arr) => {
  let headers = Object.keys(arr[0]).join(';');
  let lines = arr.map((obj) => Object.values(obj).join(';'));
  return [headers, ...lines].join(';\n');
};

export const parseUserInput = (str) => {
  const [startAccount, endAccount, startPeriod, endPeriod, format] = str.split(' ');

  return {
    startAccount: parseInt(startAccount, 10),
    endAccount: parseInt(endAccount, 10),
    startPeriod: stringToDate(startPeriod),
    endPeriod: stringToDate(endPeriod),
    format,
  };
};

export const isAccountBetween = (account, start = 0, end = Number.MAX_SAFE_INTEGER) => {
  if (!start) start = 0;
  if (!end) end = Number.MAX_SAFE_INTEGER;
  return account >= start && account <= end;
};

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

export const isDateBetween = (period, start, end = new Date()) => {
  if (!isValidDate(start)) start = new Date('1900-1-1');
  if (!end) end = new Date();

  return new Date(period) >= new Date(start) && new Date(period) <= new Date(end);
};

export const combineObj = (arr) => {
  var check = [],
    result = [];

  arr.forEach((item) => {
    if (!item.ACCOUNT) return;
    if (check.includes(item.ACCOUNT)) {
      const index = result.findIndex((x) => x.ACCOUNT === item.ACCOUNT);
      result[index].DEBIT += item.DEBIT;
      result[index].CREDIT += item.CREDIT;
      result[index].BALANCE += item.BALANCE;
    } else {
      check.push(item.ACCOUNT);
      result.push(item);
    }
  });
  result.sort((a, b) => a.ACCOUNT - b.ACCOUNT);
  return result;
};
