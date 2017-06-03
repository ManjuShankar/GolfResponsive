import React, {Component} from 'react';
import {Link} from 'react-router';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import _ from 'lodash';
import {courseList,getCourseObject, searchCourses, unFollowCourse, getCurrentEventsDetailsList,
 getPastEventsDetailsList, groupList} from '../actions/courseListAction';
import {eventDetails} from '../actions/eventDetailsAction';
import EventListDetail from './child-components/eventListDetail';
import NonPremiumCourse from './child-components/nonPremiumCourse';
import GoogleMap from 'google-map-react';
import Marker from './marker.js';

import Spinner from 'react-spinner';

import moment from 'moment';
//import {Calendar} from './child-components/calendarExample';
//import {ScrollView} from 'react-native'

let next="";
class CourseContainer extends Component{

    constructor(props,context){
        super(props,context);
        this.state={
                    loggedInUser:props.activeUser,
                    getCourseslist:Object.assign([],props.getCourseList),
                    currentEventList:Object.assign([],props.courseEvent.Upcoming),
                    pastEventList:Object.assign([],props.courseEvent.Past),
                    courseDetails:{},
                    following:0, getGroupList:Object.assign([],props.courseEvent.Groups),
                    pageNumber:1,
                    lastScrollPos:0

        };
          this.handleScroll = this.handleScroll.bind(this);
    }
     componentWillMount(){
        this.getCourseListData();
        this.setState({ajaxCallInProgress:true});
    }

      getCourseListData(pageNumber=0){
      if(next!=null){
                let keyword =(document.getElementById('keyword')!=undefined && document.getElementById('keyword')!=null)?(_.trim(document.getElementById('keyword').value)):('');
                  this.props.courseList(this.props.activeUser.token, pageNumber, keyword).then((data)=>{
                    next = data;
                    this.setState({getCourseslist:this.props.getCourseList});
                    this.setState({ajaxCallInProgress:false});
                  }).catch((error)=>{
                  if(error == "Error: Request failed with status code 401"){
                        this.context.router.push('/');
                  }
            });
        /*}
        else if($("#keyword").val()!=""){
          this.props.courseList(this.props.activeUser.token, pageNumber, $("#keyword").val(), this.state.getCourseslist).then((data)=>{
            next = data;
            this.setState({getCourseslist:this.props.getCourseList});
            this.setState({ajaxCallInProgress:false});
          }).catch((error)=>{
            if(error == "Error: Request failed with status code 401"){
            this.context.router.push('/');
          }
        });
      }*/
    }
  }

    componentWillReceiveProps(nextProps){
        /*if(this.props.getCourseList!=nextProps.getCourseList){
            this.setState({getCourseslist:nextProps.getCourseList});
        }*/
        if(this.props.courseEvent!=nextProps.courseEvent){
                this.setState({currentEventList:nextProps.courseEvent.Upcoming,
                pastEventList:nextProps.courseEvent.Past,
              getGroupList:nextProps.courseEvent.Groups});
        }

        if(this.props.selectedCourse!=nextProps.selectedCourse){
                this.setState({courseDetails:nextProps.selectedCourse});
        }

        if(this.props.getCourseList!=nextProps.getCourseList && _.size(this.state.courseDetails)==0 && _.size(nextProps.getCourseList)>0){
          if(this.props.params.courseId!=undefined){
            let paramId= _.toInteger(this.props.params.courseId);
            this.showCourseDetails(paramId);
          }else{
            this.showCourseDetails(nextProps.getCourseList[0].id);
          }
        }
    }

     showCourseDetails(id){
       this.props.getCourseObject(id, this.props.activeUser.token).then((id)=>{
          this.setState({courseDetails:this.props.selectedCourse});
          this.modifyParam();
          this.getGroups();
       }).catch((error)=>{
       });

     }

     handlefollowChange(e){
        this.setState({following:e.target.value});
    }

    OnUnfollow(){

      this.props.unFollowCourse(this.props.activeUser.token, this.state.courseDetails.course.id).then((data)=>{

      }).catch((error)=>{

    });
   }

      onCourseSearch(e){
          if(e.which==13){
            console.log("TargetValue", e.target.value);
            this.props.courseList(this.props.activeUser.token, 0, _.trim(e.target.value)).then(()=>{
                  this.setState({getCourseslist:this.props.getCourseList});
            }).catch((error)=>{
                console.log("Error", error);
            });
          }
      }

  componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidMount() {
      $('.menu').parent().removeClass('active');
      $('#course').parent().addClass('active');
      window.addEventListener('scroll', this.handleScroll);
   }


