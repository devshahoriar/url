import moment from "moment";

const compareTime = (getDate) => {
   const currentDate = new Date();
   var beginningTime = moment(currentDate);
   var endTime = moment(getDate);
   return beginningTime.isBefore(endTime);
 }

 export default compareTime;