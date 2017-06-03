import React, {PropTypes, Component} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import Spinner from 'react-spinner';
import {React_Boostrap_Carousel} from 'react-boostrap-carousel';
var serialize = require('form-serialize');

import {eventDetails, getCurrentEvent} from '../actions/eventDetailsAction';
import {createEvents, editEvents} from '../actions/createEventAction';
import {getMyCourses, getMyPosts, userProfileDetails, getFriends, searchFriends,
  searchGroups, editCourseNotes, addNewScore, profilegroupList} from '../actions/profileActions';
import {getCourseObject} from '../actions/courseListAction';


import EventListDetail from './child-components/eventListDetail';
import UpcomingEventDetails from './child-components/upcomingEventDetails';
import CreateEvent from './child-components/createEvent';
import GroupsList from './child-components/groupsList';

let paramId;
class MyProfile extends React.Component {
  constructor(props) {
        super(props);
        this.state={
          currentEventList: Object.assign([],props.eventList.CurrentEvents),
          getGroupList:Object.assign([], props.myProfile.MyGroups),
          profileCoursesList: Object.assign([],props.myProfile.MyProfileCourseList),
          postsList:Object.assign([],props.myProfile.MyPostsList),
          courseDetails:{},
          Notes:Object.assign([], props.myProfile.notes),
          upComingeventDetail:Object.assign({}, props.selectedEvent),
          isCreateOrEdit: "Upcoming",
          profileDetails: Object.assign({}, props.myProfile.MyProfile),
          myFriendsList: Object.assign([], props.myProfile.MyFriends),
          ajaxCallInProgress:false,
          errScore : ""
        };
         this.onFieldChange=this.onFieldChange.bind(this);

  }
  onFieldChange(e){

    }
  onSaveNotes(){
  let form = document.querySelector('#NotesForm');
       let formData = serialize(form, { hash: true });
       this.props.editCourseNotes(formData,this.props.selectedCourse.course.id,  this.props.activeUser.token).then(()=>{
           this.setState({Notes:this.props.myProfile.notes});
           $('#myModal').modal('hide');
         }).catch((error)=>{
         });
    }
    addNewScores(id){

      let score = document.getElementById('txtScoreInput');
      let played_on=document.getElementById('txtDate');
        if(this.refs.lastScore.value == "" || this.refs.lastScore.value > 200 || this.refs.lastScore.value < 18){
          this.refs.lastScore.focus();
        }
        else if(this.refs.scoreDate.value == "" || this.refs.scoreDate.value == undefined){
          this.refs.scoreDate.focus();
        }
        else{
       this.props.addNewScore(this.props.activeUser.token, this.props.selectedCourse.course.id, score.value, played_on.value).then(()=>{

        document.getElementById('txtScoreInput').value='';
        document.getElementById('txtDate').value='';
        $('#myModal1').modal('hide');

      }).catch((error)=>{
      });
      }
    }
    componentWillMount(){
      this.setState({ajaxCallInProgress:true});
      let urlPath = _.split(location.pathname, '_');
      paramId =  (_.size(urlPath)>0)?(_.toInteger(urlPath[1])):(0);
      /// TO Get the User Profile Details

      this.props.userProfileDetails(this.props.activeUser.token).then(()=>{
          this.setState({profileDetails:this.props.myProfile.MyProfile, ajaxCallInProgress:false});
        }).catch((error)=>{
            if(error == "Error: Request failed with status code 401"){
            this.context.router.push('/');
             }
            this.setState({ajaxCallInProgress:false});
        });


      /// To Get the Courses List
      this.props.getMyCourses(this.props.activeUser.token).then(()=>{
           this.setState({profileCoursesList:this.props.myProfile.MyProfileCourseList, ajaxCallInProgress:false});
       }).catch((error)=>{
          if(error == "Error: Request failed with status code 401"){
            this.context.router.push('/');
             }
            this.setState({ajaxCallInProgress:false});
       });


        /// To Get the events details if the myUpcoming events selected
         if(_.toInteger(paramId)==4){
           this.props.eventDetails(this.props.activeUser.token).then(()=>{
                  this.setState({currentEventList:this.props.eventList.CurrentEvents});
            }).catch((error)=>{
          });
        }
    }

    componentDidMount() {
        $('.menu').parent().removeClass('active');
    }

