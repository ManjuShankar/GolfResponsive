import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';
import axios from 'axios';
import toastr from 'toastr';


let createEvents=(formData, token)=>{
    const url=SERVICE_URLS.CREATEEVENT_API;
     var config = {headers: {'Authorization':'Token '+token}};

    const apiCreateEventRequest = axios.post(url, formData, config);
    return(dispatch)=>{
      return apiCreateEventRequest.then(({data})=>{
        console.log("data",data);
        toastr.success("Event Created Succefully");
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
  }
};


let editEvents=(formData, id, token)=>{
    const url=SERVICE_URLS.EDITEVENT_API + id + '/' ;
     var config = {headers: {'Authorization':'Token '+token}};

    const apiCreateEventRequest = axios.put(url, formData, config);
    return(dispatch)=>{
      return apiCreateEventRequest.then(({data})=>{
        toastr.success("Event Updated Succefully");
        }).catch((error)=>{
          toastr.error(error);
          if (error.response) {
                console.log(error.response.data);
          } else {
              console.log('Error', error.message);
        }
          throw(error);
        });
  }
};

export {createEvents, editEvents};
