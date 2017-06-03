import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import _ from "lodash";
import toastr from 'toastr';

let getCurrentEvent = (eventId, token) =>{
   const url = SERVICE_URLS.GET_EVENT_OBJECT + eventId + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiEventRequest = axios.get(url, config);
return(dispatch) => {
        return apiEventRequest.then(({data})=>{
          dispatch({type:types.GET_SELECTED_EVENT,apiResult:data});
          return data;
        }).catch((error)=>{
           if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);

        });
    }
}


let getCurrentEventDetails = (eventId, token) =>{
  console.log("EVENT Id", eventId, token);
  let id=_.toInteger(eventId);
   const url = SERVICE_URLS.GET_EVENT_OBJECT + id  + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiEventRequest = axios.get(url, config);
return(dispatch) => {
        return apiEventRequest.then(({data})=>{
          return data;
        }).catch((error)=>{
          if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);
        });
    }
}

let getpastEventsList = (url, conf) =>{
    return axios.get(url, conf);
}

let getcurrentEventsList = (url, conf) =>{
  return axios.get(url, conf);
}

let eventDetails=(token, id=0, eventsType="")=>{
    let currentEventListUrl, pastEventListUrl;

    if(id!=0){
      if(eventsType=="course"){
         currentEventListUrl= SERVICE_URLS.GET_COURSE_OBJECT + id + '/events/upcoming';
         pastEventListUrl = SERVICE_URLS.GET_COURSE_OBJECT + id + '/events/past';
      }
    }else{
       currentEventListUrl=SERVICE_URLS.EVENTLIST_API;
       pastEventListUrl=SERVICE_URLS.EVENTLISTPAST_API;
    }
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apiRequest = axios.all([getpastEventsList(pastEventListUrl, config), getcurrentEventsList(currentEventListUrl, config)]);
    return(dispatch)=>{
         return apiRequest.then(axios.spread(function (past, current) {
                dispatch({type:types.GET_EVENTLIST,apiResult:current.data});
                dispatch({type:types.GET_EVENTLISTPAST,apiResult:past.data});
          })).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
             }
            throw(error);

    });
  }
};

let getCurrentEventsDetailsList = (token) =>{
    const currentEventListUrl=SERVICE_URLS.EVENTLIST_API;
    var config = {
    headers: {'Authorization':'Token '+token}
    };

    const apiRequest = axios.get(SERVICE_URLS.EVENTLIST_API, config);
    return(dispatch)=>{
        return apiRequest.then(({data})=>{
            dispatch({type:types.GET_EVENTLIST,apiResult:data});
        }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
                }
           throw(error);

        });
    }
}

let getAttendeesList = (token, eventId) =>{
  debugger;
    const attendeesUrl=SERVICE_URLS.GET_ATTENDEES+'/eventId'+'/attendees/';
    var config = {
    headers: {'Authorization':'Token '+token}
    };

   const apiRequest = axios.get(attendeesUrl, config);
    return(dispatch)=>{
        return apiRequest.then(({data})=>{
            dispatch({type:types.GET_ATTENDEES,apiResult:data});
        }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
                }
           throw(error);

        });
    }
}

let calendarEvents = (token) =>{
  const url = SERVICE_URLS.CALENDAR_EVENTS;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiCourseRequest = axios.get(url,config);
  return(dispatch) => {
           return apiCourseRequest.then(({data})=>{
            console.log("calendarEvents", data);
            dispatch({type:types.CALENDAR_DATES ,apiResult:data});
         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }
            throw(error);
         });
     }
}

let calendarDates = (token, month, year) =>{
 const url = SERVICE_URLS.CALENDAR_EVENTS+'/?format=json'+'&month='+month+'&year='+year;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

 const apiCourseRequest = axios.get(url,config);
  return(dispatch) => {
           return apiCourseRequest.then(({data})=>{
             console.log("calendarDates", data);
             dispatch({type:types.CALENDAR_DATES ,apiResult:data});
         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }
            throw(error);
        });
     }
}

let onDayEvents = (token, eventdate) =>{
 const url = SERVICE_URLS.CALENDAR_DAY_EVENTS+'?&date='+eventdate;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

 const apiCourseRequest = axios.get(url,config);
  return(dispatch) => {
           return apiCourseRequest.then(({data})=>{
           dispatch({type:types.CALENDAR_DAY_EVENTS ,apiResult:data});

         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }
            throw(error);
        });
     }
}

export {eventDetails, getCurrentEvent, getCurrentEventsDetailsList, getCurrentEventDetails, getAttendeesList,
  calendarEvents, calendarDates,onDayEvents};