    componentWillReceiveProps(nextProps){
              if(this.props.myProfile.MyProfileCourseList!=nextProps.myProfile.MyProfileCourseList){
                        this.setState({profileCoursesList:nextProps.myProfile.MyProfileCourseList});
              }

              if(this.props.myProfile.MyPostsList!=nextProps.myProfile.MyPostsList){
                    this.setState({postsList:nextProps.myProfile.MyPostsList});
              }

              if(this.props.myProfile.notes!=nextProps.myProfile.notes){
                this.setState({Notes:nextProps.myProfile.notes});
              }

              if(this.props.eventList.CurrentEvents!=nextProps.eventList.CurrentEvents){
                     this.setState({currentEventList:nextProps.eventList.CurrentEvents});
              }

              if(this.props.myProfile.MyGroups!=nextProps.myProfile.MyGroups){
                      this.setState({getGroupList:nextProps.myProfile.MyGroups});
              }

              if(this.props.myProfile.MyProfileCourseList!=nextProps.myProfile.MyProfileCourseList && _.size(this.state.courseDetails)==0 && _.size(nextProps.myProfile.MyProfileCourseList)>0){
                    this.showCourseDetails(nextProps.myProfile.MyProfileCourseList[0].id);
              }

             if(this.props.selectedCourse!=nextProps.selectedCourse){
                 this.setState({courseDetails:nextProps.selectedCourse});
             }

              if(_.size(this.state.upComingeventDetail)==0 && _.size(this.state.currentEventList)>0){
                      this.getEvent(this.state.currentEventList[0].id);
              }
    }


modifyParam(index){
      this.setState({ajaxCallInProgress:true});
      /*this.context.router.push('/profile_' + index);*/
      this.context.router.push('/profile_'+index);
      paramId = index;
      if(index==0){
        this.props.getMyCourses(this.props.activeUser.token).then(()=>{
             this.setState({profileCoursesList:this.props.myProfile.MyProfileCourseList, ajaxCallInProgress:false});

         }).catch((error)=>{
           this.setState({ajaxCallInProgress:false});
         });

          if(_.size(this.state.courseDetails)==0 && _.size(this.props.myProfile.MyProfileCourseList)>0){
                this.showCourseDetails(this.props.myProfile.MyProfileCourseList[0].id);
          }
      }
      else if(index==1){
      this.props.getMyPosts(this.props.activeUser.token).then(()=>{
          this.setState({postsList:this.props.myProfile.MyPostsList, ajaxCallInProgress:false});

      }).catch((error)=>{
        this.setState({ajaxCallInProgress:false});
      });
     }
     else if(index==2){
       this.props.profilegroupList(this.props.activeUser.token).then(()=>{
         this.setState({getGroupList:this.props.myProfile.MyGroups, ajaxCallInProgress:false});

         }).catch((error)=>{
       this.setState({ajaxCallInProgress:false});
       });
     }
     else if(index==3){
       this.props.getFriends(this.props.activeUser.token).then(()=>{
          this.setState({myFriendsList:this.props.myProfile.MyFriends, ajaxCallInProgress:false});

        }).catch((error)=>{
          this.setState({ajaxCallInProgress:false});
       });
     }
     else if(index==4){
       this.props.eventDetails(this.props.activeUser.token).then(()=>{
             this.setState({currentEventList:this.props.eventList.CurrentEvents, ajaxCallInProgress:false});

         }).catch((error)=>{
           this.setState({ajaxCallInProgress:false});
         });
     }
}

  onFriendsSearch(e){
         if(e.which==13){
           this.props.searchFriends(this.props.activeUser.token, e.target.value).then(()=>{
                 this.setState({myFriendsList:this.props.myProfile.MyFriends});
                 this.context.router.push('/profile_3');
           }).catch((error)=>{
           });
         }
   }

 onGroupsSearch(e){

    if(e.which==13){
      this.props.searchGroups(this.props.activeUser.token, e.target.value).then(()=>{
            this.setState({getGroupList:this.props.myProfile.MyGroups});
            this.context.router.push('/profile_2');
      }).catch((error)=>{
      });
    }
 }

onGroupClick(groupId){
    this.context.router.push('/groupMembers_'+groupId);
}

    getEvent(eventId){
      this.props.getCurrentEvent(eventId, this.props.activeUser.token).then(()=>{
        this.setState({upComingeventDetail:this.props.selectedEvent});
      }).catch((error)=>{
      });
  }

