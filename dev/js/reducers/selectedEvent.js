import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {
        case types.GET_SELECTED_EVENT:
            return action.apiResult;
            break;
             case types.GET_ATTENDEES: 
            return Object.assign({}, state, {attendeesList: action.apiResult});
            break;
    }
    return state;
}
