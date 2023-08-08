// export default function getDayRange(start, end) {
//     let today = new Date();
  
//     function addDays(date, days) {
//       var result = new Date(date);
//       result.setDate(result.getDate() + days);
//       return result;
//     }
//     function subDays(date, days) {
//       var result = new Date(date);
//       result.setDate(result.getDate() - days);
//       return result;
//     }
  
//     let dayDiff = Math.floor((today - subDays(start, 3)) / (1000 * 3600 * 24));
  
//     switch (dayDiff) {
//       case 1:
//         return [subDays(start, 2), addDays(end, 3)];
//       case 2:
//         return [subDays(start, 1), addDays(end, 3)];
//       case 3:
//         return [subDays(start, 0), addDays(end, 3)];
//       default:
//         return [subDays(start, 3), addDays(end, 3)];
//     }
//   }
  
export default function getDayRange(start, end) {
    let today = new Date();
  
    function subDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() - days);
      return result;
    }
  
    let dayDiff = Math.floor((today - subDays(start, 3)) / (1000 * 3600 * 24));
  
    switch (dayDiff) {
      case 1:
        return 2
      case 2:
        return 1;
      case 3:
        return 0;
      default:
        return 3;
    }
  }
