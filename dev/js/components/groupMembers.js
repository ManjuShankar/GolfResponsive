import React, {Component} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import{IMG_CONSTANT} from '../constants/application.constants';
import {groupList, groupDetails, getGroupMembersList, searchGroupMembers, addComment, getGroupPostsList, 
  addNewPost, getGroupsGallery, leaveGroup, editGroupInfo, getGroupFilesList, likePost,
   addOrRemoveGroupMemebrs, getGroupMembers, searchaddMembers, getCurrentEventsDetailsList, RequestGroup} from '../actions/groupListAction';
import { getCurrentEvent, eventDetails} from '../actions/eventDetailsAction';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createEvents, editEvents} from '../actions/createEventAction';
import CreateEvent from './child-components/createEvent';
import {userProfileDetails} from '../actions/profileActions';
import _ from 'lodash';
import Spinner from 'react-spinner';
import EventListDetail from './child-components/eventListDetail';
import UpcomingEventDetails from './child-components/upcomingEventDetails';
import toastr from 'toastr';

let imagePath=IMG_CONSTANT.IMAGE_PATH;
let paramId;
class GroupMembers extends Component{
    constructor(props,context)
    {
        super(props,context);
       this.state={
                    groupInfo:Object.assign({},props.getGroupInfo),
                    upComingeventDetail:Object.assign({}, props.selectedEvent),
                    isCreateOrEdit: "Upcoming",
                    selectedGroupDetails:Object.assign({}, props.selectedGroup),
                    membersList: [],
                    postsList: [],
                    profileDetails: Object.assign({}, props.myProfile.MyProfile),
                    galleryList: [],
                    editGroupInfoType:'label',
                    filesList:[],
                    friends: props.friends,
                    ajaxCallInProgress:false,
                    postMsg:"",
                     isImageEdited: false,
                    currentEventList: Object.assign([],props.selectedGroup),
                  };
                  this.uploadFile=this.uploadFile.bind(this);
                  this.uploadDocument=this.uploadDocument.bind(this);
    }

    onEditGroupInfo(){
        this.setState({editGroupInfoType:'text'});
    }

    onRequestInviteClick(){

    }

    onLikeClick(id){
        this.props.likePost(this.props.activeUser.token, id).then(()=>{
              this.getGroupPostsDetails();
        }).catch((error)=>{

        });
    }

   getFileExtension(name){
      var found = name.lastIndexOf('.') + 1;
      return (parseInt(found) > 0 ? name.substr(found) : "");
    }

   onUploadFileClick(e){
          if(_.size(document.getElementById('documents').files)>0){

          let fileName = _.trim(document.getElementById('uploadFileName').value);
          let fileObj = document.getElementById('documents').files[0];
          let fileExtention = this.getFileExtension(document.getElementById('documents').files[0].name);
          let fd = new FormData();
          let that = this;
          fd.append('file', fileObj, (fileName + "." + fileExtention));
          $.ajax({
              url: 'http://52.45.249.118:8080/api/groups/' + paramId + '/add-group-file/',
              data: fd,
              processData: false,
              contentType: false,
              type: 'POST',
              headers:{
              'Authorization':'Token '+ this.props.activeUser.token
             },
              success: function(data){
                document.getElementById('uploadFileName').value='';
                that.setState({filesList: data});
                $('#documents').val('');
                $('#uploadFileModal').modal('hide');
              },
              error: function(){
                 console.log("Error");
                 $('#uploadFileModal').modal('hide');
                  $('#documents').val('');
              }
          });
            e.preventDefault();
  }else{
    toastr.error("Please choose the file to upload");
  }
}

    uploadDocument(e) {

           var fd = new FormData();
           var that = this;
           fd.append('file', document.getElementById('documents').files[0]);
           $.ajax({
               url: 'http://52.45.249.118:8080/api/groups/' + paramId + '/add-group-file/',
               data: fd,
               processData: false,
               contentType: false,
               type: 'POST',
               headers:{
               'Authorization':'Token '+ this.props.activeUser.token
              },
               success: function(data){
                 that.setState({filesList: data});
               },
               error: function(){
                  console.log("Error");
               }
           });
           e.preventDefault();
       }


    onUpdateGroupInfo(){
        let description = document.getElementById('groupInfoDescription').value;
        this.props.editGroupInfo(this.props.activeUser.token, paramId, description).then(()=>{
            this.setState({editGroupInfoType:'label'});
            this.props.groupDetails(paramId, this.props.activeUser.token).then(()=>{
                  this.setState({selectedGroupDetails:this.props.selectedGroup});
              }).catch((error)=>{
             });
        }).catch((error)=>{

        });
    }