    onSaveClick(formData){
      if(this.state.isCreateOrEdit=="Create"){
       this.props.createEvents(formData, this.props.activeUser.token).then(()=>{
         this.props.eventDetails(this.props.activeUser.token).then(()=>{
             this.setState({currentEventList:this.props.eventList.CurrentEvents, isCreateOrEdit: "Upcoming"});
             this.getEvent(this.props.eventList.CurrentEvents[0].id);
         }).catch((error)=>{
         });
       }).catch((error)=>{
       });
      }
      else {
        this.props.editEvents(formData,this.state.upComingeventDetail.id, this.props.activeUser.token).then(()=>{
          this.props.eventDetails(this.props.activeUser.token).then(()=>{
              this.setState({currentEventList:this.props.eventList.CurrentEvents, isCreateOrEdit: "Upcoming"});
              this.getEvent(this.props.eventList.CurrentEvents[0].id);
          }).catch((error)=>{
          });
        }).catch((error)=>{
        });
      }
    }

    onButtonClick(val){
      this.setState({isCreateOrEdit:val});
    }

    onEventClick(eventsList, eventId){
      this.getEvent(eventId);
      this.setState({isCreateOrEdit: "Upcoming"});
      this.context.router.push('/profile_4');
    }

    onRequestInviteClick(){
    }

    showCourseDetails(id){
      this.props.getCourseObject(id, this.props.activeUser.token).then((id)=>{
         this.setState({courseDetails:this.props.selectedCourse});
      }).catch((error)=>{
      });
    }
    errMsg(e){
      if(e.target.value == "" || e.target.value < 18 || e.target.value > 200){
        this.setState({
          errScore : (<span className="color-red">Please enter score between 18-200 </span> )
        });
      }
        else {
          this.setState({
          errScore : ""
        });
        }
      }

      noAlpha(e) {

    if(e.target.name == "lastScore"){

    const re = /[0-9]+/g;

    if ((!re.test(e.key)) || (e.target.value.length >= 3)){

        e.preventDefault();

        }
      }
     }


