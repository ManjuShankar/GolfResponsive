import React,{ Component } from 'react';
import _ from 'lodash';
import {render} from 'react-dom';
import {EventcourseList, getEventCourseObject, courseList}  from '../../actions/courseListAction';
import {getFormSerializedData} from "../../utils/functions";
import {oldgroupList} from '../../actions/groupListAction';
var serialize = require('form-serialize');
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import Select from 'react-select';

class CreateEvent extends React.Component {
     constructor(props) {
       super(props);
       this.state={
           upComingeventDetail: (this.props.isCreateOrEdit=="Edit")?(this.props.upComingeventDetail):({}),
           eventsImage:'',
           getCourseslist:Object.assign([],props.getCourseList),    
           getGroupList: [],
           eventsImageObj:{},
           isExistCourseDetails: (this.props.isCreateOrEdit=="Edit")?(this.props.upComingeventDetail.venue_course_id!=null?true:false):(false),
           isExistGroupDetails:(this.props.isCreateOrEdit=="Edit")?(this.props.upComingeventDetail.event_group_id!=null?true:false):(false),
           titleName: "", venueName:"", address:"", city:"", zip:"",
           errTitle:"",dateErr:"",dateInvalid1:"",dateInvalid1:"",
           buttonDisabled : true,   selectedValue:'', selectedName:'', other:["Other"]
       };
        this.onFieldChange=this.onFieldChange.bind(this);
        this.uploadFile=this.uploadFile.bind(this);
        this.uploadTeatTimes=this.uploadTeatTimes.bind(this);
    }

    onFieldChange(e){
 
      document.getElementsByName(e.target.name).value=e.target.value;
    }

     uploadTeatTimes(e) {
       e.preventDefault();
           var fd = new FormData();
           var that = this;
           fd.append('file', document.getElementById('teatime').files[0]);
           $.ajax({
               url: 'http://52.45.249.118:8080/api/events/upload-teetime-file/',
               data: fd,
               processData: false,
               contentType: false,
               type: 'POST',
               headers:{
               'Authorization':'Token '+ this.props.activeUser.token
              },
               success: function(data){

                 that.setState({teetime_file:data.id});
               },
               error: function(){
                  console.log("Error");
               }
           });

       }
       componentWillMount(){
        this.props.EventcourseList(this.props.activeUser.token).then((data)=>{
            this.setState({getCourseslist:data});
        }).catch((error)=>{
        });
this.props.courseList(this.props.activeUser.token).then(()=>{
            this.setState({getCourseslist:this.props.getCourseList});
            
        }).catch((error)=>{
        });
        this.props.oldgroupList(this.props.activeUser.token).then((data)=>{

              this.setState({getGroupList:data});
        }).catch((error)=>{
        });
        if(this.props.isCreateOrEdit=="Edit"){

        this.setState({selectedValue:this.props.selectedEvent.venue_course_id});
        }

    }

componentWillReceiveProps(nextProps){
        if(this.props.getCourseList!=nextProps.getCourseList){
            this.setState({getCourseslist:nextProps.getCourseList});
            
        }
      }
     showCourseDetails(e){
        
this.setState({selectedValue:e.id});
this.setState({selectedName:e.name});
        console.log("selectedName",this.state.selectedName);
      //if(e.target!=undefined && e.target.value!="-1"){
           let id=e.id;
           this.props.getEventCourseObject(id, this.props.activeUser.token).then((data)=>{
              let eventDetailsUpdated = this.state.upComingeventDetail;
              eventDetailsUpdated.address1 = data.address1;
              eventDetailsUpdated.city = data.city;
              eventDetailsUpdated.zip_code = data.zip_code;
              this.setState({upComingeventDetail:eventDetailsUpdated});
           }).catch((error)=>{

          });
       // }
     }