    addPost(){
      let title = _.trim(document.getElementById('txtPostInput').value);
      if(title==""){
          toastr.error("Post can't be empty");
      }else{
          this.props.addNewPost(paramId,this.props.activeUser.token, title).then(()=>{
            this.getGroupPostsDetails();
            document.getElementById('txtPostInput').value='';
          }).catch((error)=>{
          });
      }
    }

    addOrRemoveMembers(){
      let members=[];
      $("#addOrRemoveMemebrs input:checkbox:checked").each(function() {
          members.push(_.toInteger(this.id));
      });
      this.props.addOrRemoveGroupMemebrs(this.props.activeUser.token, paramId, members).then(()=>{
        this.forceUpdate();
        this.props.getGroupMembers(this.props.activeUser.token, paramId).then(()=>{
           $('.membersList').attr('checked',false);
           this.setState({friends:this.props.friends});
           this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
          this.setState({ajaxCallInProgress:false});
        });
        this.getGroupMemebrs();
        $('#groupaddMembers').modal('hide');
      }).catch((error)=>{
        console.log("Error", error);
      });
    }

    getGroupPostsDetails(){
      this.props.getGroupPostsList(paramId, this.props.activeUser.token).then(()=>{
                  this.setState({postsList:this.props.selectedGroup.posts});
                  this.setState({ajaxCallInProgress:false});
              }).catch((error)=>{
                this.setState({ajaxCallInProgress:false});
      });

    }

    focusOnCommentBox(id){
        $('#'+ id + "_txtComment").focus();
    }


    Comment(postsId){
      let commentTextBox=(postsId + "_txtComment");
      let body = document.getElementById(commentTextBox).value;
      this.props.addComment(postsId, this.props.activeUser.token, body).then(()=>{
        this.getGroupPostsDetails();
        document.getElementById(commentTextBox).value='';
      }).catch((error)=>{
      });
    }
    uploadFile(e) {
           var fd = new FormData();
           var that = this;
           fd.append('image', document.getElementById('file').files[0]);
           $.ajax({
               url: 'http://52.45.249.118:8080/api/groups/' + paramId +'/add-group-image/',
               data: fd,
               processData: false,
               contentType: false,
               type: 'POST',
               headers:{
               'Authorization':'Token '+ this.props.activeUser.token
              },
               success: function(data){
                 that.setState({galleryList:data});
               },
               error: function(){
                  console.log("Error");
               }
           });
           e.preventDefault();
       }


    onFriendsSearch(e){
         if(e.which==13)
         {
           this.props.searchGroupMembers(this.props.activeUser.token, e.target.value, paramId).then(()=>{
                this.setState({membersList:this.props.selectedGroup.members});
           }).catch((error)=>{
           });
         }
     }

     onAddmemberSearch(e){
       if(e.which==13)
         {
           this.props.searchaddMembers(this.props.activeUser.token, e.target.value, paramId).then(()=>{
                this.setState({friends:this.props.friends});
           }).catch((error)=>{
           });
         }
     }
    onSaveClick(formData){
      if(this.state.isCreateOrEdit=="Create"){
       this.props.createEvents(formData, this.props.activeUser.token).then(()=>{
         this.props.eventDetails(this.props.activeUser.token).then(()=>{
             this.setState({currentEventList:this.props.selectedGroup.getEventsList, 
              isCreateOrEdit: "Upcoming"});
              this.props.getCurrentEventsDetailsList(this.props.activeUser.token, this.props.selectedGroup.id).then(()=>{
                    this.setState({currentEventList: this.props.selectedGroup.getEventsList});
                    if(_.size(this.state.upComingeventDetail)==0 && _.size(this.selectedGroup.getEventsList)>0){
                            this.getEvent(this.props.selectedGroup.getEventsList[0].id);
                    }
                   
                  }).catch((error)=>{
                     
                  });
            // this.getEvent(this.props.selectedGroup.getEventsList[0].id);

         }).catch((error)=>{
         });
       }).catch((error)=>{
       });
      }
      else {
        this.props.editEvents(formData,this.state.upComingeventDetail.id, this.props.activeUser.token).then(()=>{
          this.props.eventDetails(this.props.activeUser.token).then(()=>{
              this.setState({currentEventList:this.props.selectedGroup.getEventsList,
               isCreateOrEdit: "Upcoming"});
              this.getEvent(this.props.selectedGroup.getEventsList[0].id);
          }).catch((error)=>{
          });
        }).catch((error)=>{
        });
      }
   }

