import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {
        case types.GET_DISCUSSION_CATEGORY_OBJECT:
        console.log("apiResult",action.apiResult);
             return Object.assign({}, state, {Category: action.apiResult});
            break;

 
          case types.GET_DISCUSSION_CATEGORY_DETAIL:
            console.log("detail apiResult",action.apiResult);
                 return Object.assign({}, state, {CatDetails: action.apiResult});
                break;
                case types.GET_DISCUSSION_CATEGORYLIST:
                console.log("api",action.apiResult);
                return Object.assign({},state, {CategorySearchList:action.apiResult});
                break;
                 case types.GET_SEARCH_CATEGORYLIST:
                 
            return Object.assign({},state, {SearchList:action.apiResult});
            break;

               
            
    }
    return state;
}