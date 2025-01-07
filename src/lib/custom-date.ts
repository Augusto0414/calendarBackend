import moment from "moment";
export const isDate = (value: any): boolean => {
  if (!value) {
    return false;
  }

  const date = moment(value);
  return date.isValid();
};