    render() {
         return(
             <div className="overflow-scroll bgccc">
        <div className="myProfile_Posts">
           <div className="img-cntnt col-sm-12 zeroPad">
            <div className="profileimg mb2pc">
              <div className="cover-img col-sm-12 zeroPad"><img src="/assets/img/ProfileImage.png" className="coverimg col-sm-12 zeroPad"></img></div>
              <div className="img-feed col-sm-12">
                  <h3 className="col-sm-12">My Clubhouse</h3>
               </div>
            </div>
          </div>

            <div className="profileContent">
               {((_.size(this.state.profileDetails)>0) && this.state.profileDetails.profile!=undefined && this.state.profileDetails.profile!=null)?(<div className="detailsPart col-sm-12">
                      <div className="namePart col-sm-10">
                        <div className="col-sm-2 pdryt12px">

         <img src={'http://'+ this.state.profileDetails.profile.profile_image_url} className="nameImg" />
                        </div>

                        <div className="col-sm-3 pdng">
                          <div className="personDetails pdng col-sm-12">
                              <div className="personName">{this.state.profileDetails.profile.first_name}</div>
                              <div className="personJoined">Joined:{this.state.profileDetails.profile.joined} ago</div>
                          </div>
                        </div>
                         <div className="margtp pdng col-sm-3">
                             <div className="col-sm-12 pdng">
                                 <div className="pdng fntbld col-sm-6">Skill Level</div>
                                 <div className="pdng fntlyt col-sm-6">{this.state.profileDetails.skills.skill_level}</div>
                             </div>
                             <div className="col-sm-12 pdng">
                                 <div className="pdng fntbld col-sm-6">Type of Golfer</div>
                                 <div className="pdng fntlyt col-sm-6">{this.state.profileDetails.skills.golfer_type}</div>
                             </div>
                          </div>
                          <div className="margtp pdng col-sm-3">
                             <div className="col-sm-12 pdng">
                                 <div className="pdng fntbld col-sm-6">Profile Type</div>
                                 <div className="pdng fntlyt col-sm-6">{this.state.profileDetails.profile.is_private?'Private':'Public'}</div>
                             </div>
                             <div className="col-sm-12 pdng">
                                 <div className="pdng fntbld col-sm-6">Handicap</div>
                                 <div className="pdng fntlyt col-sm-6">{(this.state.profileDetails.skills.handicap==0)?0:this.state.profileDetails.skills.handicap}</div>
                             </div>
                          </div>
                      </div>
               </div>):(<div><label>No Details Available</label></div>)}

              <div className="tabsForEvents">
              <Tabs selectedIndex={_.toInteger(paramId)}>
              <TabList className="EventsTabHeader">
              <Tab onClick={this.modifyParam.bind(this, 0)}>Courses</Tab>
              <Tab onClick={this.modifyParam.bind(this, 1)}>Posts</Tab>
              <Tab onClick={this.modifyParam.bind(this, 2)}>Groups</Tab>
              <Tab onClick={this.modifyParam.bind(this, 3)}>Friends</Tab>
              <Tab onClick={this.modifyParam.bind(this, 4)}>Events</Tab>
        </TabList>
         <TabPanel>
            {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(<div className="images visitedDetails col-sm-12">
                    <div className="leftsideimgs col-sm-4 profilescroll">
                    {_.size(this.state.profileCoursesList)>0  && this.state.profileCoursesList.map((item, i) => {
                    return (<div key={i}><div className="leftimg1" onClick={this.showCourseDetails.bind(this,item.id)}>
                    <div className="nameoverimg">
                       <img src="/assets/img/golf-shadow-creek-03.png" className="img1"></img>
                         <div className="following">
                           <span className="OrangeDot">
                              <img src="/assets/img/icons/eclipse.png"/></span>Following</div>
                                <center>  <span className="center">{item.name}</span></center>
                        </div>
                        <p className="left col-sm-6">{item.city}</p>
                        <p className="ryt col-sm-8">{item.created_on}</p></div>
                    </div>)
                    })}
                    </div>

                    {(this.state.courseDetails.course_user_details!=undefined && _.size(this.props.myProfile.MyProfileCourseList)>0)?(
                      <div className="rightsideimgs col-sm-8">
                        <div className="rytsideimg1">
                            <div className="nameoverimg"><img src="/assets/img/golf-shadow-creek-04.png" className="img4"></img>
                             {(this.state.courseDetails.course_user_details.is_following)?(<div className="following">
                              <span className="OrangeDot">
                                    <img src="/assets/img/icons/eclipse.png"/></span>Following</div>):(<div></div>)}
                                      {(this.state.courseDetails.course_user_details.is_played)?(<div className="top-ryt">  <span className="topryt">Played</span> </div>):(<div></div>)}
                                      <Link to={"/courses_"+ this.state.courseDetails.course.id}><div className="cursor-pointer"><center>       <span className="center">{this.state.courseDetails.course.name}</span></center></div></Link>
                        </div>
                        <div className="scores col-sm-12">
                        <div className="score1 col-sm-6">
                            <ul className="scre"><li className="name">My Best Score</li>
                                <li className="date">{this.state.courseDetails.course_user_details.top_score_date}</li></ul>
                                <p className="score">{this.state.courseDetails.course_user_details.top_score}</p>
                        </div>
                        <div className="score2 col-sm-6 cursor-pointer" data-toggle="modal" data-target="#myModal1">
                            <ul className="scre"><li className="name">My Last Score</li>
                                <li className="date">{this.state.courseDetails.course_user_details.latest_score_date}</li></ul>
                            <p className="score">{this.state.courseDetails.course_user_details.latest_score!=null?this.state.courseDetails.course_user_details.latest_score:'Click to add new score'}</p>
                            <span>{this.state.courseDetails.course_user_details.latest_score!=null?'Click to add new score':''}</span>
                        </div>
                        <form id="AddScore">
                         <div className="modal fade" id="myModal1" role="dialog">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal">&times;</button>
          <h4 className="modal-title">Add Score</h4>
        </div>
        <div className="form-group col-sm-12">

          <label>Last Score:</label>
          <input type="text" className="form-control" id="txtScoreInput" name="lastScore" ref="lastScore"  onKeyPress={this.noAlpha.bind(this)}  onBlur={this.errMsg.bind(this)}/>
          {this.state.errScore} <br/>
          <label>Date:</label>
          <input type="date" className="form-control" id="txtDate" ref="scoreDate" />

        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" onClick={this.addNewScores.bind(this)}>Save</button>
        </div>
      </div>
    </div>
  </div>
  </form>
                        </div>


                         </div>

                        <div className="notes">
                            <p>Notes<span className="glyphicon glyphicon-pencil" data-toggle="modal" data-target="#myModal"></span></p>

                   <p className="xx" maxLength="250">{(this.state.Notes==null)?(this.props.selectedCourse.course_user_details.notes):(this.state.Notes.notes)}</p>
                        </div>

                        <div className="modal fade mt20pc" id="myModal" role="dialog"  >
    <div className="modal-dialog modal-sm">
    <form id="NotesForm" >
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal">&times;</button>
          <h4 className="modal-title">Edit Notes</h4>
        </div>
        <div className="modal-body">

         <textarea className=" wd100pc hgt130px" maxLength="250" id="notes" onChange={this.onFieldChange} name="notes" defaultValue={this.state.courseDetails.course_user_details.notes}></textarea>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default"  onClick={this.onSaveNotes.bind(this)}>Submit</button>
        </div>
      </div>
      </form>
    </div>
  </div>

                    </div>):(<div><label>You are not following any courses yet</label></div>)}
                </div>)}
        </TabPanel>
    <TabPanel>
                {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite "><Spinner /></div>):(<div className="col-sm-12 bgwhite hAuto">
                <div className=" col-sm-12">
                    <h3>Post</h3>
                    <div className="pdright">
                    {_.size(this.state.postsList)>0 && this.state.profileDetails.profile!=undefined && this.state.profileDetails.profile!=null && _.size(this.state.postsList)>0 ? this.state.postsList.map((item, i) => {
                    return (<div key={i}>
                    <div className="post1">
                        <div className="subpost">
                            <img src={'http://'+ this.state.profileDetails.profile.profile_image_url} className="post-img"></img>
                            <div className="post-name">
                            <h3>{this.props.activeUser.name}</h3>
                            <h4>{item.created}</h4>
                            <p>{item.created_since}</p>
                        </div>
                            </div>
                        <div className="subpost-cntnt">
                            <span>{item.title}</span>
                        </div>
                        {_.size(this.state.postsList.comments)>0  && this.state.postsList.comments.map((item, i) => {
                        return(<div key={i}><div className="cmnt">
                            <span className="like"><img src="/assets/img/icons/like.png"/>Like</span>
                            <span className="comment"><img src="/assets/img/icons/comment.png"/>Comment</span>
                        </div>
                        <div className="Rosie-rply">
                            <img src="/assets/img/Rosie Perez.png" className="Rosie-img"></img>
                            <div className="Rosie-name">
                                  <h3>Rosie Perez</h3>
                                  <p>Same here! I can’t wait!!!</p>
                                  <h4>June 10 @ 9:33pm</h4>
                            </div>
                        </div></div>)
                        })}
                    </div>

                    </div>)
                    }):<div><label>No posts yet</label></div>}
                    </div>
            </div>
              </div>)}
        </TabPanel>
        <TabPanel>
        {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(<div className="profilegrpDetails col-sm-12">

            <div className="row m0px heightAndScrollForGroup">

              <div className="search-icon col-sm-12">
                <span className="postrelative left3pc"><img src="/assets/img/icons/Search_Icon.png"/></span>
                    <input onKeyPress={this.onGroupsSearch.bind(this)} type="text" placeholder="Search for a group" className="profGroupSearch"></input>
                </div>
            {(_.size(this.state.getGroupList)>0)?(<div className="row">
          <div>
          <div className="row">
          <div className="col-md-12 wd98pc ml4pc">
          <div className="col-sm-12">
          <React_Boostrap_Carousel  className="carousel-fade" indicators={(_.size(this.state.getGroupList)>0 && _.size(this.state.getGroupList[0])>=7)?true:false}>
          {_.size(this.state.getGroupList)>0 && this.state.getGroupList.map((parent, index)=>{
              return(<div className="col-sm-12 pdpcgroups" key={index}>
                <div>{(index==0)?(
                  <Link to="/addgroup" className="col-md-3">
                        <div className="col-sm-12 txtcenter">
                                <img src={"/assets/img/plus_icon-01.png"} alt="" className="panelimg bgccc"/>
                         </div>
                         <div className="col-sm-12 txtcenter">
                                <span className=" txtcenter">Add Group</span>
                         </div>
                 </Link>):('')}</div>
                {_.size(parent)>0 && parent.map((groupListDetails, childIndex)=>{
                return(
                   <div key={childIndex}>
                   <div onClick={this.onGroupClick.bind(this,groupListDetails.id)}>
                    <div className="col-md-3 cursor-pointer">
                    <div className="col-sm-12 txtcenter">
                      <img src={'http://'+groupListDetails.cover_image} className="panelimg"/>
                      </div>
                         <div className="col-sm-12 txtcenter">
             <span className=" txtcenter ">{_.truncate(_.trim(groupListDetails.name), {
                        'length': 24,
                        'separator': ' '
                      })}</span>
                      </div>
                    </div>
                </div>
                </div>);
              })}</div>)
            })}

            </React_Boostrap_Carousel>
            </div>
            </div></div>
          </div>
          </div>):( <Link to="/addgroup" className="col-md-3">
          <div className="col-sm-12">
                                <img src={"/assets/img/plus_icon-01.png"} alt="" className="panelimg bgccc"/></div>
                                <span className="col-sm-12 pdlft7pc ">Add Group</span>
                 </Link>)}

</div>
</div>)}
        </TabPanel>
        <TabPanel>
        {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(<div className="profilefrndDetails col-sm-12">
                <div className="search-icon col-sm-12">
                <span className="posrelative left3pc"><img src="/assets/img/icons/Search_Icon.png"/></span>
                    <input onKeyPress={this.onFriendsSearch.bind(this)} type="text" placeholder="Search for a friend" className="profFrndSearch"></input>
                </div>
                <div className="friendlist col-sm-12">
                    <div className="col-sm-12">
                    {_.size(this.state.myFriendsList)>0?(<div>
                    {this.state.myFriendsList.map((item, i) => {
                    return <Link to={'/profileDetail_'+item.id}><div key={i} className="col-sm-6">
                        <span className="frndlist1"><img src={'http://'+ item.profile_image_url} />
                           <div className="frnd-name">
                            <h3>{item.first_name}</h3>
                            <p>{item.email}</p>
                            <p><label>Joined: {item.joined} ago</label></p>
                           </div>
                        </span>
                        </div></Link>
                    })}</div>):(<div><label>No Friends Found</label></div>)}
                    </div>
                </div>
            </div>)}
        </TabPanel>
        <TabPanel>
{(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(<div className="col-sm-12 bgwhite pdtop">
        <div className="col-sm-4 eventScroll">
             <button onClick={this.onButtonClick.bind(this, "Create")} className="btnEvent">+ Create Event</button>
                  {_.size(this.state.currentEventList)>0  && this.state.currentEventList.map((eventDetail, index)=>{
                      return(<div key={index}><EventListDetail eventsList={this.state.currentEventList} eventDetail={eventDetail} onEventClick={this.onEventClick.bind(this)} /></div>);
                  })}
                    </div>
                      {(this.state.isCreateOrEdit=="Create" || this.state.isCreateOrEdit=="Edit")?(<CreateEvent onSaveClick={this.onSaveClick.bind(this)} isCreateOrEdit={this.state.isCreateOrEdit} upComingeventDetail={this.state.upComingeventDetail} />):((this.state.upComingeventDetail!=undefined && _.size(this.state.upComingeventDetail)>0)?(<UpcomingEventDetails onButtonClick={this.onButtonClick.bind(this)} onRequestInviteClick={this.onRequestInviteClick.bind(this)} upComingeventDetail={this.state.upComingeventDetail} activeUser={this.props.activeUser} />):(<div></div>))}
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
MyProfile.contextTypes = {
  router: React.PropTypes.object
};


function mapStateToProps(state) {
    return {
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),

        eventList:   (state.eventReducer!=undefined && state.eventReducer!=null)?state.eventReducer:[],
        myProfile:   (state.myProfile!=undefined && state.myProfile!=null)?state.myProfile:[],
        selectedCourse: state.selectedCourse,
        selectedEvent: state.selectedEvent,
        selectedGroup:state.selectedGroup
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({eventDetails, getMyCourses, getMyPosts, getCourseObject, createEvents, getCurrentEvent, userProfileDetails, getFriends, searchFriends,  searchGroups, editEvents, editCourseNotes, addNewScore, profilegroupList}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps) (MyProfile);
