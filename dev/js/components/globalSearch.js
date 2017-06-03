import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import _ from 'lodash';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
 
import {IMG_CONSTANT} from '../constants/application.constants';
let imgPath=IMG_CONSTANT.IMAGE_PATH;
 
class GlobalSearch extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state={
      eventsList: ((props.searchResults.events!=undefined && props.searchResults.events!=null)?(Object.assign([], props.searchResults.events)):([])),
      groupsList:((props.searchResults.groups!=undefined && props.searchResults.groups!=null)?(Object.assign([], props.searchResults.groups)):([])),
      coursesList: ((props.searchResults.courses!=undefined && props.searchResults.courses!=null)?(Object.assign([], props.searchResults.courses)):([])),
      postsList: ((props.searchResults.posts!=undefined && props.searchResults.posts!=null)?(Object.assign([], props.searchResults.posts)):([])),
      peopleList: ((props.searchResults.users!=undefined && props.searchResults.users!=null)?(Object.assign([], props.searchResults.users)):([]))
    };
}
componentDidMount() {
      $('.menu').parent().removeClass('active');
 
   }
 
    componentWillReceiveProps(nextProps){
        if(this.props.searchResults!=nextProps.searchResults){
          this.setState({eventsList: nextProps.searchResults.events});
          this.setState({groupsList: nextProps.searchResults.groups});
          this.setState({coursesList: nextProps.searchResults.courses});
          this.setState({postsList: nextProps.searchResults.posts});
          this.setState({peopleList: nextProps.searchResults.users});
        }
    }
 
