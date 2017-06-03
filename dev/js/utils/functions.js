let getFormSerializedData = (formId) =>{
  return $("#"+ formId).serializeArray();
}


export {getFormSerializedData};
