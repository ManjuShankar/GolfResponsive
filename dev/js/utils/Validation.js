var validator = require('validator');
import toastr from 'toastr';

toastr.options = {
  "preventDuplicates": true,
   "closeButton": true,
   "progressBar": false,
   "positionClass": "toast-bottom-full-width"
}

let isvalidLogin = (formData) =>{
  let result = {};
  formData.map(function(item, index){
    if(validator.isEmpty(item.value)){
      result[item.name] = "Please enter value";
    }
});
return result;
}

let isEventsValid = (value) =>{
   if(!validator.isNumeric(value)){
     toastr.error("Please enter numeric value for ZIP CODE","Failure");
   }
    else {
      return;
    }
  }


let isValidEmail = (data) =>{
  let isValid = validator.isEmail(data);
  return isValid;
}


export {isvalidLogin, isEventsValid, isValidEmail};