    uploadFile(e) {
      e.preventDefault();
           var fd = new FormData();
           var that = this;
           fd.append('image', document.getElementById('file').files[0]);
           $.ajax({
               url: 'http://52.45.249.118:8080/api/events/upload-cover-image/',
               data: fd,
               processData: false,
               contentType: false,
               type: 'POST',
               headers:{
               'Authorization':'Token '+ this.props.activeUser.token
              },
               success: function(data){
                 that.setState({eventsImage: data.image, eventsImageObj:data});

               },
               error: function(){
                  console.log("Error");
               }
           });

       }

onSubmitClick(){
    var form = document.querySelector('#eventsForm');
    var formData = serialize(form, { hash: true });
    


    
    if((formData['name'] == "") || (formData['name'] == undefined)) {
        this.refs.name.focus();

    }
    else if((this.refs.is_course.checked == true) && (this.refs.coursesList.value == "-1")){
          
          this.refs.coursesList.focus();
    } 
    else if( (this.refs.is_course.checked != true) && ((formData['venue'] == "") || (formData['venue'] == undefined)) ){
         
          this.refs.venue.focus();
     }  

    else if( (this.refs.is_course.checked != true) &&((formData['address1'] == "") || (formData['address1'] == undefined)) ) {
        this.refs.address1.focus();
    }
    else if ( (this.refs.is_course.checked != true) && ((formData['city'] == "") || (formData['city'] == undefined))) {
        this.refs.city.focus();
    }
    else if( (this.refs.is_course.checked != true) && ((formData['zip_code'] == "") || (formData['zip_code'] == undefined)) ) {
         this.refs.zip_code.focus();
    }

    else if((formData['start_time'] == null) || (formData['start_time'] == undefined)){
        this.refs.start_time.focus();
    }
    else if((formData['end_time'] == null) || (formData['end_time'] == undefined)){
        this.refs.end_time.focus();
    }
    else if((formData['start_date'] == null) || (formData['start_date'] == undefined)){
        this.refs.start_date.focus();
    }
    else if((formData['end_date'] == null) || (formData['end_date'] == undefined) || this.state.dateErr ){
        this.refs.end_date.focus();
    }

     else if((formData['description'] == "") || (formData['description'] == undefined)){
        this.refs.description.focus();
    }
  
    else{

     _.set(formData, 'teetime_file', this.state.teetime_file);
    _.set(formData, 'cover_image', this.state.eventsImageObj.id);
    if(this.state.isExistCourseDetails)
    {

      var selectedCourseId= this.state.selectedValue;
      //var test = $(".Select-value-label").text();
      var test2 =document.getElementsByClassName("couresList");
     
      

     
      let selectedCourseName= "venue";
console.log("selectedCourseId",selectedCourseId);
      _.set(formData, 'venue_course', selectedCourseId);
      _.set(formData, 'venue', selectedCourseName);
       _.set(formData,'address1',this.state.upComingeventDetail.address1);
       _.set(formData,'city',this.state.upComingeventDetail.city);
       _.set(formData,'zip_code',this.state.upComingeventDetail.zip_code);
    }
    if(this.state.isExistGroupDetails){
      let selectedGroupId=document.getElementById('group_id').value;
      _.set(formData, 'group_id', _.toInteger(selectedGroupId));
    }
    console.log("formdata",formData);
    this.props.onSaveClick(formData);
}
}

colpseTgl(e){
    this.setState({isExistCourseDetails:!this.state.isExistCourseDetails});
    
       this.refs.address1.value = "";this.refs.city.value = "";this.refs.zip_code.value = "";
    
}

groupcolapseTgl(){
  this.setState({isExistGroupDetails:!this.state.isExistGroupDetails});
}

zipCodeEvent(e) {
    const re = /[0-9]+/g;
    if ((!re.test(e.key)) || (e.target.value.length >= 7))
    {
        e.preventDefault();
    }
}

 dateVal(e){
   
     var from = $("#start_date").val();
     var to = $("#end_date").val();


    if(e.target.name== "start_date"){
        if(from != ""){
        this.setState({
            dateInvalid1 : ""
        });
    }
    else{
    this.setState({
            dateInvalid1 : (<span className="color-red">Please enter valid date</span>)       
        });
    }    
    }
    if(e.target.name == "end_date"){
    if(to != ""){
    this.setState({
            dateInvalid2 : ""
    });
    }
    else{
    this.setState({
            dateInvalid2 : (<span className="color-red">Please enter valid date</span>)       
    });
    }
    }
 
    if((Date.parse(from) > Date.parse(to)) || this.refs.end_date.value == undefined){
    console.log("Invalid Date Range");
     this.setState({
        dateErr : (<span className="color-red">End date should be greater than Start Date</span>)
    });
}
else{
    this.setState({
        dateErr : ""
    });
}

}