OnCourseSelect(){
  this.context.router.push('/selectedCoursePage');
}
 
     render() {
 
    return (
                <div className="globalSearch">
                                <div className="row">
                                                <div className="globalSearchHeader mt4pc col-sm-12 pdng">
                                                  <div className="col-sm-12 padngpx">
                                                                <div className="col-sm-7">
                                                                                <ul className="nav nav-tabs tabsPane col-sm-12 pdng">
                            <li className="allTab text-center col-sm-2 active"><a data-toggle="tab" href="#all-tab">ALL</a></li>
                            <li className="groupsTab text-center col-sm-2"><a data-toggle="tab" href="#group-tab">GROUPS</a></li>
                            <li className="postsTab text-center col-sm-2"><a data-toggle="tab" href="#post-tab">POSTS</a></li>
                            <li className="eventsTab text-center col-sm-2"><a data-toggle="tab" href="#event-tab">EVENTS</a></li>
                            <li className="coursesTab text-center col-sm-2"><a data-toggle="tab" href="#course-tab">COURSES</a></li>
                            <li className="peopleTab text-center col-sm-2"><a data-toggle="tab" href="#people-tab">PEOPLE</a></li>
                        </ul>
                    </div>
 
                                                                  </div>
                                                                </div>
                                                                <div className="col-sm-12 dvdrline"></div>
                                                                <div className="col-sm-12 bgWhite">
                                                                                <div className="tab-content">
                                                                                                <div id="all-tab" className="searchAll tab-pane fade in active col-sm-12">
              {(_.size(this.state.groupsList)>0)?(<div className="groupsList margn1pc col-sm-12">
              <div className="searchingOn col-sm-12">
                <ul className="allList">
                  <li className="col-sm-1 txtupcase clrgray curPntr ">groups</li>
                  <li className="col-sm-1 txtupcase seeAll-btn curPntr ">see all</li>
                </ul>
              </div>
              {
                this.state.groupsList.map((item, index)=>{
                      return(<div key={index} className="userDetails col-sm-12">
                              <Link to={"groupMembers_" + item.object_id}><div className="col-sm-1">
                                      <img src={"http://"+item.object_image_url} className="customerImg brdr50pc" />
                              </div>
                              <div className="col-sm-11">
                                <div className="userName">{item.title}</div>
                                <div className="userCreated">{item.content}</div>
                              </div></Link>
                      </div>)
                })
              }
            </div>):('')}
 
                {(_.size(this.state.postsList)>0)?(<div className="postsList margn1pc col-sm-12">
                <div className="searchingOn col-sm-12">
                  <ul className="allList">
                    <li className="col-sm-1 txtupcase clrgray curPntr ">posts</li>
                    <li className="col-sm-1 txtupcase seeAll-btn curPntr ">see all</li>
                  </ul>
                </div>
                {
                  this.state.postsList.map((item, index)=>{
                        return(<div key={index} className="userDetails col-sm-12">
                                <div className="col-sm-1">
                                        <img src={"http://"+item.object_image_url} className="customerImg brdr50pc" />
                                </div>
                                <div className="col-sm-11">
                                  <div className="userName">{item.title}</div>
                                  <div className="userCreated">{item.content}</div>
                                </div>
                        </div>)
                  })
                }
              </div>):('')}
              {(_.size(this.state.eventsList)>0)?(<div className="eventsList margn1pc col-sm-12">
                                                                                                                                      <div className="searchingOn col-sm-12">
                                                                                                                                        <ul className="allList">
                                                                                                                                                        <li className="col-sm-1 txtupcase clrgray curPntr ">events</li>
                                                                                                                                                        <li className="col-sm-1 txtupcase seeAll-btn curPntr ">see all</li>
                                                                                                                                        </ul>
                                                                                                                        </div>
                {
                  this.state.eventsList.map((item, index)=>{
                        return(<div key={index} className="userDetails col-sm-12">
                                                                                                                                     {/* <Link to={"/selectedEvent/" + item.object_id}>*/}<div className="col-sm-1">
                                                                                                                                          <img src={"http://"+item.object_image_url} className="customerImg brdr50pc" />
                                                                                                                            </div>
                                                                                                                        <div className="col-sm-11">
                                                                                                                                <div className="userName">{item.title}</div>
                                                                                                                                <div className="userCreated">{item.content}</div>
                                                                                                                        </div>{/*</Link>*/}
                                                                                                                    </div>)
                  })
                }
                                                                                                                </div>):('')}
 
 
              {(_.size(this.state.coursesList)>0)?(<div className="coursesList margn1pc col-sm-12">
              <div className="searchingOn col-sm-12">
                <ul className="allList">
                  <li className="col-sm-1 txtupcase clrgray curPntr ">courses</li>
                  <li className="col-sm-1 txtupcase seeAll-btn curPntr ">see all</li>
                </ul>
              </div>
              {
                this.state.coursesList.map((item, index)=>{
                      return(<div key={index} className="userDetails col-sm-12">
                              <div className="col-sm-1">
                                      <img src={"http://"+item.object_image_url} className="customerImg brdr50pc" />
                              </div>
                              <div className="col-sm-11">
                                <div className="userName">{item.title}</div>
                                <div className="userCreated">{item.content}</div>
                              </div>
                      </div>)
                })
              }
            </div>):('')}
 
              {(_.size(this.state.peopleList)>0)?(<div className="peopleList margn1pc col-sm-12">
              <div className="searchingOn col-sm-12">
                <ul className="allList">
                  <li className="col-sm-1 txtupcase clrgray curPntr ">people</li>
                  <li className="col-sm-1 txtupcase seeAll-btn curPntr ">see all</li>
                </ul>
              </div>
              {
                this.state.peopleList.map((item, index)=>{
                      return(<div key={index} className="userDetails cursor-pointer col-sm-12">
                              <Link to={"profileDetail_" + item.object_id}><div className="col-sm-1">
                                     <img src={"http://"+item.object_image_url} className="customerImg brdr50pc" />
                              </div>
                              <div className="col-sm-11">
                                <div className="userName">{item.title}</div>
                                <div className="userCreated">{item.content}</div>
                              </div></Link>
                      </div>)
                })
              }
            </div>):('')}
 
 
                                                                                                </div>
                                                                                                <div id="group-tab" className="searchGroup tab-pane fade col-sm-12">
                                                                                                {(_.size(this.state.groupsList)>0)?(<div className="groupsList margn1pc col-sm-12">
              <div className="searchingOn col-sm-12">
                <ul className="allList">
                  <li className="col-sm-1 txtupcase clrgray curPntr ">groups</li>
 
                </ul>
              </div>
              {
                this.state.groupsList.map((item, index)=>{
                      return(<div key={index} className="userDetails cursor-pointer col-sm-12">
                              <Link to={"groupMembers_" + item.object_id}><div className="col-sm-1">
                                      <img src={"http://"+item.object_image_url} className="customerImg brdr50pc" />
                              </div>
                              <div className="col-sm-11">
                                <div className="userName">{item.title}</div>
                                <div className="userCreated">{item.content}</div>
                              </div></Link>
                      </div>)
                })
              }
            </div>):('')}
                                                                                                </div>
                                                                                                <div id="post-tab" className="searchPost tab-pane fade col-sm-12">
            {(_.size(this.state.postsList)>0)?(<div className="postsList margn1pc col-sm-12">
            {
              this.state.postsList.map((item, index)=>{
                    return(<div key={index} className="userDetails col-sm-12">
                            <div className="col-sm-1">
                                    <img src={"http://"+item.object_image_url} className="customerImg brdr50pc" />
                            </div>
                            <div className="col-sm-11">
                              <div className="userName">{item.title}</div>
                              <div className="userCreated">{item.content}</div>
                            </div>
                    </div>)
              })
            }
          </div>):('')}
                                                                                                </div>
                                                                                                <div id="event-tab" className="searchEvent tab-pane fade col-sm-12">
            {(_.size(this.state.eventsList)>0)?(<div className="postsList margn1pc col-sm-12">
            {
              this.state.eventsList.map((item, index)=>{
                    return(<div key={index} className="userDetails col-sm-12">
                            {/*<Link to={"/selectedEvent/" + item.object_id}>*/}<div className="col-sm-1">
                                    <img src={"http://"+item.object_image_url} className="customerImg brdr50pc" />
                            </div>
                            <div className="col-sm-11">
                              <div className="userName">{item.title}</div>
                              <div className="userCreated">{item.content}</div>
                            </div>{/*</Link>*/}
                    </div>)
              })
            }
          </div>):('')}
                                                                                                </div>
                                                                                                <div id="course-tab" className="searchCourse tab-pane fade col-sm-12">
            {(_.size(this.state.coursesList)>0)?(<div className="postsList margn1pc col-sm-12">
            {
              this.state.coursesList.map((item, index)=>{
                    return(<div key={index} className="userDetails col-sm-12">
                            <div className="col-sm-1">
                                    <img src={"http://"+item.object_image_url} className="customerImg brdr50pc" />
                            </div>
                            <div className="col-sm-11">
                              <div className="userName">{item.title}</div>
                              <div className="userCreated">{item.content}</div>
                            </div>
                    </div>)
              })
            }
          </div>):('')}
                                                                                                </div>
                                                                                                <div id="people-tab" className="searchPeople tab-pane fade col-sm-12">
            {(_.size(this.state.peopleList)>0)?(<div className="postsList margn1pc col-sm-12">
            {
              this.state.peopleList.map((item, index)=>{
                    return(<div key={index} className="userDetails cursor-pointer col-sm-12">
                            <Link to={"profileDetail_" + item.object_id}><div className="col-sm-1">
                                    <img src={"http://"+item.object_image_url} className="customerImg brdr50pc" />
                            </div>
                            <div className="col-sm-11">
                              <div className="userName">{item.title}</div>
                              <div className="userCreated">{item.content}</div>
                            </div></Link>
                    </div>)
              })
            }
          </div>):('')}
                                                                    </div></div></div>
                                </div>
               </div>
    );
  }
}
 
GlobalSearch.contextTypes = {
  router: React.PropTypes.object.isRequired
};
 
function mapStateToProps(state) {
    return {
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
        searchResults: state.searchResults,
         selectedProfileDetails: state.selectedProfileDetails
    };
}
 
export default  connect(mapStateToProps)(GlobalSearch);