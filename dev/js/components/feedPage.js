import React from 'react';
import { Link } from 'react-router';
import {getPostDetails, searchPosts} from '../actions/postAction';
import {addComment, likePost} from '../actions/groupListAction';
import {connect} from 'react-redux';
import Spinner from 'react-spinner';
import {bindActionCreators} from 'redux';

class FeedPage extends React.Component {
   constructor(props){
       super(props);
       this.state={
      posts: Object.assign([], props.postList),  ajaxCallInProgress:false
    };
   }
   componentWillMount(){
      this.setState({ajaxCallInProgress:true});
        this.props.getPostDetails(this.props.activeUser.token).then(()=>{
                  this.setState({posts:this.props.postList.feedPosts, ajaxCallInProgress:false});
        }).catch((error)=>{
           if(error == "Error: Request failed with status code 401"){
         this.context.router.push('/');
        }  
          this.setState({ajaxCallInProgress:false});
     });
   }
 Comment(postsId){
  
      let commentTextBox=(postsId + "_txtComment");
      
      let body = document.getElementById(commentTextBox).value;
      console.log("body",body);
      if(body == ""){
      
      $("#"+commentTextBox).focus();
    }
      else{
       this.props.addComment(postsId, this.props.activeUser.token, body).then(()=>{
       console.log("success");
       this.getPostsDetails();

        document.getElementById(commentTextBox).value='';
      }).catch((error)=>{
      });
      }
    }
    getPostsDetails(){
       this.setState({ajaxCallInProgress:true});
        this.props.getPostDetails(this.props.activeUser.token).then(()=>{
                  this.setState({posts:this.props.postList.feedPosts, ajaxCallInProgress:false});
        }).catch((error)=>{
          this.setState({ajaxCallInProgress:false});
     });

    }
 componentDidMount() {
      $('.menu').parent().removeClass('active');
      $('#feed').parent().addClass('active');
   }
    onPostSearch(e){
     
          if(e.which==13)
          {
            this.props.searchPosts(this.props.activeUser.token, e.target.value).then(()=>{
              console.log("Course Search");
                  this.setState({posts:this.props.postList.PostList});
            }).catch((error)=>{
                console.log("Error", error);
            });
          }
      }

