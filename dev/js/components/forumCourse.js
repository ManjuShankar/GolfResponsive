import React from 'react';
import { Link } from 'react-router';
import{IMG_CONSTANT} from '../constants/application.constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {getcourseList, getconversation, addComment, addNewPost, searchPosts} from '../actions/forumAction';
import {searchCourses, getCourseObject} from '../actions/courseListAction';
import Spinner from 'react-spinner';

class ForumsCourse extends React.Component{
  constructor(props) {
    super(props);
   this.state={ getCourseslist:Object.assign([],props.forumCourse), courseDetails:{},
           forumCourseDetails:Object.assign([],props.forumCourse),postMsg : "",replyMsg:"",catErr:"",
           ajaxCallInProgress:false
          };
}
 componentDidMount() {
      $('.menu').parent().removeClass('active');
      }
componentWillMount(){
  this.setState({ajaxCallInProgress:true});
        this.props.getcourseList(this.props.activeUser.token).then(()=>{

            this.setState({Courseslist:this.props.forumCourse.Courses});
  this.setState({ajaxCallInProgress:false});
   $("#catList").trigger('click');
            
        }).catch((error)=>{
          console.log("Error", error);
           if(error == "Error: Request failed with status code 401"){
            this.context.router.push('/');
            }  
  this.setState({ajaxCallInProgress:false});

        });
          if( _.size(this.state.categoryDetails)==0 &&_.size(this.props.getCourseList)>0){
            
                this.showCourseDetails(this.props.forumCourse.Courses[0].id);
                
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.props.getCourseList!=nextProps.getCourseList)
        {
            this.setState({Courseslist:nextProps.forumCourse.Courses});
        }
        /*if(this.props.getCourseList!=nextProps.getCourseList && _.size(this.state.courseDetails)==0 && _.size(nextProps.getCourseList)>0){
            this.showCourseDetails(nextProps.getCourseList[0].id);
        }*/

        if(this.props.selectedCourse!=nextProps.selectedCourse){
                this.setState({courseDetails:nextProps.selectedCourse});
        }
    }
    
    showCourseDetails(id){
      
       this.props.getCourseObject(id, this.props.activeUser.token).then((id)=>{
        
          this.setState({courseDetails:this.props.selectedCourse,catErr:""});
      this.props.getconversation(this.props.selectedCourse.course.id, this.props.activeUser.token ).then(()=>{
          
          this.setState({forumCourseDetails:this.props.forumCourse.Conversation});
          
        }).catch((error)=>{

        });
       }).catch((error)=>{
       });
        
     }
     onCourseSearch(e){
          if(e.which==13)
          {
            this.props.searchCourses(this.props.activeUser.token, e.target.value).then(()=>{
              
                  this.setState({Courseslist:this.props.getCourses});
                  console.log("Course Search", this.state.Courseslist);
            }).catch((error)=>{
                console.log("Error", error);
            });
          }
      }
      onPostSearch(e){
     
          if(e.which==13)
          {
            this.props.searchPosts(this.props.activeUser.token, this.props.selectedCourse.course.id, e.target.value).then(()=>{
                  this.setState({forumCourseDetails:this.props.forumCourse.SearchList});
              console.log("Course Search",this.state.forumCourseDetails);

            }).catch((error)=>{
                console.log("Error", error);
            });
          }
      }