   navigateToCreate(val){
      this.setState({isCreateOrEdit:val});
    }
 onButtonClick(val){
      this.setState({isCreateOrEdit:val});
    }
    componentDidMount() {
      $('.menu').parent().removeClass('active');
      $('#group').parent().addClass('active');
   }

getGroupMemebrs(){
  this.props.getGroupMembersList(paramId, this.props.activeUser.token).then(()=>{
          this.setState({membersList:this.props.selectedGroup.members});
          this.setState({ajaxCallInProgress:false});
      }).catch((error)=>{
        this.setState({ajaxCallInProgress:false});
  });
}

   componentWillMount(){
     let urlPath = _.split(location.pathname, '_');
     paramId =  (_.size(urlPath)>0)?(_.toInteger(urlPath[1])):(0);
    this.setState({ajaxCallInProgress:true});
     
    
   if(_.toInteger(this.props.params.tabIndex)==4){
           this.props.eventDetails(this.props.activeUser.token).then(()=>{
                  this.setState({currentEventList:this.props.selectedGroup.getEventsList});
                   $("#catList").trigger('click');
                  if(_.size(this.state.upComingeventDetail)==0 && _.size(this.props.selectedGroup.getEventsList)>0){
                          this.getEvent(this.props.selectedGroup.getEventsList[0].id);
                  }
            }).catch((error)=>{
          });
        }
      this.props.groupDetails(paramId, this.props.activeUser.token).then(()=>{
            this.setState({selectedGroupDetails:this.props.selectedGroup});

            this.getGroupMemebrs();

            this.props.getGroupFilesList(paramId, this.props.activeUser.token).then(()=>{
                        this.setState({filesList:this.props.selectedGroup.files});
                        this.setState({ajaxCallInProgress:false});
                    }).catch((error)=>{
                      this.setState({ajaxCallInProgress:false});
            });
          this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
           if(error == "Error: Request failed with status code 401"){
           this.context.router.push('/');
          }  
          this.setState({ajaxCallInProgress:false});
       });

   }

   componentWillReceiveProps(nextProps){
     if(this.props.eventList.CurrentEvents!=nextProps.eventList.CurrentEvents){
             this.setState({currentEventList:nextProps.eventList.CurrentEvents});
     }


     if(this.props.groupDetails!=nextProps.groupDetails){
       this.setState({selectedGroupDetails:nextProps.selectedGroup});
     }

     if(this.props.selectedGroup!=nextProps.selectedGroup){
       this.setState({membersList:nextProps.selectedGroup.members});
       this.setState({postsList:nextProps.selectedGroup.posts});
       this.setState({filesList:nextProps.selectedGroup.files});
     }

     if(this.props.friends!=nextProps.friends){
       this.setState({friends:nextProps.friends});
     }
     /*if(_.size(this.state.upComingeventDetail)==0 && _.size(this.state.currentEventList)>0){
                      this.getEvent(this.state.currentEventList[0].id);
              }*/
   }

   onGroupClick(){
        this.context.router.push('/editGroup_' + paramId);
    }


    onTabClick(tabIndex){
      this.setState({ajaxCallInProgress:true});
      if(tabIndex==0){
        this.props.groupDetails(paramId, this.props.activeUser.token).then(()=>{
                this.setState({selectedGroupDetails:this.props.selectedGroup});
                this.setState({ajaxCallInProgress:false});
            }).catch((error)=>{
              this.setState({ajaxCallInProgress:false});
        });
      }
      else if(tabIndex==1){
          this.getGroupPostsDetails();
      }
      else if(tabIndex==2){
          this.props.getGroupMembers(this.props.activeUser.token, paramId).then(()=>{
             this.setState({friends:this.props.friends});
             this.setState({ajaxCallInProgress:false});
          }).catch((error)=>{
            this.setState({ajaxCallInProgress:false});
          });
      }
      else if(tabIndex==3){
        this.props.getGroupsGallery(this.props.activeUser.token, paramId).then(()=>{
          this.setState({galleryList:this.props.selectedGroup.gallery});
          this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
          this.setState({ajaxCallInProgress:false});
        });
      }
      else if(tabIndex==4){

                this.props.getCurrentEventsDetailsList(this.props.activeUser.token, this.props.selectedGroup.id).then(()=>{
                    this.setState({currentEventList: this.props.selectedGroup.getEventsList});
                    if(_.size(this.state.upComingeventDetail)==0 && _.size(this.selectedGroup.getEventsList)>0){
                            this.getEvent(this.props.selectedGroup.getEventsList[0].id);
                    }
                    this.setState({ajaxCallInProgress:false});
                  }).catch((error)=>{
                      this.setState({ajaxCallInProgress:false});
                  });
      }
    }

