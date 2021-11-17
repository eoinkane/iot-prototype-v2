// date time in to the database
export const toDBDateTimeString = (datetimeISOString) => {
  return new Date(datetimeISOString).toJSON().slice(0, 19).replace('T', ' ');
};

// date time out of the database
export const toDatetimeISOString = (datetimeDBString) => {
  const datetimeAsDBArray = datetimeDBString
    .split(/[- :]/)
    .map((x) => parseInt(x));

  return new Date(
    Date.UTC(
      datetimeAsDBArray[0],
      datetimeAsDBArray[1],
      datetimeAsDBArray[2],
      datetimeAsDBArray[3],
      datetimeAsDBArray[4],
      datetimeAsDBArray[5]
    )
  ).toISOString();
};
