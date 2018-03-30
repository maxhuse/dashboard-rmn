import moment from 'moment';

export const getFormatDate = (timestamp) => {
  if (!timestamp) {
    return undefined;
  }

  return moment(timestamp, 'X').format('DD MMMM YYYY');
};

export const getFormatDateTime = (timestamp) => {
  if (!timestamp) {
    return undefined;
  }

  return moment(timestamp, 'X').format('DD MMMM YYYY HH:mm');
};

// If value is undefined or empty string, put a dash
export const beautifyCellValue = value => (
  value === undefined || value === '' || value === null ?
    '\u2014' :
    value
);