      onforumclick(){
        this.context.router.push('/forumsPage');
      }
       addPost(){
       if(!this.state.courseDetails.course){
        this.refs.post_msg.value = "";
          this.setState({
                    postMsg : "",
                    catErr : (<span className="color-red">please select category to post comment </span>)
                });
           }
       else{
      this.setState({postMsg : ""});
      let title = document.getElementById('txtPostInput');
        console.log("this.props.params.id",this.props.selectedCourse.course.id);

      this.props.addNewPost(this.props.selectedCourse.course.id,this.props.activeUser.token, title.value).then(()=>{
       this.props.getconversation(this.props.selectedCourse.course.id, this.props.activeUser.token ).then(()=>{
          
          this.setState({forumCourseDetails:this.props.forumCourse.Conversation,postMsg : ""});
          console.log("search results",this.state.forumCourseDetails);
        }).catch((error)=>{

        });
        document.getElementById('txtPostInput').value='';
      }).catch((error)=>{
      });
    }
    }
    Comment( id){
      
      let commentTextBox=(id + "text");
      let body = document.getElementById(commentTextBox).value;
      console.log("body",body);
      if(body == ""){
      $("#"+commentTextBox).focus();
    }
    else{
      this.props.addComment(this.props.selectedCourse.course.id, id , this.props.activeUser.token, body).then(()=>{
        this.props.getconversation(this.props.selectedCourse.course.id, this.props.activeUser.token ).then(()=>{
          
          this.setState({forumCourseDetails:this.props.forumCourse.Conversation});
          console.log("forumCourseDetails",this.state.forumCourseDetails);
        }).catch((error)=>{

        });
        
        document.getElementById(commentTextBox).value='';
        $(".closeThis").collapse('hide');
      }).catch((error)=>{
      });
    }
    }
    /*****/
    onRequired(e) {
if(e.target.name == "post_msg"){
    if(e.target.value == ""){

    this.setState({
        postMsg: ""
        });
    }

    else{

        this.setState({
        postMsg: e.target.value
          });
      }
    }
 }


enterCapture(e){
     if(e.target.name == "post_msg"){
         if((e.target.value != "") && (e.keyCode == 13)){
            $("#postBtn").trigger("click");
         }
     }
 }


