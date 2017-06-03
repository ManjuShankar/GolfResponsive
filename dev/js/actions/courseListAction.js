import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';

let unFollowCourse = (token, courseId) =>{
  const url = SERVICE_URLS.COURSE_UNFOLLOW + courseId + '/follow';
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiCourseRequest = axios.get(url,config);
  return(dispatch) => {
         return apiCourseRequest.then(({data})=>{
           dispatch({type:types.FOLLOW_UNFOLLOW_TOGGLE ,apiResult:data});
         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }   
           throw(error);  
     
         });
     }
}



let searchCourses = (token, keyword, pageNumber) =>{

 let url, dispatchType;
 if(keyword){
        url= 'http://52.45.249.118:8080/api/courses/old?kw='+keyword+'&page=' +  _.toNumber(pageNumber);
         dispatchType = types.GET_COURSELIST_APPEND;
      }
  //const url = SERVICE_URLS.SEARCH_COURSES + '?format=json' + '&kw=' + keyword +'&page='+pageNumber ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
       return apiCourseRequest.then(({data})=>{

         dispatch({type:types.GET_COURSELIST,apiResult:data.results});
       }).catch((error)=>{
         if(error != "Error: Request failed with status code 401"){
         toastr.error(error);
          }   
           throw(error);  
     
       });
   }
}

let courseList=(token, pageNumber=0,  keyword="")=>{
  console.log(pageNumber, "Action Ket", keyword);
      var config = {
        headers: {'Authorization':'Token '+token}
      };
      let url, dispatchType;
      if(pageNumber==0){
         url=SERVICE_URLS.GETCOURSE_API;
         dispatchType = types.GET_COURSELIST;
      } 
     
      else{
         url= 'http://52.45.249.118:8080/api/courses/old?format=json&page=' +  _.toNumber(pageNumber)+'&kw='+keyword;
         console.log("keyword", keyword, "size", _.size(keyword));
         /*if(keyword){
          dispatchType = types.GET_COURSELIST;
         }
         else{*/
          dispatchType = types.GET_COURSELIST_APPEND;
        ///}
      }

   
    const apicourseListRequest=axios.get(url,config);

    return(dispatch)=>{
        return apicourseListRequest.then(({data})=>{
            dispatch({type:dispatchType, apiResult: data.results});
            return data.next;

        }).catch((error)=>{
          if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }   
           throw(error);  
     
        });
    }
};
let EventcourseList=(token)=>{
    const url=SERVICE_URLS.GETCOURSE_API;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apicourseListRequest=axios.get(url,config);

    return(dispatch)=>{
        return apicourseListRequest.then(({data})=>{
            return data.results;
        }).catch((error)=>{
          if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }   
           throw(error);  
     
        });
    }
};
let getCourseObject = (courseId, token) =>{
   const url = SERVICE_URLS.GET_COURSE_OBJECT + courseId + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };
const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
          dispatch({type:types.GET_SELECTED_COURSE,apiResult:data});
          return data;
        }).catch((error)=>{
          if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }   
            throw(error);
        });
    }
}



let getEventCourseObject = (courseId, token) =>{
   const url = SERVICE_URLS.GET_COURSE_OBJECT + courseId + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };
const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
          return data.course;
        }).catch((error)=>{
           if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }   
           throw(error);  
     
        });
    }
}
let getCurrentEventsDetailsList = (token,id) =>{
   
    const currentEventListUrl=SERVICE_URLS.EVENTLIST_COURSE + id +'/events/upcoming?format=json';
    var config = {
    headers: {'Authorization':'Token '+token}
    };
 
    const apiRequest = axios.get(currentEventListUrl, config);
    return(dispatch)=>{
        return apiRequest.then(({data})=>{
          console.log("current event data",data);
            dispatch({type:types.GET_COURSE_UEVENTLIST,apiResult:data});
        }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
                }   
           throw(error);  
     
        });
    }
}
let getPastEventsDetailsList = (token,id) =>{
   
    const currentEventListUrl=SERVICE_URLS.EVENTLIST_COURSE_PAST + id +'/events/past?format=json';
    var config = {
    headers: {'Authorization':'Token '+token}
    };
 
    const apiRequest = axios.get(currentEventListUrl, config);
    return(dispatch)=>{
        return apiRequest.then(({data})=>{
            dispatch({type:types.GET_COURSE_PEVENTLIST,apiResult:data});
        }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
                }   
           throw(error);  
     
        });
    }
}
let groupList=(token, id)=>{
 
    const url=SERVICE_URLS.GET_COURSE_GROUPS_LIST+ id +'/groups/?format=json';
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDetailsRequest=axios.get(url,config);

    return(dispatch)=>{
        return apigroupDetailsRequest.then(({data})=>{
            dispatch({type:types.GET_COURSE_GROUPS,apiResult:data});
        }).catch((error)=>{
         if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }   
           throw(error);  
     
        });
    }
};
export {courseList, getCourseObject, searchCourses, unFollowCourse, EventcourseList,
 getEventCourseObject, getCurrentEventsDetailsList, getPastEventsDetailsList, groupList};
