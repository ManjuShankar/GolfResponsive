import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';
/*get GolfTravel category*/
let getGolfTravelCategory=(token)=>{
    const url=SERVICE_URLS.GET_GOLFTRAVEL_LIST;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apicategoryListRequest=axios.get(url,config);

    return(dispatch)=>{
        return apicategoryListRequest.then(({data})=>{
           
            dispatch({type:types.GET_GOLFTRAVEL_CATEGORY,apiResult:data});
        }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }   
           throw(error);  

        });
    }
};
let getGolfTravelCategoryObject = (categoryId, token) =>{
   const url = SERVICE_URLS.GOLFTRAVEL_CATEGORY_OBJECT + categoryId + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };
console.log("categoryId",categoryId);
const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
         
          dispatch({type:types.GET_GOLFTRAVEL_CATEGORY_OBJECT,apiResult:data});
          return data;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
}
let getGolfTravelCategoryDetails = (categoryId, token) =>{

   const url = SERVICE_URLS.GOLFTRAVEL_DETAILS + categoryId + '/details/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
         
          dispatch({type:types.GET_GOLFTRAVEL_CATEGORY_DETAIL,apiResult:data});
          return data;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
}
let addNewGolfTravelCategory=( token, name)=>{
 
    const url=SERVICE_URLS.GOLFTRAVEL_ADD_CATEGORY;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apiCategoryRequest=axios.post(url, {name:name}, config);

    return(dispatch)=>{
        return apiCategoryRequest.then(({data})=>{
         
        }).catch((error)=>{
            throw(error);
        });
    }
};
let addNewGolfTravelCategoryPost=(id, token, subject_line)=>{
 
    const url=SERVICE_URLS.GOLFTRAVEL_ADD_POST +id+'/?format=json';
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apiCategoryRequest=axios.post(url, {subject_line:subject_line}, config);

    return(dispatch)=>{
        return apiCategoryRequest.then(({data})=>{
           console.log("data",data);
           // dispatch({type:types.GET_FORUM_COURSES,apiResult:data});
        }).catch((error)=>{
            throw(error);
        });
    }
};
let addGolfTravelCategoryComment=(categoryId, id,token,body)=>{
  
  const url=SERVICE_URLS.GOLFTRAVEL_CATEGORY_COMMENT + categoryId +'/'+ id + '/comments/';
  console.log("conversationId", id);
   var config = {
    headers: {'Authorization':'Token '+token}
  };
   const apiCommentRequest = axios.post(url, { body: body}, config);
   console.log("body",body);
    return(dispatch)=>{
      return apiCommentRequest.then(({data})=>{
        
        toastr.success("Comment Added Successfully");
     
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}
let searchGolfTravelCategoryPosts = (token, cid, keyword) =>{
 
  console.log("SearchPosts", token, keyword);
  const url = SERVICE_URLS.GOLFTRAVEL_CATEGORY_POST_SEARCH + cid+ '/search' + '/?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiPostRequest = axios.get(url, config);
return(dispatch) => {
       return apiPostRequest.then(({data})=>{
        console.log("data",data);
         dispatch({type:types.GET_GOLFTRAVEL_CATEGORYLIST,apiResult:data});
       }).catch((error)=>{
           throw(error);
       });
   }
}
let searchCategory = (token, keyword) =>{
 
  const url = SERVICE_URLS.SEARCH_GOLF_CATEGORY + '?format=json&kw='+keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {

       return apiCourseRequest.then(({data})=>{
        console.log("data",data);
         dispatch({type:types.GET_GOLF_SEARCH_CATEGORYLIST,apiResult:data});
       }).catch((error)=>{
           throw(error);
       });
   }
}
export {getGolfTravelCategory,  getGolfTravelCategoryObject, getGolfTravelCategoryDetails, addNewGolfTravelCategory, addNewGolfTravelCategoryPost,
  addGolfTravelCategoryComment, searchGolfTravelCategoryPosts, searchCategory};