    render(){

        let {upComingeventDetail, isCreateOrEdit, onSaveClick, activeUser, isSaveInProgress} = this.props;
        return(

            <div>
            <form action="" method="post" id="eventsForm" name="eventsForm" ref="eventsForm"  encType="multipart/form-data" >
            <div className="col-sm-8 eventScroll pdtop">

            <div className="coursesContent">
            <div className="eventImage">

                {((isCreateOrEdit=="Create" || isCreateOrEdit=="Edit") && this.state.eventsImage=='')?((upComingeventDetail.cover_image!=undefined && upComingeventDetail.cover_image!=null)?((upComingeventDetail.cover_image.height>=103 && upComingeventDetail.cover_image.width>=725)?(<img src={'http://' + upComingeventDetail.cover_image.image} className="eventImg" />):(
                <div className="hero">
                      <img className="hero__background" src={'http://' + upComingeventDetail.cover_image.image} />
                      <center><img className="hero__image"  src={'http://' + upComingeventDetail.cover_image.image} /></center>
                       <button className="btn btn-default editeventImg">
                <span className="glyphicon glyphicon-pencil"></span> Add Event Image
                </button>
                <input ref="file" id="file" type="file" name="file" onChange={this.uploadFile} className="upload-file form-control" accept="image/*" />
                 </div>
               )):(<div><img src="/assets/img/4th_july.jpg" className="eventImg" />
               <button className="btn btn-default editeventImg">
                <span className="glyphicon glyphicon-pencil"></span> Add Event Image
                </button>
                <input ref="file" id="file" type="file" name="file" onChange={this.uploadFile} className="upload-file form-control" accept="image/*" /></div>)):(<div><img src={'http://'+this.state.eventsImage} className="eventImg" /> <button className="btn btn-default editeventImg">
                <span className="glyphicon glyphicon-pencil"></span> Add Event Image
                </button>
                <input ref="file" id="file" type="file" name="file" onChange={this.uploadFile} className="upload-file form-control" accept="image/*" /></div>)}
               
            </div>
            <div className="col-sm-12">

              <div className="form-group row">
            <label  className="col-sm-2 col-form-label">Title:<span className="txtRed">*</span></label>
            <div className="col-sm-10">
            <input className="form-control" maxLength="100" type="text" id="example-text-input" ref="name"  name="name" defaultValue={this.state.upComingeventDetail.name} />
            {this.state.errTitle}
            </div>
           </div>
           <div className="form-group row">
            <label  className="col-sm-7 col-form-label">Is your event at a golf course?</label>
            <div className="col-sm-4">
              <label  className="switch">
                <input type="checkbox" name="is_course" ref="is_course" defaultChecked={this.state.isExistCourseDetails} onChange={this.colpseTgl.bind(this)}/>
                <div className="slider round"></div>
              </label>
            </div>

           </div>

            {(!(this.state.isExistCourseDetails))?(<div><div className="form-group row" id="VenueDiv">
                <label  className="col-sm-2 col-form-label">Venue:<span className="txtRed">*</span></label>
                <div className="col-sm-10">
                    <input className="form-control" maxLength="150" type="text" id="example-text-input" ref="venue" name="venue" defaultValue={this.state.upComingeventDetail.venue}  />
                </div>
            </div>
            <div className="form-group row">
              <label  className="col-sm-2 col-form-label">Address:<span className="txtRed">*</span></label>
              <div className="col-sm-10">
                <input className="form-control" maxLength="500" type="text" id="example-text-input" ref="address1" name="address1" defaultValue={this.state.upComingeventDetail.address1}   />
              </div>
            </div>
            <div className="form-group row">
                <label  className="col-sm-2 col-form-label">City:<span className="txtRed">*</span></label>
                <div className="col-sm-2 dateInputDiv">
                    <input className="form-control" maxLength="100" type="text" id="example-text-input" ref="city" name="city" defaultValue={this.state.upComingeventDetail.city}  />
                </div>
                <div className="col-sm-2 dateLabelDiv">
                        <label  className="col-sm-12 col-form-label">Zip code:<span className="txtRed">*</span></label>
                </div>
                <div className="col-sm-2 dateInputDiv pdngryt0px">
                  <input className="form-control" type="text" id="example-text-input" ref="zip_code" name="zip_code" defaultValue={this.state.upComingeventDetail.zip_code} onKeyPress={this.zipCodeEvent.bind(this)}  />
               </div>
           </div></div>):(<div>
             <div className="form-group row">
             <label  className="col-sm-2 col-form-label">Venue:<span className="txtRed">*</span></label>
             <div className="col-sm-10">
                <label className="col-sm-12 zeroPad">
                {/* {(this.props.isCreateOrEdit=="Edit")?<select  className="form-control" 
                  defaultValue={(this.state.upComingeventDetail!=null)?(this.state.upComingeventDetail.venue_course_id):("-1")} 
                  ref="coursesList" id="coursesList" onChange={this.showCourseDetails.bind(this)} >
                    <option value="-1">Please Select Course...</option>
                    {this.state.getCourseslist!=null && this.state.getCourseslist.map((item, i) => {
                          return(
                          <option value={item.id} key={i} className="selection">{item.name}</option >);
                      })}
                  </select>:*/}
                  
                  {(_.size(this.props.getCourseList)>0)?(<Select
                  name="couresList"
                  value={this.state.selectedValue} labelKey="name" valueKey="id"
                  options={this.props.getCourseList}
                  
                  ref="coursesList" id="coursesList" onChange={this.showCourseDetails.bind(this)}
                    />):(<span></span>)}
                   </label>
              </div>
              </div>
           <div className="form-group row">
             <label  className="col-sm-2 col-form-label">Address:<span className="txtRed">*</span></label>
             <div className="col-sm-10">
               <input className="form-control" maxLength="500" type="text" id="example-text-input" ref="address1" name="address1" value={this.state.upComingeventDetail.address1} disabled/>
             </div>
           </div>
           <div className="form-group row">
               <label  className="col-sm-2 col-form-label">City:<span className="txtRed">*</span></label>
               <div className="col-sm-2 dateInputDiv">
                   <input className="form-control" maxLength="100"type="text" id="example-text-input" ref="city" name="city" value={this.state.upComingeventDetail.city} disabled/>
               </div>
               <div className="col-sm-2 dateLabelDiv">
                       <label  className="col-sm-12 col-form-label">Zip code:<span className="txtRed">*</span></label>
               </div>
               <div className="col-sm-2 dateInputDiv pdngryt0px">
                 <input className="form-control" type="text" id="example-text-input" name="zip_code" ref="zip_code" value={this.state.upComingeventDetail.zip_code} onKeyPress={this.zipCodeEvent.bind(this)} disabled/>
               </div>
            </div></div>)}
            <div className="form-group row">
            <label  className="col-sm-2 col-form-label">Time:<span className="txtRed">*</span></label>
            <div className="col-sm-2 dateInputDiv">
            <input className="form-control" type="time" id="example-text-input" ref="start_time" name="start_time" defaultValue={this.state.upComingeventDetail.start_time} />
            </div>
                    <div className="col-sm-2 dateLabelDiv">
                        <label  className="col-sm-12 col-form-label">To:<span className="txtRed">*</span></label>
                    </div>
                    <div className="col-sm-2 dateInputDiv pdngryt0px">
            <input className="form-control" type="time" id="example-text-input" ref="end_time" name="end_time" defaultValue={this.state.upComingeventDetail.end_time} />
            </div>
           </div>
                <div className="form-group row">
            <label  className="col-sm-2 col-form-label">Start Date:<span className="txtRed">*</span></label>
            <div className="col-sm-2 dateInputDiv">
            <input className="form-control" type="date" id="start_date" ref="start_date" name="start_date" placeholder="mm/dd/yyyy" defaultValue={moment(this.state.upComingeventDetail.start_date_format, 'MM/DD/YYYY').format('YYYY-MM-DD')} onBlur={this.dateVal.bind(this)}/>
            {this.state.dateInvalid1}
            </div>
                    <div className="col-sm-2 dateLabelDiv ">
                        <label  className="col-sm-12 col-form-label">End Date:<span className="txtRed">*</span></label>
                    </div>
            <div className="col-sm-2 dateInputDiv pdngryt0px">
            <input className="form-control" type="date" id="end_date" ref="end_date" name="end_date" placeholder="mm/dd/yyyy" defaultValue={moment(this.state.upComingeventDetail.end_date_format, 'MM/DD/YYYY').format('YYYY-MM-DD')} onBlur={this.dateVal.bind(this)}/>
             {this.state.dateInvalid2}
            {this.state.dateErr}
            </div>
           </div>
          {(_.size(this.state.getGroupList)>0)?(<div><div className="form-group row">
            <label  className="col-sm-7 col-form-label">Is this event for a Group?</label>
            <div className="col-sm-4">
              <label  className="switch">
                <input type="checkbox" defaultChecked={this.state.isExistGroupDetails} onChange={this.groupcolapseTgl.bind(this)}/>
                <div className="slider round"></div>
              </label>
            </div>
           </div>
          {((this.state.isExistGroupDetails))?(<div className="form-group row">
           <label name="group" className="col-sm-2 col-form-label">Group:<span className="txtRed">*</span></label>
           <div className="col-sm-10">
              <label   className="col-sm-12 zeroPad">
                <select className="form-control" id="group_id"  name="group_id" defaultValue={this.state.upComingeventDetail.event_group_id}>
                  {this.state.getGroupList.map((item, index)=>{
                    return(
                      <option key={index} value={item.id}  data-default className="selection">{item.name}</option>
                  );
               })}
                </select>
              </label>
            </div></div>):(<div></div>)}</div>):(<div></div>)}
              <div className="col-sm-12">
               {this.props.isCreateOrEdit=="Edit"  ? <div className="col-sm-7 zeroPad">
                  <div className="groupIcon col-sm-3">
                     {this.state.upComingeventDetail.selected_group!=null && this.state.upComingeventDetail.selected_group!=undefined?<img src={"http://"+this.state.upComingeventDetail.selected_group.image_url}  className="grpimgdiv" />:<img className="grpimgdiv" src="/assets/img/grpimg.png"></img>}
                      </div>
                      <div className="col-sm-8 mt15">
                      {this.state.upComingeventDetail.selected_group!=null && this.state.upComingeventDetail.selected_group!=undefined?<span>{this.state.upComingeventDetail.selected_group.name}</span>:<div></div>}<br/>
                          <span>{this.state.upComingeventDetail.is_private?"Private Event":"Public Event"}</span>
                      </div>
                  </div>
                  :<div></div>}
                <div className="col-sm-5 zeroPad">
                  <div className="form-group row mt5pc">
                    <label  className="col-sm-12 col-form-label">Private Event:</label>
                    <div className="col-sm-12 zeroPad">
                      <label  className="switch">
                        <input type="checkbox" name="is_private"  defaultChecked={this.state.upComingeventDetail.is_private}/>
                        <div className="slider round"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              </div>

              <div className="col-sm-12 zeroPad">
                <span className="detailshead">Details<span className="txtRed">*</span></span><br/>
                  <div className="mt15 col-sm-12 zeroPad">
                      <textarea className="txtarea form-control" ref="description" name="description" maxLength="500" defaultValue={this.state.upComingeventDetail.description}></textarea>
                      </div>
                </div>
                   <div className="col-sm-10">
              <input ref="teatime" id="teatime" type="file" name="teatime" onChange={this.uploadTeatTimes} className="upload-file form-control" />
              </div>
              <div className="col-sm-12 zeroPad">
              <input type="button" value="Save" className="eventSavebtn mt15" onClick={this.onSubmitClick.bind(this)} disabled={this.props.isSaveInProgress} />
         </div>
         </div>

            </div>
            </form>
                       </div>
            );

    }
}
CreateEvent.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
         getCourseList: state.getCourses,
         selectedCourse: state.selectedCourse,
         selectedEvent:state.selectedEvent,
         activeUser:(state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
         ///getGroupList: (state.getgroupList!=undefined && state.getgroupList!=null)?state.getgroupList:{}
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({EventcourseList, oldgroupList, getEventCourseObject, courseList}, dispatch);


}

export default  connect(mapStateToProps, matchDispatchToProps)(CreateEvent);