const state = {
    location: {},
    passenger: {
      adults: 2,
      infants: 0
    },
    datepicker: {},
    // flight: {}
  };
  
  export default (initalState = state, action) => {
    switch (action.type) {
      case "LOCATION_SELECTED":
        if(action.payload.hasOwnProperty('villa_name')){
          return {
            ...initalState,
          location: action.payload
          }
        } else if(action.payload.hasOwnProperty('destination')) {
          return {
            ...initalState,
            location: action.payload
          }
        } else if(action.payload.hasOwnProperty('resorts')) {
          return {
            ...initalState,
            location: action.payload
          }
        } else if(action.payload.hasOwnProperty('region')) {
          return {
            ...initalState,
            location: action.payload
          }
        } else if(action.payload.hasOwnProperty('region_group')) {
          return {
            ...initalState,
            location: action.payload
          }
        } else if(action.payload.hasOwnProperty('location')) {
          return {
            ...initalState,
            location: action.payload
          }
        } else if(action.payload.hasOwnProperty('query')) {
          return {
            ...initalState,
            location: action.payload
          }
        } else {
          return {
            ...initalState,
            location: action.payload
          }
        }
      case "PASSENGER":
        let passenger = {"passenger":{adults: action.payload.adults,infants: action.payload.infants}}
        return {
          ...initalState,
          ...passenger
        };
      case "DATE":
        let datepicker;
        if(action.payload.hasOwnProperty('yearMonth')){
          datepicker = {
            datepicker: {
              yearMonth: action.payload.yearMonth
            }
          };
        }else if(action.payload.hasOwnProperty('start_date')){
          datepicker = {
            datepicker: {
              start_date: action.payload.start_date,
              end_date: action.payload.end_date
            }
          };
        }else{
          datepicker = {
            datepicker: {}
          }
        }
        
        return Object.assign({}, initalState, datepicker);
      // case "FLIGHT":
        // return {
        //   ...initalState,
        //   flight: action.payload
        // };
        
      default:
        return {...initalState};
    }
  };
  