    onLeaveGroup(){
      if(this.props.selectedGroup.admins_count==1){

$("#LeaveModal").modal('show');
      }
      else{

      this.props.leaveGroup(this.props.activeUser.token, paramId).then(()=>{
            this.context.router.push('/groups');
      }).catch((error)=>{

      });
      }

    }

    onEventClick(eventsList, eventId){

      this.getEvent(eventId);
      this.setState({isCreateOrEdit: "Upcoming"});
    }
    getEvent(eventId){
      this.props.getCurrentEvent(eventId, this.props.activeUser.token).then(()=>{
        this.setState({upComingeventDetail:this.props.selectedEvent});
      }).catch((error)=>{
      });
  }

    enterCapture(e){
      if(e.target.value == ""){
          if(e.keyCode == 13){
            e.preventDefault();
          }
      }
      if((e.target.value != "") && (e.keyCode == 13)){
         $("#addPost").trigger("click");
     }
 }
    onRequired(e){
      if(e.target.value == ""){
        this.setState({
            postMsg:""
        });
      }
      else{
        this.setState({
            postMsg : e.target.value
        });
      }
    }

      deleteToggle(){
          var checkBoxes = $('.membersList');
          checkBoxes.change(function () {
          $('#deleteButton').prop('disabled', checkBoxes.filter(':checked').length < 1);
        });
      }
      disableButn(){
        $("#deleteButton").prop({disabled:true});
      }
      onJoinGroup(){
         $("#JoinGrp").modal('show');
      }
      onYesClick(){
       
     this.props.RequestGroup(this.props.activeUser.token, this.props.selectedGroup.id).then(()=>{
$("#JoinGrp").modal('hide');
          
      }).catch((error)=>{

      });
      }
    render(){
        return(
             <div className="gpadminmembers">

       <div className="Groupmember col-sm-12">
       <div className="groupGallery col-sm-12">
        <div className="editgrpimg">
          {(this.state.selectedGroupDetails!=undefined && this.state.selectedGroupDetails!=null && this.state.selectedGroupDetails.cover_image!=null)?((this.state.selectedGroupDetails.cover_image.height>=240 && this.state.selectedGroupDetails.cover_image.width>=1152)?(<img src={'http://'+ this.state.selectedGroupDetails.cover_image.image} className="coverimg"/>):(<div className="hero">
                 <img className="hero__background img-rounded" src={'http://'+ this.state.selectedGroupDetails.cover_image.image} />
                 <center><img className="hero__image img-rounded"  src={'http://'+ this.state.selectedGroupDetails.cover_image.image} /></center>
            </div>)):(<img  src={imagePath+"coverimg.png"} className="coverimg" />)}
            {/*<img src={(this.state.selectedGroupDetails!=undefined && this.state.selectedGroupDetails!=null && this.state.selectedGroupDetails.cover_image!=null)?('http://'+ this.state.selectedGroupDetails.cover_image.image):(imagePath+"coverimg.png")} className="coverimg"></img>-->*/}
            <div className="captionDiv">
                <span className="imgtag">{this.state.selectedGroupDetails.name} ({this.props.selectedGroup!=null && this.props.selectedGroup!=undefined?this.props.selectedGroup.members_count:0} {_.size(this.state.membersList)>1?'Members':'Member'})</span>
                <span  className="pvtGrptxt">{this.state.selectedGroupDetails.is_private?'Private Group':'Public Group'}</span>
            </div>
    </div>

    <div className="tabsForEvents mt40px">
    {(this.state.selectedGroupDetails!=undefined && this.state.selectedGroupDetails!=null && this.state.selectedGroupDetails.is_admin)?(<input type="button" value="Edit Group" onClick={this.onGroupClick.bind(this)} className="editEventButton"/>):(<div></div>)}
    {(this.state.selectedGroupDetails!=undefined && this.state.selectedGroupDetails!=null && this.state.selectedGroupDetails.is_admin)?(<img src={imagePath+"black-male-user-symbol.png"} className="adminicon"></img>):(<div></div>)}
    <Tabs >
        <TabList className="EventsTabHeader">
            <Tab onClick={this.onTabClick.bind(this, 0)}>Info</Tab>
            <Tab onClick={this.onTabClick.bind(this, 1)}>Post</Tab>
            <Tab onClick={this.onTabClick.bind(this, 2)}>Members</Tab>
            <Tab onClick={this.onTabClick.bind(this, 3)}>Gallery</Tab>
            <Tab onClick={this.onTabClick.bind(this, 4)}>Events</Tab>
        </TabList>

      <TabPanel>
            {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(<div className="bgwhite pdtop2pc pdlft4pc pdbtm3pc col-sm-12 posAbs wd974pc">
            <div className="col-sm-12 zeroPad">
      <div>
                <span>Info</span>
                {this.state.selectedGroupDetails.is_member?<button onClick={this.onLeaveGroup.bind(this)} className="btnLeaveGroup">Leave Group</button>:this.state.selectedGroupDetails.is_private?'':<button onClick={this.onJoinGroup.bind(this)} className="btnLeaveGroup" data-toggle="modal" >Join Group</button>}
                 
                </div>
                <div className="modal fade" id="JoinGrp" role="dialog">
    <div className="modal-dialog modal-sm mt20pc">
      <div className="modal-content">
        <div className="modal-header bgGreen">
         
          <h4 className="modal-title">Request Access for Group</h4>
        </div>
        <div className="modal-body">
          <p className="fnt20px">Hello Administrator.<br/>
          I would like to join this group. Please approve my request.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btnPrimary" data-dismiss="modal">Cancel</button>
           <button type="button" className="btnPrimary" onClick={this.onYesClick.bind(this)}>Ok</button>
        </div>
      </div>
    </div>
  </div>
    <div className="modal fade" id="LeaveModal" role="dialog">
    <div className="modal-dialog modal-sm mt20pc">
      <div className="modal-content">
        <div className="modal-header bgdgreen txtwhite">
         
          <h4 className="modal-title">Leave Group</h4>
        </div>
        <div className="modal-body">
          <p>You are the only admin of the group. Please add another admin to leave this group.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default Closebtn" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
            </div>

            <div className="dividerLine1"></div>
                <div className="col-sm-6 mt15 pl0px pdng">
                <span>Description</span>
                    <div className="dividerLine2"></div>
                    <div className="mt15 ml20px mr15px">
                    {_.size(this.props.selectedGroup)>0?((this.state.editGroupInfoType=="text")?(<input id="groupInfoDescription" maxLength="500" type="text" className="form-control" defaultValue={this.props.selectedGroup.description} />):(<p>{this.props.selectedGroup.description}.</p>)):('')}</div>
                   <div> {_.size(this.props.selectedGroup)>0?this.props.activeUser.id==this.state.selectedGroupDetails.created_by?((this.state.editGroupInfoType=="label")?(<button onClick={this.onEditGroupInfo.bind(this)} className="btnEdit">Edit</button>):(<button onClick={this.onUpdateGroupInfo.bind(this)} className="btnEdit">Update</button>)):(<div></div>):('')}</div>
                </div>
                <div className="col-sm-1 mt15">
                <img src={imagePath+"fileObject.png"} className="pdlft2px"></img>
                    <span className="fileTag">Files</span>
                </div>
                <div className="col-sm-5 mt15 ">
                <div className="col-sm-12 zeroPad">
                {_.size(this.state.filesList)>0 &&  this.state.filesList.map((item, index)=>{
                    return(  <div key={index} className="col-sm-10">
                          <a className="cursor-pointer" target="_blank" href={'http://' + item.file}>{item.name.substr(0, item.name.lastIndexOf('.'))}</a><br/>
                          <span>{item.uploaded_on + ' by ' + item.uploaded_by}</span>
                          <div className="dividerLine3"></div>
                      </div>)
                })}
                </div>
                    <button data-toggle="modal" data-target="#uploadFileModal" className="btnFileUpload">Upload a file</button>
                    <div className="modal fade addPost" id="uploadFileModal" role="dialog" data-backdrop="static">
                    <div className="modal-dialog tp25pc">
                    <form id="groupsForm">
                       <div className="modal-content">
                           <div className="modal-header col-sm-12 bgGreen">Upload File</div>
                           <div className="modal-body col-sm-12 bgwhite mb0px">
                              <input type="text" className="form-control" name="uploadFileName" id="uploadFileName" placeholder="Title"/>
                              <input ref="documents" id="documents" type="file" name="file" className="form-control" />
                              
                           </div>
                          <div className="modal-footer col-sm-12 bgwhite">
                            <input type="button" className="upload-butn " value="Upload" id="btnSend" onClick={this.onUploadFileClick.bind(this)} />
                            <input type="button" className="uploadcancel-butn " data-dismiss="modal" value="Cancel" />
                         </div>
                        </div>
                        </form>
                    </div>
                  </div>
                </div>
                </div>)}
            </TabPanel>
            <TabPanel>
{(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(
            <div className="pdng  col-sm-12">
              <div className="pdng col-sm-12">
               <div className="pdtop pdng pdbtm17px col-sm-12">
                <form className=" bgwhite groupPostPadng col-sm-12 mb0px">
                  <div className="rosie">
                    <div className="pdng col-sm-12">
                      <div className="pdng col-sm-1">
                        <img src={'http://'+this.props.activeUser.profile_image_url} className="rosieImg" />
                      </div>
                      <div className="pdng col-sm-11">
                        <input type="text" id="txtPostInput" placeholder=" Write Something..." className="inptxt" onKeyDown={this.enterCapture.bind(this)} onChange={this.onRequired.bind(this)}/>
                      </div>
                    </div>
                    <div className="pdng col-sm-12">
                      <div className="pdng dividerLine1 col-sm-12"></div>
                    </div>
                    <div className="attach pdng  col-sm-12">
                      <div className="pdng col-sm-3">

                      </div>
                      <div className="col-sm-8"></div>
                      <div className="pdng col-sm-1">
                       <input type="button" id="addPost" value="Post" ref="addPost" onClick={this.addPost.bind(this)} className="btn pstBtn col-sm-12"   disabled={!this.state.postMsg} />
                      </div>
                    </div>
                  </div>
                </form>
                <div className="col-sm-12 zeroPad mt1pc groupScroll">
                {_.size(this.state.postsList)>0  && this.state.postsList.map((item, i) => {
                return (<div key={i}>
                           <div className="brdpx bradpx padngall mb1pc bgwhite col-sm-12 ">
                  <div className="brad">
                    <div className="col-sm-12 pdng">
                      <div className="pdng col-sm-12">
                        <div className="pdng col-sm-1">
                          <img src={'http://'+item.author.profile_image_url} className="bradImg" />
                        </div>
                        <div className="pdng col-sm-11">
                          <div className="col-sm-12">
                            <div className="prsnName">{item.author.first_name}</div>
                            <div className="prsnSeen">{item.created}</div>
                          </div>
                        </div>
                      </div>
                      <div className="msgRply col-sm-12">{item.title}</div>
                    </div>
                    <div className="col-sm-12 rspnsng">
                      <div className="col-sm-8"></div>
                      <div className="col-sm-4 pdng">
                        <div className="col-sm-12 pdng">
                          <span onClick={this.onLikeClick.bind(this, item.id)} className={(item.has_like)?"like color-green cursor-pointer":"like cursor-pointer"}><span className={(item.has_like)?("rspnsImg glyphicon glyphicon-heart color-green"):("rspnsImg glyphicon glyphicon-heart ")}></span>Like (<span className="likingNumber">{item.likes_count}</span>)</span>
                          <span className="cursor-pointer" onClick={this.focusOnCommentBox.bind(this, item.id)} className="comment cursor-pointer"><img src="/assets/img/icons/comment.png"  className="rspnsImg"/>Comment</span>
                        </div>
                      </div>
                    </div>
                    <div id="likeModal" className="modal fade" role="dialog">
                        <div className="modal-dialog modal-sm">
                          <div className="modal-content">
                            <div className="modal-header">
                              <button type="button" className="close" data-dismiss="modal">&times;</button>
                              <h4 className="modal-title">4 Likes <img src="/assets/img/icons/like.png"/></h4>
                            </div>
                            <div className="modal-body">
                                <p>Nick Zinos</p>
                                <p>Rosie Perez</p>
                                <p>Steve Harvey</p>
                                <p>Tim Carson</p>
                            </div>
      <div className="modal-footer">
        <button type="button" className="clsBtn btnGeneral" data-dismiss="modal">Close</button>
      </div>
    </div>

  </div>
</div>
            {_.size(item.comments)>0 && item.comments.map((childItem, childIndex)=>{
              return(<div key={childIndex} className="ml5pc"><div className="rosieRply col-sm-12 pdng">
                      <div className="pdng col-sm-1">
                        <img src={'http://'+childItem.author.profile_image_url} className="rosieImg" />
                      </div>
                      <div className="col-sm-11 pdng">
                        <div className="col-sm-12 pdng">
                          <div className="pdng col-sm-12">
                            <div className="col-sm-3 pdng prsnName">{childItem.author.first_name} {childItem.author.last_name}</div>

                          </div>
                          <div className="col-sm-12 pdng prsnSeen">{childItem.created}</div>
                          <div className="col-sm-6 pdng prsnMsg">{childItem.body}</div>
                        </div>
                      </div>
                    </div>
                    </div>)
            })}
                  <div className="steveRply col-sm-12 pdng ml5pc">
                      <div className="pdng col-sm-1">
                        <img src={'http://'+item.author.profile_image_url} className="SteveImg"/>
                      </div>
                      <div className="pdng brdrpx col-sm-11">
                        <div className="col-sm-12 pdng">
                          <div className="col-sm-11 pdng">
                            <textarea className="txtar" id={item.id+ "_txtComment"}></textarea>
                          </div>
                          <div className="col-sm-1 pdng">

                          </div>
                        </div>
                      </div>
                      </div>
                      </div>

                    <div>
                  <input type="button" value="Add Comment" onClick={this.Comment.bind(this, item.id)}  className="btnAddComment" />
                    </div>
                    </div>

                  </div>)
                  })}
                </div>
              </div>
            </div></div>)}
            </TabPanel>
            <TabPanel>
            {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(
            <div className="bgwhite pdtop2pc pdbtm3pc col-sm-12">
                 <div className="tophead col-sm-12">
                  <div className="col-sm-4">
                  <span className="fontclr">{_.size(this.state.membersList)} Members
                  </span>
                  </div>
                  <div className=" col-sm-3 addMembDropdown">
                    <button type="button" className="membersbtn col-sm-12 zeroPad" data-toggle="modal" data-target="#groupaddMembers" onClick={this.disableButn.bind(this)}>+ Add Member</button>
                    <div className="modal fade groupModalPopup" id="groupaddMembers" role="dialog" data-backdrop="static">
                    <div className="modal-dialog tpdialog">
                      <div className="modal-content">
                        <div className="modal-header col-sm-12 bgGreen">
                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                          <div className="modal-title">
                            ADD MEMBER
                          </div>
                        </div>
                        <div className="modal-body col-sm-12 bgwhite mb0px">
                        <div className="col-sm-12 txtRyt">
                          <input type="text" className="searchForAddMembers" placeholder="Search Users" onKeyPress={this.onAddmemberSearch.bind(this)}/>
                          <span className="glyphicon glyphicon-search addSearchglyph" />
                          </div>
                        <form id="addOrRemoveMemebrs" className="card-block">
                          <div className="col-sm-12">

                            {_.size(this.state.friends)>0  ? this.state.friends.map((item, i) => {return(<div  key={i}>
                              <div className="col-sm-2 mt1pc">
                              <label className="switch">
                                <input id={item.id} type="checkbox" className="membersList" name="is_private" defaultChecked={false} disabled={(this.props.activeUser.id==item.id)?true:false} onChange={this.deleteToggle.bind(this)}/>
                                <div className="slider round"></div>
                              </label>
                            </div>
                            <div className="col-sm-10 zeroPad">
                              <div className="col-sm-12 zeroPad">
                                <div className="col-sm-2 ">
                                  <img src={'http://'+item.profile_image_url} className="memberImg" />
                                </div>
                                <div className="col-sm-9 zeroPad mt15pcc">
                                  <div className="memberName">{item.last_name + ' ' + item.first_name}</div>
                                </div>
                              </div>
                            </div>
                            </div>)}):(<div>No members to show yet</div>)}
                          </div>
                          </form>
                        </div>
                        <div className="col-sm-12 bgwhite modal-footer">
                          <input type="button"onClick={this.addOrRemoveMembers.bind(this)} className=" btn sve-butn" id="deleteButton" value="Save" disabled={this.state.buttonDisabled}/>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
              <div className="searchbox col-sm-3">
               <span className="glyphicon glyphicon-search glyphiconforSearch"></span> <input onKeyPress={this.onFriendsSearch.bind(this)} type="text" className="searchbr" placeholder=" Find a Member"/>
               </div>


                    <div className="dividertag"></div>
                  </div>
                  <div className="col-sm-12">
                  {_.size(this.state.membersList)>0  && this.state.membersList.map((item, i) => {
                  return <div key={i} className="col-sm-6">
                  <div className="col-sm-12 zeroPad">
                          <div className="col-sm-4">
                              <img src={'http://'+item.profile_image_url} className="moealdo"></img>
                          </div>
                          <div  className="col-sm-8 mt5pcc">
                            <h2 className="fnt41px">{item.last_name + ", " + item.first_name}</h2>
                            <p></p>
                          </div>
                      </div>
                      </div>
                  })}
              </div>
              </div>)}
            </TabPanel>
            <TabPanel>
{(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(
            <div className="galleryDetails bgwhite pdtop2pc pdbtm3pc col-sm-12">
                     <div className="col-sm-12">
                     <div className="photos col-sm-6">
                         <h3 className="m0px fnt18px">{_.size(this.state.galleryList)} Photos</h3>
                     </div>
                     <div className="adbtn col-sm-6 pdng">
                         <button className="photobtn">Add Photos</button>
                         <input ref="file" id="file" type="file" name="file" onChange={this.uploadFile} className="upload-file form-control" accept="image/*" multiple />
                     </div>
                     </div>
                     <div className="col-sm-12 dividertag mb3pc mt1pc"></div>
                     <div className=" col-sm-12">
                       <div className="firstrow pdryt0px col-sm-12">
                            {_.size(this.state.galleryList)>0 && this.state.galleryList.map((item, index)=>{
                                return(<div key={index} className="col-sm-3"><img src={'http://'+item.image} className="imgg"></img></div>);
                            })}
                       </div>
                    </div>
                </div>)}
            </TabPanel>
            <TabPanel>
            {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(
            <div className="bgwhite pdtop2pc pdbtm3pc col-sm-12">
            <div className="col-sm-12">

            <div>
                <span>Events</span>
                <button onClick={this.onButtonClick.bind(this, "Create")}  className="btnCreateEvent">Create Event</button>
               <div className="col-sm-12"><div className="col-sm-4 pdtop"><ul className="groupEventScroll">
               {_.size(this.state.currentEventList)>0 && this.state.currentEventList.map((eventDetail, index)=>{
                     return(<div key={index}><EventListDetail id="catList" eventsList={this.state.currentEventList} eventDetail={eventDetail} onEventClick={this.onEventClick.bind(this)} /></div>);
               })}
               </ul></div> 
                {(this.state.isCreateOrEdit=="Create" || this.state.isCreateOrEdit=="Edit")?(<CreateEvent onSaveClick={this.onSaveClick.bind(this)} isCreateOrEdit={this.state.isCreateOrEdit} upComingeventDetail={this.state.upComingeventDetail} />):((this.state.upComingeventDetail!=undefined && _.size(this.state.upComingeventDetail)>0)?(<UpcomingEventDetails onButtonClick={this.onButtonClick.bind(this)} onRequestInviteClick={this.onRequestInviteClick.bind(this)} upComingeventDetail={this.state.upComingeventDetail} activeUser={this.props.activeUser} />):(<div className="mt2pc"></div>))}
               
               </div>
            </div>

            <div className="dividerLine1"></div>

            <div className="col-sm-5">

            </div>
            </div>

             </div>)}
            </TabPanel>

            </Tabs>

    </div>
    </div>
              </div>



               </div>
            );
    }
}
GroupMembers.contextTypes= {
     router: React.PropTypes.object.isRequired
}
function mapStateToProps(state) {
    return {
        activeUser: (state.activeUser!=null && state.activeUser!=undefined)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
        selectedGroup:state.selectedGroup,
        myProfile: (state.myProfile!=undefined&& state.myProfile!=null)?state.myProfile:[],
        friends: state.friends,
        eventList: (state.eventReducer!=undefined && state.eventReducer!=null)?state.eventReducer:[],
        selectedEvent: state.selectedEvent,
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({createEvents, groupDetails, getGroupMembersList, searchGroupMembers, 
      addComment,  getGroupPostsList, addNewPost, userProfileDetails, getGroupsGallery, leaveGroup,
       editGroupInfo, getGroupFilesList, getGroupMembers, getCurrentEventsDetailsList, likePost,
       addOrRemoveGroupMemebrs, getCurrentEvent, eventDetails, searchaddMembers, editEvents, RequestGroup}, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps) (GroupMembers);
