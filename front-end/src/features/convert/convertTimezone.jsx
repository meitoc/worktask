export default function convertTimezone(timezone, datetimeString) {
    const date = new Date(datetimeString);
    const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    const convertedDate = new Date(utcDate.getTime() + (timezone * 3600000));
  
    const hours = convertedDate.getHours().toString().padStart(2, "0");
    const minutes = convertedDate.getMinutes().toString().padStart(2, "0");
    const seconds = convertedDate.getSeconds().toString().padStart(2, "0");
    const day = convertedDate.getDate().toString().padStart(2, "0");
    const month = (convertedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = convertedDate.getFullYear().toString();
  
    const convertedDatetimeString = `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
    return convertedDatetimeString;
  }
  