import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {IMG_CONSTANT} from '../constants/application.constants';
import {editGroupDetails} from '../actions/addGroupAction';
import {courseList} from '../actions/courseListAction';
import {groupList, groupDetails, addOrRemoveMemebrs, getGroupAdminsList, addOrRemoveAdmin, deleteGroup} from '../actions/groupListAction';
var serialize = require('form-serialize');
import Select from 'react-select';

let imagePath=IMG_CONSTANT.IMAGE_PATH;
let paramId;

class EditGroup extends Component{
    constructor(props,context)
    {
        super(props,context);
        this.state={
          getCourseslist:Object.assign([],props.getCourseList),
          EditGroup:{},
          groupDetails: Object.assign({},props.selectedGroup),
          groupsImage:'',
          groupImageObject: {},
          isImageEdited: false,
          errName : "",errDesc : "",
          buttonDisabled1 : true, buttonDisabled2 : true
        };

    this.onFieldChange=this.onFieldChange.bind(this);
    this.onDrop=this.onDrop.bind(this);
    this.uploadFile=this.uploadFile.bind(this);
  }

  uploadFile(e) {
         var fd = new FormData();
         var that = this;
         fd.append('image', document.getElementById('file').files[0]);
         $.ajax({
             url: 'http://52.45.249.118:8080/api/groups/upload-cover-image/',
             data: fd,
             processData: false,
             contentType: false,
             type: 'POST',
             headers:{
             'Authorization':'Token '+ this.props.activeUser.token
            },
             success: function(data){

               that.setState({groupImageObject: data});
               that.setState({groupsImage: ('http://' +  data.image)});
             },
             error: function(){
                console.log("Error");
             }
         });
         e.preventDefault();
     }

onGroupRemoveClick(id){
  this.props.deleteGroup(id, this.props.activeUser.token).then(()=>{
    this.context.router.push('/groups');
  }).catch((error)=>{
    console.log("Error", error);
  });
}

addOrRemoveAdmin(){
  let admins=[];
  $("#addOrRemoveAdmin input:checkbox(':checked')").each(function() {
      admins.push(_.toInteger(this.id));
  });

  this.props.addOrRemoveAdmin(this.props.activeUser.token, this.state.groupDetails.id, admins).then(()=>{
    this.props.getGroupAdminsList(paramId, this.props.activeUser.token).then(()=>{
            this.setState({groupDetails:this.props.selectedGroup});
        }).catch((error)=>{
        });
  }).catch((error)=>{
    console.log("Error", error);
  })
  $("#sec3").click();
}


  addOrRemoveMembers(){
    let members=[];
    $("#addOrRemoveMemebrs input:checkbox:not(:checked)").each(function() {
        members.push(_.toInteger(this.id));
    });
    this.props.addOrRemoveMemebrs(this.props.activeUser.token, this.state.groupDetails.id, members).then(()=>{
      console.log("Success");
       this.props.getGroupAdminsList(paramId, this.props.activeUser.token).then(()=>{
            this.setState({groupDetails:this.props.selectedGroup});
        }).catch((error)=>{
        });
    }).catch((error)=>{
      console.log("Error", error);
    });
         $("#sec3").click();
  }
    onFieldChange(e){
      this.setState({selectedValue:e.id});
    }
     onGroupEditSave (){
       let form = document.querySelector('#addGroupForm');
       let formData = serialize(form, { hash: true });
        if(_.size(this.state.groupImageObject)>0){
       _.set(formData, 'cover_image', this.state.groupImageObject.id);
      }
        console.log("onGroupEditSave formData", formData);
       this.props.editGroupDetails(formData,  this.props.selectedGroup.id, this.props.activeUser.token).then(()=>{
             this.setState({EditGroup:this.props.getgroupList.editgroups,buttonDisabled1 : true});
         }).catch((error)=>{
             console.log("Error", error);
         });
         $("#sec2").click();
     }
    componentDidMount() {
      $('.menu').parent().removeClass('active');
      $('#group').parent().addClass('active');
   }
   componentWillMount(){
        let urlPath = _.split(location.pathname, '_');
        paramId =  (_.size(urlPath)>0)?(_.toInteger(urlPath[1])):(0);
        this.props.courseList(this.props.activeUser.token).then(()=>{
            this.setState({getCourseslist:this.props.getCourseList});
        }).catch((error)=>{
          console.log("Error", error);
        });

        this.props.groupDetails(paramId, this.props.activeUser.token).then(()=>{
          if(this.props.selectedGroup.cover_image!=null){
            that.setState({groupImageObject: this.props.selectedGroup.cover_image});
            this.setState({groupsImage:('http://' + this.props.selectedGroup.cover_image.image)});
          }
            this.setState({groupDetails:this.props.selectedGroup});
        }).catch((error)=>{
        });

        this.props.getGroupAdminsList(paramId, this.props.activeUser.token).then(()=>{
            this.setState({groupDetails:this.props.selectedGroup});
        }).catch((error)=>{
        });
        this.setState({selectedValue:this.props.selectedGroup.course.id});
      }