      onLikeClick(id){
        console.log("Posts Id", id);
        this.props.likePost(this.props.activeUser.token, id).then(()=>{
              this.getPostsDetails();
        }).catch((error)=>{

        });
    }
    focusOnCommentBox(id){
        console.log("ID", id);
        $('#'+ id + "_txtComment").focus();
    }
   render() {if(this.state.posts!=undefined){

   console.log("feed",this.state.posts);
   }

      return (
          <div className="feedPage">
   <div className="pageFeed col-sm-12 pdryt0px">
      <div className="feedcntnt col-sm-12">
         <div className="img-cntnt col-sm-12">
             <div className="cover-img col-sm-12 zeroPad"><img src="/assets/img/feedImg.png" className="feedImg col-sm-12 zeroPad" /></div>
            <div className="img-feed col-sm-12">
                <h3 className="col-sm-8">Feed</h3>
                <span className="search-feed col-sm-4 zeroPad">
                  <div className="col-sm-12 pdlft0px">
                    <input type="search" placeholder="    Search Feed" className="searching col-sm-11" onKeyPress={this.onPostSearch.bind(this)}/>
                    <button className="search-btn col-sm-1" onClick={this.onPostSearch.bind(this)}>
                      <span className="glyphicon glyphicon-search searchbtn-img"></span>
                    </button>
                  </div>
                </span>
             </div>
         </div>
         <div className="col-sm-12 mt22px">
         {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(
          <div>
         {this.state.posts!=undefined && this.state.posts!=null ? this.state.posts.map((item,i)=>{
              return(<div className="users col-sm-12"  key={i}>
            <div className="user1">
            <div className="col-sm-12 zeroPad">
              <div className="col-sm-1 wd6pc">
               <img className="Harvey-img" src={'http://'+item.author.profile_image_url} /></div>

               <div className="user1-header col-sm-6 zeroPad">
                  <h3>{item.author.first_name} {item.author.last_name}</h3>
                  {item.object_name!=null?item.object_type=="Group"?<div>This post is from <Link to={"groupMembers_" + item.object_id}>{item.object_name}  {item.object_type}</Link> </div>:<div>This post is from {item.object_name}  {item.object_type}</div>:''}
                  </div>
                  <div className="col-sm-5 zeroPad txtRyt">
                  <p className="ryt">{item.created} <br/>{item.created_since}</p>
               </div>
               </div>
               <div className="tglng">
               <div className="user1-spl">
                  <h3>{item.title}</h3>
                  
                  
                </div>
                        {item.body!=null?<div>
                            <h4 className="detil">Details</h4>
                            <p className="xplin">{item.body}</p>
                        </div>:<div></div>}
                
                  </div>
                  <div className="user-footer">
                     <div className="col-sm-12 rspnsng">
                      <div className="col-sm-8"></div>
                      <div className="col-sm-4 pdng">
                        <div className="col-sm-12 pdng">
                          <span onClick={this.onLikeClick.bind(this, item.id)} className={(item.has_like)?"like color-green":"like"}><span className={(item.has_like)?("rspnsImg glyphicon glyphicon-heart color-green"):("rspnsImg glyphicon glyphicon-heart ")}></span>Like (<span className="likingNumber">{item.likes_count}</span>)</span>
                          <span className="cursor-pointer" onClick={this.focusOnCommentBox.bind(this, item.id)} className="comment"><img src="/assets/img/icons/comment.png"  className="rspnsImg"/>Comment</span>
                        </div>
                      </div>
                    </div>
                     <span className="footer4">
                        <span className="butn-err" data-toggle="modal" data-target="">
                          
                        </span>
                     </span>
                     <div className="modal fade secondModal" id="myModal" role="dialog" data-backdrop="static">
                        <div className="modal-dialog modal-sm">
                           <div className="modal-content">
                              <div className="modal-body">
                                 <div className="checkbox">
                                    <input type="checkbox" value="1" id="checkboxInput" name="" />Hide/DeletePost
                                 </div>
                                 <div className="checkbox">
                                    <input type="checkbox" value="1" id="checkboxInput" name="" />Block
                                 </div>
                                 <div className="checkbox">
                                    <input type="checkbox" value="1" id="checkboxsInput" name="" />Report
                                 </div>
                                 <div className="reason">Reason for reporting</div>
                                 <textarea className="txtarea form-control" maxLength="200" name="txtArea"></textarea>
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="butnPrimary" id="btnSubmit">Submit</button>
                                <button type="button" className="butnSecondary" data-dismiss="modal">Cancel</button></div>
                           </div>
                        </div>
                     </div>
                  </div>
                   {_.size(item.comments)>0 && item.comments.map((childItem, childIndex)=>{
              return(<div key={childIndex} className="col-sm-12">
                    <div className="col-sm-12">
                      <div className="col-sm-1">
                        <div className=""><img src={'http://'+childItem.author.profile_image_url} className="rplyImg"/></div>
                      </div>
                      <div className="col-sm-9">
                        <div className="col-sm-12 prsnName">
                          {childItem.author.first_name} {childItem.author.last_name}
                        </div>
                        <div className="col-sm-12 prsnSent">
                          {childItem.created}
                        </div>
                      </div>
                      <div className="col-sm-12 mt1pc mb2pc">
                        <div className="pstReply col-sm-12">{childItem.body}</div>
                      </div>
                    </div>
                  </div>)
            })}
                  <div className="cmnt-matter"><textarea type="text" maxLength="500" className="txtarea form-control" placeholder="Write Something..." id={item.id+ "_txtComment"}></textarea></div>
                  <div>
                  <input type="button" value="Add Comment" className="btnAddComment" onClick={this.Comment.bind(this, item.id)}/></div>
                  </div>
               
               
          </div>)
                }):<div className=" users col-sm-12">No Posts yet</div>}
</div>
)}
</div>
               </div>
            </div>
          </div>
              );
   }
}
FeedPage.contextTypes = {
  router: React.PropTypes.object
};


function mapStateToProps(state) {
 
    return {
       activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
       postList: state.savePost
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({getPostDetails, searchPosts, addComment, likePost}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps) (FeedPage);
