import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {IMG_CONSTANT} from '../constants/application.constants';
import {saveGroupDetails} from '../actions/addGroupAction';
import {courseList} from '../actions/courseListAction';
var serialize = require('form-serialize');

import {getGolfConnectXmembers} from '../actions/friendsAction.js';
import {addOrRemoveGroupMemebrs} from '../actions/groupListAction';
import Select from 'react-select';


///var options = [];

let imgPath=IMG_CONSTANT.IMAGE_PATH;
class AddGroup extends Component{
    constructor(props,context)
    {
        super(props,context);
        this.state={
              getCourseslist:Object.assign([],props.getCourseList),
              SaveGroup:{},
              friends:Object.assign([], props.friends),
              newGroup: {},
              groupsImage: imgPath+"coverimg.png",
              groupImageObject:{},
              groupName : "", desc :"",
              errName:"", errDesc: "", buttonDisabled: true,
              selectedValue:''
        };
    this.onFieldChange=this.onFieldChange.bind(this);
    this.uploadFile=this.uploadFile.bind(this);
  }
    onFieldChange(e){
        this.setState({selectedValue:e.id});
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
                console.log("File up", data);
               that.setState({groupImageObject: data});
               that.setState({groupsImage: data.image});
             },
             error: function(){
                  ///that.setState({profileImage:'453.png'});
                console.log("Error");
             }
         });
         e.preventDefault();

     }

     onGroupDetailsSave (){
       let form = document.querySelector('#addGroupForm');
       let formData = serialize(form, { hash: true });
       if(_.size(this.state.groupImageObject)>0){
         _.set(formData, 'cover_image', this.state.groupImageObject.id);
       }
       this.props.saveGroupDetails(formData, this.props.activeUser.token).then((data)=>{
             this.setState({SaveGroup:this.props.getgroupList.groups, newGroup:data,buttonDisabled:true});

         }).catch((error)=>{
         });
         $("#headingOne").trigger("click");

     }
    componentDidMount() {
      $('.menu').parent().removeClass('active');
      $('#group').parent().addClass('active');
   }
   componentWillMount(){
        let  other = {city:'', created_by:1, created_on:'', id:0, is_premium:true, name:'Other', state:''};
        this.props.courseList(this.props.activeUser.token).then(()=>{
            let courseList = this.props.getCourseList;
            courseList.unshift(other);
            this.setState({getCourseslist:courseList});
        }).catch((error)=>{
        });
         this.props.getGolfConnectXmembers(this.props.activeUser.token).then(()=>{
                   this.setState({friends:this.props.friends});
         }).catch((error)=>{
            console.log("Error", error);
      });
      }

      componentWillReceiveProps(nextProps){
        /*if(this.props.getCourseList!=nextProps.getCourseList){
            this.setState({getCourseslist:nextProps.getCourseList});
        }*/
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
        $("#sec2").trigger("click");
        $("#headingTwo").trigger("click");
}

     changeIcon2(){
        $('#headingTwoSpan').toggleClass('glyphicon-plus').toggleClass('glyphicon-minus');
        $("#sec2").trigger("click")
     }

     addOrRemoveMembers(){
       let members=[];
       $("#addOrRemoveMemebrs input:checkbox:checked").each(function() {
           members.push(_.toInteger(this.id));
       });

       this.props.addOrRemoveGroupMemebrs(this.props.activeUser.token, this.state.newGroup.id, members).then(()=>{
         console.log("Success");
         this.context.router.push('/groups');
       }).catch((error)=>{
         console.log("Error", error);
       });
     }
     /****/
     onRequired(e){
         if(e.target.name == "name"){
             if(e.target.value == ""){
                 this.setState({
                        groupName : "",
                        errName : (<span className="err-msg">Please Enter Group Name:</span>),
                        buttonDisabled : true
                 });
             }
                 else{
                    this.setState({
                        groupName : e.target.value,
                        errName : "",
                        buttonDisabled : false
                 });
                 }
         }
         if(e.target.name == "description"){
             if(e.target.value == ""){
                 this.setState({
                        desc : "",
                        errDesc : (<span className="err-msg">Please tell us Something about your Group:</span>),
                        buttonDisabled : true
                 });
             }
                 else{
                    this.setState({
                        desc : e.target.value,
                        errDesc : "",
                        buttonDisabled : false
                 });
                 }
         }

     }
     /****/
    render(){
       if(_.size(this.state.getCourseslist)>0){
         return(<div className="scrollAndHeight">
            <div className="AddGroup">
        <div className="editgrpimg">
            {(_.size(this.state.groupImageObject)>0 && this.state.groupImageObject.height>=240 && this.state.groupImageObject.width>=1152)?(<img src={'http://' + this.state.groupsImage} className="coverimg" />):(<div className="hero">
                  <img className="hero__background" src={'http://' + this.state.groupsImage} />
                  <center><img className="hero__image"  src={'http://' + this.state.groupsImage} /></center>
             </div>)}
            <div className="addgrpimg col-sm-3">

                <button className="btn btn-default addgrp"  >
                <span className="glyphicon glyphicon-pencil glyph1"></span> Add Group Image
                </button>
                <input ref="file" id="file" type="file" name="file" onChange={this.uploadFile} className="upload-file form-control btnUploadPhoto cursor-pointer" accept="image/*" />

            </div>



                <div className="captionDiv">
                <span className="imgtag"></span>

            </div>
         </div>
            <div id="accordion" role="tablist" aria-multiselectable="true" className="zeroPad col-sm-12 accordionPanel">

  <form className="card" id="addGroupForm" method="post" onClick={this.plusminusToggle}>
    <div className="card-header cardDiv" role="tab" id="headingOne" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick={this.changeIcon}>
      <h5 className="mb-0 titleclass">
       Add Group
          <span id="headingOneSpan" className="glyphicon glyphicon-minus fr" >
            </span>
      </h5>
    </div>

    <div id="collapseOne" className="collapse in pdng15px" role="tabpanel" aria-labelledby="headingOne">
      <div className="card-block">

       <div>
          <div className="form-group row">
            <label htmlFor="example-text-input" className="col-xs-2 col-form-label">Group Name:<span className="txtRed">*</span></label>
            <div className="col-sm-9">
            <input className="form-control" maxLength="200" type="text" id="example-text-input"  name="name" onChange={this.onRequired.bind(this)}/>
            {this.state.errName}
            </div>
           </div>
           <div className="form-group row">
            <label htmlFor="example-text-input" className="col-xs-2 col-form-label">Home Course:<span className="txtRed">*</span></label>
            <div className="col-sm-9">
                {(_.size(this.state.getCourseslist)>0)?(<Select
                  name="course"
                  value={this.state.selectedValue} labelKey="name" valueKey="id"
                  options={this.state.getCourseslist}
                  onChange={this.onFieldChange}/>):(<span></span>)}
            </div>
           </div>
           <div className="form-group row">
            <label htmlFor="example-text-input" className="col-xs-2 col-form-label">Description:<span className="txtRed">*</span></label>
            <div className="col-sm-9">
            <textarea className="form-control" maxLength="500" id="example-text-input" name="description" onChange={this.onRequired.bind(this)}/>
            {this.state.errDesc}
            </div>
           </div>
           <div className="form-group row">
               <label htmlFor="example-text-input" className="col-xs-2 col-form-label">Private Group:</label>
               <label className="switch">
            <input type="checkbox" name="is_private"/>
            <div className="slider round"></div>
               </label>
           </div>


           <div className="form-group row">
                    <input type="button" className=" btn Savebtn" value="Save" onClick={this.onGroupDetailsSave.bind(this)} disabled={this.state.buttonDisabled || !this.state.groupName || !this.state.desc || !this.state.selectedValue}/>
            </div>
        </div>
      </div>
    </div>

  </form>
  {(this.state.newGroup!=undefined && this.state.newGroup!=null && _.size(this.state.newGroup)>0 && this.state.newGroup.id!=0)?(<div className="card">
    <div className="card-header cardDiv" role="tab" id="headingTwo" onClick={this.changeIcon2}>
      <h5 className="mb-0 titleclass collapsed" id="sec2" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo" >

          Add Members
       <span id="headingTwoSpan" className="glyphicon glyphicon-minus fr" >
            </span>
      </h5>
    </div>
    <div id="collapseTwo" className="collapse in" role="tabpanel" aria-labelledby="headingTwo">
    <form id="addOrRemoveMemebrs" className="card-block" onClick={this.plusminusToggle}>
        <div className="form-group row">
            <div className="col-sm-3">
               <span className="spanclass"> Add/Remove Member:</span>
            <input type="button" onClick={this.addOrRemoveMembers.bind(this)} className=" Savebtn adminSave" value="Save"/>
            </div>
            <div className="col-sm-9">
            {_.size(this.state.friends)>0  && this.state.friends.map((item, i) => {
            return <div key={i}>
                    <div className="col-sm-1 sliderswitch">
                      <label className="switch">
                          <input id={item.id} type="checkbox" defaultChecked={false} disabled={(this.props.activeUser!=undefined && this.props.activeUser!=null && this.props.activeUser.id==item.id)?true:false}/>
                            <div className="slider round"></div>
                      </label>
                    </div>
                    <div className="col-sm-3">
                        <img src={'http://'+item.profile_image_url} className="adminimg"></img>
                        <span className="ml5px">{item.last_name + ' ' + item.first_name}</span>
                    </div>
                </div>
            })}
            </div>
          </div>
    </form>
    </div>
    
  </div>):(<div></div>)}
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

AddGroup.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        getCourseList: state.getCourses,
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
        getgroupList:state.getgroupList,
        friends: state.friends
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({courseList, saveGroupDetails, getGolfConnectXmembers, addOrRemoveGroupMemebrs}, dispatch);


}

export default  connect(mapStateToProps, matchDispatchToProps)(AddGroup);
