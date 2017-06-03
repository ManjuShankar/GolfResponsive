import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getGolfConnectXmembers, onSendRequest, GetFriends, FriendRequest, searchMembers} from '../actions/friendsAction.js';
import Spinner from 'react-spinner';
class FriendsPage extends React.Component {
   constructor(props, context){
       super(props, context);
       this.state={
         friends:Object.assign([], props.friends), ajaxCallInProgress:false, members:Object.assign([],props.friends)
       };

   }

   componentWillMount(){
    this.setState({ajaxCallInProgress:true});
         this.props.GetFriends(this.props.activeUser.token).then(()=>{
                   this.setState({friends:this.props.friends.Friends});
                   this.setState({ajaxCallInProgress:false});
         }).catch((error)=>{
        console.log("Error", error);
        if(error == "Error: Request failed with status code 401"){
         this.context.router.push('/');
        }
      });
    }
 componentDidMount() {

          $('.menu').parent().removeClass('active');

    }
    onSendClick(id){
      let  message=document.getElementById('txtArea');
      this.props.onSendRequest(this.props.activeUser.token, id, message).then(()=>{
          document.getElementById('txtArea').value='';
          $('#myModal').modal('hide');
          console.log("Sent Request Success");
      }).catch((error)=>{
     console.log("Error", error);
   });
    }

    navigateToDetailsPage(id){
      console.log("navigateToDetailsPage",id);
      this.context.router.push('/profileDetail_' + id);
    }
getPeople(){
  $("#myModal").modal('show');
   this.props.getGolfConnectXmembers(this.props.activeUser.token).then(()=>{
                   this.setState({members:this.props.friends.Members});
                   this.setState({ajaxCallInProgress:false});
         }).catch((error)=>{
        console.log("Error", error);
        if(error == "Error: Request failed with status code 401"){
         this.context.router.push('/');
        }
      });
}
 SendRequest(){
      let users=[];
      $("#addOrRemoveMemebrs input:checkbox:checked").each(function() {
          users.push(_.toInteger(this.id));
      });
      this.props.FriendRequest(this.props.activeUser.token, users).then(()=>{
             $('.membersList').attr('checked', false);
        $('#myModal').modal('hide');
      }).catch((error)=>{
        console.log("Error", error);
      });
    }
onMemberSearch(e){
         if(e.which==13)
         {
           this.props.searchMembers(this.props.activeUser.token, e.target.value).then(()=>{
                this.setState({members:this.props.friends.Members});
           }).catch((error)=>{
           });
         }
     }
    render() {

      return (
          <div className="frndsGridPage">
          <div className="col-sm-12">
           <h3 className="txt-center col-sm-6">Friends</h3>

           <div className="col-sm-6 txtRyt"><button className="btnAddFrnd"  data-toggle="modal" onClick={this.getPeople.bind(this)}>+ Add Friends</button>
          </div>
           <div id="myModal" className="modal fade" role="dialog" data-backdrop="false">
  <div className="modal-dialog">

   
    <div className="modal-content">
      <div className="modal-header">
        <button type="button" className="close" data-dismiss="modal">&times;</button>
        <h4 className="modal-title">Add Friends</h4>
      </div>
      <div className="modal-body">
          <div className="col-sm-12 txtRyt">
            <div><span className="glyphicon glyphicon-search memSearchIcon"></span>
            <input className="searchDiv pdleft20px" placeholder="Seach for members" onKeyPress={this.onMemberSearch.bind(this)}/></div>
          </div>
      <form id="addOrRemoveMemebrs">
       <div className="memberDiv">
       
     {_.size(this.state.members)>0  ? this.state.members.map((item, i) => {
                    return (<div key={i}>

       <div className="col-sm-2 mt1pc">
                              <label className="switch">
                                <input id={item.id} type="checkbox" className="membersList" ref="user" />
                                <div className="slider round popup"></div>
                              </label>
        </div>
          <div className="col-sm-10 zeroPad dummy">
                              <div className="col-sm-12 zeroPad">
                                <div className="col-sm-2 ">
                                  <img src={'http://'+item.profile_image_url} className="memberImg" />
                                </div>
                                <div className="col-sm-9 zeroPad mt15pcc">
                                  <div className="memberName ml15px">{item.first_name}  {item.last_name?item.last_name:''}</div>
                                </div>
                              </div>
          
          </div>
     </div>)
   }):<label>No Members to show yet</label>}
   </div>
   </form>
   </div>
      <div className="modal-footer">
        <button type="button" className="btnSave" onClick={this.SendRequest.bind(this)} >Save</button>
      </div>
    </div>

  </div>
</div>
</div>
              {(this.state.ajaxCallInProgress)?(<div className="mt25pc"><Spinner /></div>):(<div className="frndsgrid">
                  <div className="grid">
                  <div className="col-md-12 r1">
                    {_.size(this.state.friends)>0  ? this.state.friends.map((item, i) => {
                    return (<div key={i}>
                      <div className="col-md-3 mb3pc">
                      <div className="r1c1 meo">
                          <span onClick={this.navigateToDetailsPage.bind(this, item.id)} className="img1"><img src={'http://'+ item.profile_image_url} className="aldo"/></span>
                          <div className="name col-sm-12"><span className="namexx col-sm-6" onClick={this.navigateToDetailsPage.bind(this, item.id)}>{item.first_name}</span><a className="btn btn-info btn-lg" ><span className="glyphicon glyphicon-envelope envlp col-sm-6"></span></a></div>
                          <div className="modal fade" id="myModal" role="dialog">
                          <div className="modal-dialog modal-sm">
                             <div className="modal-content">
                                 <div className="modal-header">INVITE</div>
                                <div className="modal-body"><textarea id="txtArea" className="txtarea" placeholder="write something.." name="txtArea"></textarea></div>
                                <div className="modal-footer">
                                  <button onClick={this.onSendClick.bind(this, item.id)} type="button" className="btn btn-primary" id="btnSend">Send</button>
                                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                               </div>
                              </div>
                          </div>
                      </div>
                      </div>
                    </div>
                    </div>)
                    }):<div>No friends to show</div>}
                  </div>
                  
                 </div>
              </div>)}
          </div>
              );
   }
}

FriendsPage.contextTypes = {
  router: React.PropTypes.object
};


function mapStateToProps(state) {
    return {
       activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
       friends: state.friends
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({getGolfConnectXmembers,onSendRequest, GetFriends, FriendRequest, searchMembers}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps) (FriendsPage);
