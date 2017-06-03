import * as types from '../constants/actiontypes';

export default function(state=null,action){
    switch(action.type){
        case types.GET_EVENTLIST:
            return Object.assign({}, state, {CurrentEvents: action.apiResult});
            break;
            
        case types.GET_EVENTLISTPAST: 
            return Object.assign({}, state, {PastEvents: action.apiResult});
            break;
        case types.CALENDAR_EVENTS: 
            return Object.assign({}, state, {CalendarEvents: action.apiResult});
            break;
        case types.CALENDAR_DATES: 
            return Object.assign({}, state, {CalendarDates: action.apiResult});
            break;
        case types.CALENDAR_DAY_EVENTS: 
            return Object.assign({}, state, {onDayEventDetails: action.apiResult});
            break;  
    }
    return state;
}