    /*****/
render() {
  if(this.state.courseDetails!=undefined && this.state.courseDetails!=null){

  console.log("this.state.courseDetails.course.name",this.state.courseDetails);
}

    let imagePath=IMG_CONSTANT.IMAGE_PATH;
    return (
        <div className="forumCourse">         
          <div className=" col-sm-12 frumCrse">
            {(this.state.ajaxCallInProgress)?(<div className="mt25pc"><Spinner /></div>):( <div className="row">
              <div className="headerContent col-sm-12">
                <div className="courseHeader">
                  <h3 className="header"><span className="glyphicon glyphicon-chevron-left arrowChevron cursor-pointer" onClick={this.onforumclick.bind(this)}/>COURSES</h3>
                </div>
              </div>
              <div className="col-sm-12 coursesCntnt pdng">
                <div className="bgwhite forumCntnt col-sm-12">
                  <div className="col-sm-4 brdrRyt pdng left-column ">
                    <div className="col-sm-12 pdng7pc">
                      <div className="searchBar col-sm-12">
                        <span className="glyphicon glyphicon-search searchIcon" /><input type="text" onKeyPress={this.onCourseSearch.bind(this)} className="searchInput" placeholder=" Search"/>
                      </div>
                      <div className="forumsCourseList col-sm-12 pdng">
                        <ul className="crsesLst">
                          {_.size(this.state.Courseslist)>0 && this.state.Courseslist.map((item, index)=>{
                            
                              return(<div key={index} onClick={this.showCourseDetails.bind(this,item.id)}>
                               <li id="catList" className={(this.props.selectedCourse!=undefined && this.props.selectedCourse!=null && this.props.selectedCourse.course.id==item.id)?("selected_element fieldName"):("fieldName")}><a>{item.name}</a></li>
                             </div> );
                              })}
                          
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-8 right-column">
                    <div className="col-sm-12 pdng3pc">
                      <div className="coursesListing col-sm-12">
                        <div className="col-sm-12 listName pdng">
                          <div className="col-sm-6 pdng corseListName">
                            {(_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.name:''}
                          </div>
                          <div className="col-sm-6 pdng">
                            <div className="searchBar">
                              <span className="glyphicon glyphicon-search searchIcon" /><input type="text" className="searchInput" placeholder=" Search" onKeyPress={this.onPostSearch.bind(this)}/>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-12 zeroPad mt1pc">
                        <div className="addCourse col-sm-12">
                          <div className="col-sm-12"><input type="text" className="txtarea" maxLength="1000" ref="post_msg"  name="post_msg" onKeyDown={this.enterCapture.bind(this)} onChange={this.onRequired.bind(this)} id="txtPostInput" placeholder="write something.."/>
                            {this.state.catErr}
                          </div>
                          
                          <div className="col-sm-12 hrzntLine"></div>
                          <div className="col-sm-12 txtRyt pdryt23px"><input id="postBtn" type="button" value="Post" className="btn postCourse-butn" onClick={this.addPost.bind(this)} disabled={!this.state.postMsg} /></div>
                        </div>
                        <div className="corsesLists col-sm-12 pdng">
                          {_.size(this.state.forumCourseDetails)>0  ? this.state.forumCourseDetails.map((item, i) => {
                                  return (<div key={i}>
                                    <div className="courseDetail pdng col-sm-12">
                            <div className="postingCourse col-sm-12 pdng">
                              <div className=" col-sm-12 brdrbtm pdng pdbtm1pc">
                                <div className=" col-sm-12 pdng">
                                  <div className="col-sm-4 personName">{item.created_by}</div>
                                  <div className="col-sm-6 personSeen">{item.created_on}</div>
                                  <div className="col-sm-2 rspns"data-toggle="collapse" data-target={"#"+item.id+"rplyTopstPerson_one"}>reply</div>
                                </div>
                                <div className=" col-sm-12 personMsg mt1pc pdng">
                                  {item.subject_line}                   
                                </div>
                              
                                <div id={item.id+"rplyTopstPerson_one"} className="collapse fade closeThis">
                              <div className="col-sm-12 pdlft0px">
                                  <p className="col-sm-12 pdlft0px"><textarea id={item.id+"text"} maxLength="1000" name="reply_msg" className="col-sm-12 txtaria" placeholder="write something..." onChange={this.onRequired.bind(this)}></textarea></p>
                              </div>
                              <div className="col-sm-12 pdlft0px">
                                <div className="col-sm-12 pdlft0px">
                                  <button type="button" className="btn sbmtButn" onClick={this.Comment.bind(this, item.id)}>Reply</button>
                                  <button type="button" className="cnclButn">Cancel</button>
                                </div>
                              </div>
                            </div>
                              </div>
                              <div className="coursesRspns col-sm-12 pdng">
                                {_.size(item.comments)>0 && item.comments.map((childItem, childIndex)=>{
                                      return(<div className="rplyMember col-sm-12 pdng pdbtm1pc" key={childIndex}>
                                  <div className="col-sm-12 pdng">
                                    <div className="col-sm-4 personName">{childItem.created_by}</div>
                                    <div className="col-sm-6 personSeen">{childItem.created_on}</div>                               
                                  </div>
                                  <div className="col-sm-12 personMsg mt1pc pdng">
                                    {childItem.body}
                                  </div>
                                </div>)
                              })}
                                
                              </div>
                            </div>
                          </div>
                          

                        </div>)
                  }):<div>No posts yet</div>}
                      </div>
</div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 txtCntr">
                <img src="/assets/img/ads.png" className="adImg" />
              </div>
            </div>)}
          </div>        
        </div>
         );
   }
}
ForumsCourse.contextTypes = {
  router: React.PropTypes.object.isRequired
};
function mapStateToProps(state) {
    return {

        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
        getCourseList:state.forumCourse,
        selectedCourse:state.selectedCourse,
        forumCourse:state.forumCourse,
        getCourses:state.getCourses
       
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({getcourseList, searchCourses, getCourseObject, getconversation, addNewPost, addComment, searchPosts}, dispatch);


}

export default  connect(mapStateToProps, matchDispatchToProps)(ForumsCourse);