   handleScroll(event) {
     let el = document.getElementById('golfCourseList');
     if(el.scrollHeight - el.scrollTop - el.clientHeight < 1){
         event.currentTarget.scrollTop=event.currentTarget.scrollHeight;
              this.state.lastScrollPos = event.currentTarget.scrollTop,
              this.state.pageNumber = this.state.pageNumber + 1;
              this.getCourseListData(this.state.pageNumber);
      }
  }

 modifyParam(){



        this.props.getCurrentEventsDetailsList(this.props.activeUser.token,this.state.courseDetails.course.id).then(()=>{
            this.setState({currentEventList:this.props.courseEvent.Upcoming});
              console.log("currentEventList",this.state.currentEventList);

        }).catch((error)=>{
             console.log("Error", error);
        });
        this.props.getPastEventsDetailsList(this.props.activeUser.token,this.props.selectedCourse.course.id).then(()=>{

 this.setState({pastEventList:this.props.courseEvent.Past});


        }).catch((error)=>{
             console.log("Error", error);


        });


}
getGroups(){

   this.props.groupList(this.props.activeUser.token, this.state.courseDetails.course.id).then(()=>{
            this.setState({getGroupList:this.props.courseEvent.Groups});
        }).catch((error)=>{

        });
}

     render(){

         if(_.size(this.state.getCourseslist)>0){
         return(
           <div id="courseSearch" className="leftBody">
            {(this.state.ajaxCallInProgress)?(<div className="mt25pc"><Spinner /></div>):(<div  id="courseScroll" className="coursesContainner">
            <div className="coursesHeader">Courses</div>
            <div className="coursesContent">
                <div className="col-sm-4">
                    <div className="searchResult" id="scroll">
                        <div className="CoursesSearchBox" > <span className="CoursessearchIcon"><img src="/assets/img/icons/Search_Icon.png" /></span>
                            <input onKeyPress={this.onCourseSearch.bind(this)} type="text" placeholder="Search Courses" id="keyword"/> </div>
                            <ul id="golfCourseList" onScroll={this.handleScroll}>
                              {_.size(this.state.getCourseslist)>0 && this.state.getCourseslist.map((item, index)=>{
                              return(<div key={index} onClick={this.showCourseDetails.bind(this,item.id)}>
                                      <li className={(_.size(this.state.courseDetails)>0 && this.state.courseDetails!=undefined && this.state.courseDetails!=null && this.state.courseDetails.course.id==item.id)?("selected_element"):("")}>
                                        {(item.is_premium)?(<span className="glyphicon glyphicon-star starImg"></span>):('')}
                                        <span className="fieldName col-sm-10">{item.name}</span>
                                        <span className="col-sm-1 glyphicon glyphicon-menu-right"></span>
                                      </li>
                                     </div>);
                              })}
                        </ul>
                    </div>
                </div>
                {(_.size(this.state.courseDetails)>0 && this.state.courseDetails.course.is_premium)?(<div className="premium">
                <div className="col-sm-8 removePadding">

                    <div className="imgGolf"><img src="/assets/img/premuim/golfImg.png"/></div>
                    <div className="col-sm-6"><div className="following">{((_.size(this.state.courseDetails)>0 && this.state.courseDetails.course_user_details.is_following)?(<span><span className="OrangeDot"><img src="/assets/img/icons/eclipse.png"/></span>Following</span>):(<span className="clrTrnsparnt">following</span>))}</div></div>
                    <div className="col-sm-6"><div className="played">{(_.size(this.state.courseDetails)>0 && this.state.courseDetails.course_user_details.is_played)?'Played':''}</div></div>
                    <div className="col-sm-12"><div className="coursesTitle">{(_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.name:''}</div></div>
                    </div>

                <div className="coursesScrollRight">
                    <div className="col-sm-6 removePadding">

                      <div className="unfollowCourses"><button type="button" className="unfllw-butn"  onClick={this.OnUnfollow.bind(this)}>{(_.size(this.state.courseDetails)>0 && this.state.courseDetails.course_user_details.is_following)?'Unfollow Course':'Follow Course'}</button></div>
                        <div className="coursesAddress">{(_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.address1:''} <br/>{(_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.address2:''}</div>
                        <div className="coursescontact">{(_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.phone:''}<br/>{(_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.email:''}</div>

                    </div>
                    <div className="col-sm-6 removePadding">
                       <div className="map">
                   <GoogleMap
        center={{lat: (_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.lat:0, lng: (_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.lon:0}}
        defaultZoom={14}>
                <Marker lat={(_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.lat:0} lng={(_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.lon:0}/>
      </GoogleMap>


                    </div>
                    </div>
                        <div className="col-sm-12 removePadding">
                        <Tabs  selectedIndex={0}>
                        <TabList>
                          <Tab>Post</Tab>
                          <Tab>Description</Tab>
                          <Tab>Groups</Tab>
                          <Tab >Events</Tab>

                        </TabList>


        <TabPanel>
        <div className="headerEvents">
            <div className="col-sm-9">
              {_.size(this.state.currentEventList)} {_.size(this.state.currentEventList)>1?'Upcoming Events':'Upcoming Event'}
              </div>
              <div className="col-sm-3">
              <Link to="/events"><button className="viewEveBtn">View Events</button></Link>
              </div>
            </div>
            <div className ="eventsContainer">
            {(this.state.courseDetails.course!=undefined && this.state.courseDetails.course!=null)?this.state.courseDetails.course.posts.map((item,i)=>{
              return(<div className="postContent"  key={i}>

              <div className="col-sm-6">

                    <div className="inlinePostTittle">
                    <div className="postthumb"><img src={'http://'+item.author.profile_image_url} className="postImg"/></div>
                    <div className="postTittle">{item.title}</div>
                    </div>

                </div>




                <div className="col-sm-6">
                    <div className="postTime">{item.created}<br/>{item.created_since} ago</div>
                </div>
                <div className="col-sm-12">
                <div className="postSumary">
                    {item.body}
                    </div>
                    </div>
                <div className="col-sm-12">
                    <span className="like"><span className="likeIcon"><img src="/assets/img/icons/like.png" /></span><span className="likeTxt">Like</span></span>|
                    <span className="comment"><span className="commentIcon"><img src="/assets/img/icons/comment.png" /></span><span className="commentTxt">Comment</span></span>|
                    <span className="share"><span className="shareIcon"><img src="/assets/img/icons/share.png" /></span><span className="shareTxt">Share</span></span>

                </div>

            </div>



)
            }):(<div></div>)}

                </div>
        </TabPanel>

        <TabPanel>
        {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(
          <div className="description">
          {(_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.description:''}
            </div>)}
        </TabPanel>
        <TabPanel>

          {_.size(this.state.getGroupList)>0 && this.state.getGroupList.map((item, index)=>{

            return(<div key={index} >
              <div className="groupListData col-sm-12 zeroPad">
          <span>{item.is_private?'Private Group':'Public Group'}</span>
          <div className="groupData">
          <img src={'http://'+item.cover_image} className="grpImg" />
            <span className="pl10px">{item.name}</span>
             <Link to={"groupMembers_" + item.id}><span className="viewGroup">view ></span></Link>



        </div>
        </div>

          </div>);
            })}

        </TabPanel>
        <TabPanel className="eventsTabs">
        <Tabs>
        <TabList className="eventsTabList">
          <Tab className="eventsHead" >Upcoming</Tab>
          <Tab className="eventsHead" >Past</Tab>
          <Tab className="eventsHead" >Calendar</Tab>
        </TabList>
        <TabPanel className="eventsTabPanel">
            <ul>
            {_.size(this.state.currentEventList)>0 ? this.state.currentEventList.map((eventDetail, index)=>{
                  return(<div key={index}><EventListDetail eventsList={this.state.currentEventList} eventDetail={eventDetail} /></div>);
            }):<label>No events to show</label>}
            </ul>
        </TabPanel>
        <TabPanel className="eventsTabPanel">
           <ul>
           {_.size(this.state.pastEventList)>0 ? this.state.pastEventList.map((eventDetail, index)=>{
                  return(<div key={index}><EventListDetail eventsList={this.state.pastEventList} eventDetail={eventDetail} /></div>);
            }):<label>No events to show</label>}
            </ul>
        </TabPanel>
        <TabPanel className="eventsTabPanel">
       Calendar
      {/*<Calendar />*/}
        </TabPanel>
      </Tabs>
        </TabPanel>
      </Tabs>
    </div>
 </div>
</div>
):
(<NonPremiumCourse OnUnfollow={this.OnUnfollow.bind(this)} courseDetails={this.state.courseDetails} />)}
</div>
            <div className="ads"><img src="/assets/img/ads.png"/></div>
</div>)}
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
CourseContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        getCourseList: state.getCourses,
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
        selectedCourse: state.selectedCourse,


        courseEvent:(state.courseEvent!=undefined && state.courseEvent!=null)?state.courseEvent:{}
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({courseList,eventDetails, searchCourses, unFollowCourse, getCourseObject,
     groupList, getCurrentEventsDetailsList, getPastEventsDetailsList}, dispatch);


}

export default  connect(mapStateToProps, matchDispatchToProps)(CourseContainer);
