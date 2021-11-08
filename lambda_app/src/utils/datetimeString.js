// date time in to the database
export const toDBDateTimeString = (datetimeISOString) => {
    return new Date(datetimeISOString).toJSON().slice(0, 19).replace('T', ' ');
};

// date time out of the database
export const toDatetimeISOString = (datetimeDBString) => {
    const datetimeAsDBArray = datetimeDBString.split(/[- :]/).map((x) => parseInt(x));
    datetimeAsDBArray[1] = datetimeAsDBArray[1] - 1;

    return new Date(Date.UTC(...datetimeAsDBArray)).toISOString();
}