      componentWillReceiveProps(nextProps){
        if(this.props.getCourseList!=nextProps.getCourseList)
        {
            this.setState({getCourseslist:nextProps.getCourseList});
        }
        if(this.props.selectedGroup!=nextProps.selectedGroup){
          this.setState({groupDetails:nextProps.selectedGroup});
        }
      }
       onDrop(acceptedFiles, rejectedFiles, files) {
         this.setState({files:files})
    }

 plusminusToggle(){

       $('.collapse').on('shown.bs.collapse', function(){

$(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");

}).on('hidden.bs.collapse', function(){

$(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");

});

     }



    changeIcon(){
        $('#headingOneSpan').toggleClass('glyphicon-plus').toggleClass('glyphicon-minus');
     }
     changeIcon2(){
        $('#headingTwoSpan').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus');
     }
    changeIcon3(){
        $('#headingThreeSpan').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus');
     }
     /*****/
     chkboxUnable(e){
        this.onRequired(e);
        if((e.target.name == "name") || (e.target.name == "course") || (e.target.name =="description") || (e.target.name == "is_private")) {
          
           this.setState({
           buttonDisabled1: false
          });
          
        }

         if(e.target.name == "addMember") {
         this.setState({
           buttonDisabled2: false
           });
         }
     }

     onRequired(e){
       if(e.target.name=="name"){
         if(e.target.value == ""){
           this.setState({
              errName : (<span className="err-msgEditGrp">Please Enter Group Name:</span>),
              buttonDisabled1 : true
           });
         }
         else{
           this.setState({
              errName : "",
              buttonDisabled1 : false
           });
         }
       }
       if(e.target.name=="description"){
         if(e.target.value == ""){
           this.setState({
              errDesc : (<span className="err-msgEditGrp">Please tell something about your Group</span>),
              buttonDisabled1 : true
           });
         }
         else{
           this.setState({
              errDesc : "",
              buttonDisabled1 : false
           });
         }
       }
     }
     /*****/

    render()
    {
        let imgPath=IMG_CONSTANT.IMAGE_PATH;
       
       if(_.size(this.state.getCourseslist)>0){
         return(<div className="EditGroupDiv">
            <div className="AddGroup">
        <div className="editgrpimg">
            {/*<img src={"http://" + this.state.groupImageObject.image} className="coverimg" />*/}
            {(this.state.groupDetails.cover_image!=undefined && this.state.groupDetails.cover_image!=null && this.state.isImageEdited==false && _.size(this.state.groupDetails.cover_image)>0)?((this.state.groupDetails.cover_image.height>=240 && this.state.groupDetails.cover_image.width>=1152)?(<img src={'http://'+ this.state.groupDetails.cover_image.image} className="coverimg"/>):(<div className="hero">
                   <img className="hero__background" src={'http://'+ this.state.groupDetails.cover_image.image} />
                   <center><img className="hero__image"  src={'http://'+ this.state.groupDetails.cover_image.image} /></center>
              </div>)):(<img  src={imgPath+"coverimg.png"} className="coverimg" />)}
            <div className="addgrpimg col-sm-3">

                <button className="btn btn-default addgrp"  >
                <span className="glyphicon glyphicon-pencil glyph1"></span> Edit Group Image
                </button>
<input ref="file" id="file" type="file" name="file" onChange={this.uploadFile} className="cursor-pointer upload-file form-control btnUploadPhoto wd56pc" accept="image/*" />
            </div>




                <div className="captionDiv">
                <span className="imgtag">{_.size(this.state.groupDetails.members)} Members</span>

            </div>
         </div>

            <div id="accordion" role="tablist" aria-multiselectable="true" className="zeroPad col-sm-12 accordionPanel" onClick={this.plusminusToggle}>

  <form className="panel panel-default" id="addGroupForm" method="post" >
    <div className="header cardDiv" role="tab" id="headingOne" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick={this.changeIcon}>
      <h5 className="mb-0 titleclass">
       Edit Group
          <span id="headingOneSpan" className="glyphicon glyphicon-minus fr" >
            </span>
      </h5>
    </div>

    <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
      <div className="card-block pl1pc">
       <div>
          <div className="form-group row">
            <label htmlFor="example-text-input" maxLength="200" className="col-xs-2 col-form-label">Group Name:<span className="txtRed">*</span></label>
            <div className="col-sm-9">
            <input className="form-control" type="text" id="example-text-input" onChange={this.chkboxUnable.bind(this)} ref="name" name="name" defaultValue={this.props.selectedGroup.name}/>
            {this.state.errName}
            </div>
           </div>
           <div className="form-group row">
            <label htmlFor="example-text-input" className="col-xs-2 col-form-label">Home Course:<span className="txtRed">*</span></label>
            <div className="col-sm-9">

               {/* <select className="form-control"  name="course" defaultValue={this.props.selectedGroup.course.id} onChange={this.chkboxUnable.bind(this)}>
                    {this.props.getCourseList.map((item, i) => {
                        return <option key={i} value={item.id}>{item.name}</option>
                    })}
                </select>*/}
               
                {(_.size(this.props.getCourseList)>0)?(<Select
                  name="course"
                  value={this.state.selectedValue} labelKey="name" valueKey="id"
                  options={this.props.getCourseList}
                  onChange={this.onFieldChange} defaultValue={this.props.selectedGroup.course.id} /> ):(<span></span>)}

            </div>
           </div>
           <div className="form-group row">
            <label htmlFor="example-text-input" maxLength="500" className="col-xs-2 col-form-label">Description:<span className="txtRed">*</span></label>
            <div className="col-sm-9">
            <textarea className="form-control" id="example-text-input" ref="description"  name="description" defaultValue={this.props.selectedGroup.description} onChange={this.chkboxUnable.bind(this)}/>
            {this.state.errDesc}
            </div>
           </div>
           <div className="form-group row">
               <label htmlFor="example-text-input" className="col-xs-2 col-form-label">Private Group:</label>
               <label className="switch">
            <input type="checkbox" name="is_private"  defaultChecked={this.props.selectedGroup.is_private} onChange={this.chkboxUnable.bind(this)}/>
            <div className="slider round"></div>
               </label>
           </div>


           <div className="form-group row">
                    <input type="button" className="btn Savebtn" value="Save" onClick={this.onGroupEditSave.bind(this)} disabled={this.state.buttonDisabled1 || this.state.errDesc || this.state.errName}/>
            </div>
        </div>
      </div>
    </div>

  </form>
  <div className="panel panel-default">
    <div className="header cardDiv" role="tab" id="headingTwo" onClick={this.changeIcon2}>
      <h5 className="mb-0 titleclass collapsed" id="sec2" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" >

          Edit/Remove Members
       <span id="headingTwoSpan" className="glyphicon glyphicon-plus fr" >
            </span>
      </h5>
    </div>
    <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <form id="addOrRemoveMemebrs" className="card-block">
          <div className="form-group row">
              <div className="col-sm-3">
                 <span className="spanclass"> Add/Remove Member:</span>
              <input type="button" onClick={this.addOrRemoveMembers.bind(this)} className="btn Savebtn adminSave" value="Save" disabled={this.state.buttonDisabled2} />
              </div>
              <div className="col-sm-9">
              {_.size(this.state.groupDetails.members)>0  && this.state.groupDetails.members.map((item, i) => {
              return <div key={i}>
                      <div className="col-sm-1 sliderswitch">
                        <label className="switch">
                            <input id={item.id} type="checkbox" name="addMember" defaultChecked={true} disabled={(this.props.activeUser.id==item.id)?true:false} onChange={this.chkboxUnable.bind(this)}/>
                              <div className="slider round"></div>
                        </label>
                      </div>
                      <div className="col-sm-3">
                          <img src={'http://'+item.profile_image_url} className="adminimg"></img>
                          <span className="ml5px">{item.last_name + ', ' + item.first_name}</span>
                      </div>
                  </div>
              })}
              </div>
            </div>
      </form>
    </div>
  </div>
 <div className="panel panel-default">
    <div className="header cardDiv" role="tab" id="headingThree" onClick={this.changeIcon3}>
      <h5 className="mb-0 titleclass collapsed" id="sec3" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">

          Add Admin
       <span id="headingThreeSpan" className="glyphicon glyphicon-plus fr" >
            </span>
      </h5>
    </div>
    <div id="collapseThree" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
      <form id="addOrRemoveAdmin" className="card-block">
          <div className="form-group row">
              <div className="col-sm-3">
                 <span className="spanclass"> Add/Remove Admin:</span>
              <input type="button" onClick={this.addOrRemoveAdmin.bind(this)} className=" Savebtn adminSave" value="Save"/>

              </div>
              <div className="col-sm-9">
              {_.size(this.state.groupDetails.admins)>0  && this.state.groupDetails.admins.map((item, i) => {
                console.log("admin",item.is_admin);
              return <div key={i}>
                      <div className="col-sm-1 sliderswitch">
                        <label className="switch">{/*Check for one Count*/}
                            <input id={item.id} type="checkbox" defaultChecked={item.is_admin} disabled={(this.props.activeUser.id==item.id)?true:false} />{/*disabled={(this.state.groupDetails.admins_count==1)?true:false}*/}
                              <div className="slider round"></div>
                        </label>
                      </div>
                      <div className="col-sm-3">
                          <img src={'http://'+item.profile_image_url} className="adminimg"></img>
                          <span className="ml5px">{item.last_name + ', ' + item.first_name}</span>
                      </div>
                  </div>
              })}
              </div>
            </div>
      </form>
    </div>
    <input type="button" className="btnDelete" onClick={this.onGroupRemoveClick.bind(this, this.state.groupDetails.id)} value="Delete Group" />
  </div>
</div>
        </div>
           </div>
            );
         }

          else {

            return(
              <div>no data</div>
          );
         }
    }
}

EditGroup.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        getCourseList: state.getCourses,
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
        selectedGroup:state.selectedGroup,
        getgroupList:state.getgroupList
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({courseList, editGroupDetails, groupDetails, addOrRemoveMemebrs, getGroupAdminsList, addOrRemoveAdmin, deleteGroup}, dispatch);


}

export default  connect(mapStateToProps, matchDispatchToProps)(EditGroup);