import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getProfileDetails} from '../actions/profileActions';
import {onSendRequest} from '../actions/friendsAction.js';
import _ from 'lodash';
import {createNewMessage} from '../actions/messagesAction';
import Spinner from 'react-spinner';

let paramId;
class profileDetail extends React.Component {
   constructor(props){
       super(props);
       this.state={
         profileDetails: Object.assign({}, props.selectedProfileDetails), ajaxCallInProgress:false
       };
   }

   componentWillMount(){
        this.setState({ajaxCallInProgress:true});
        let urlPath = _.split(location.pathname, '_');
        paramId =  (_.size(urlPath)>0)?(_.toInteger(urlPath[1])):(0);
        this.props.getProfileDetails(this.props.activeUser.token, paramId).then(()=>{
              this.setState({profileDetails: this.props.selectedProfileDetails});
              this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
          console.log("Error", error);
          if(error == "Error: Request failed with status code 401"){
          this.context.router.push('/');
          }
        });

   }


   onSendClick(id){
     let  message=document.getElementById('txtArea');
     this.props.onSendRequest(this.props.activeUser.token, id, message).then(()=>{
         $("#myModal").modal('hide');
     }).catch((error)=>{
    console.log("Error", error);
   });
   }

   onSendMessageClick(email){
     let formData={};
     let participants = email;
     _.set(formData, 'message', _.trim(document.getElementById('messageTxtArea').value));
     _.set(formData, 'participants', email);
       this.props.createNewMessage(this.props.activeUser.token, formData).then(()=>{
         document.getElementById('messageTxtArea').value='';
         $("#sendMessageModal").modal('hide');
       }).catch((error)=>{
       });
   }

    render() {
      if(_.size(this.state.profileDetails)>0){
      return (
          <div className="Profile_Page col-sm-12">
              {(this.state.ajaxCallInProgress)?(<div className=""><Spinner /></div>):(<div className="prflBasicPage">
                  <div className="imgPart col-sm-12">
                      <div className="col-sm-2"></div>
                      <div className="profileImg pdng col-sm-10">
                          <img src="/assets/img/background.png" className="coverimg pdng col-sm-12" />
                      </div>
                      <div className="ovrImg col-sm-12">
                      <div className="modal fade" id="sendMessageModal" role="dialog" data-backdrop="static">
                      <div className="modal-dialog">
                         <div className="modal-content">
                             <div className="modal-header">Message</div>
                            <div className="modal-body"><textarea id="messageTxtArea" maxLength="1000" className="txtarea form-control" placeholder="write something.." name="messageTxtArea"></textarea></div>
                            <div className="modal-footer">
                              <button onClick={this.onSendMessageClick.bind(this, this.state.profileDetails.profile.email)} type="button" className="Send-butn" id="btnSend">Send</button>
                              <button type="button" className="Cancel-butn" data-dismiss="modal">Cancel</button>
                           </div>
                          </div>
                      </div>
                      </div>

                      <div className="modal fade" id="myModal" role="dialog" data-backdrop="static">
                      <div className="modal-dialog">
                         <div className="modal-content">
                             <div className="modal-header">INVITE</div>
                            <div className="modal-body"><textarea id="txtArea" maxLength="500" className="txtarea form-control" placeholder="write something.." name="txtArea"></textarea></div>
                            <div className="modal-footer">
                              <button onClick={this.onSendClick.bind(this, this.state.profileDetails.profile.id)} type="button" className="Send-butn" id="btnSend">Send</button>
                              <button type="button" className="Cancel-butn" data-dismiss="modal">Cancel</button>
                           </div>
                          </div>
                      </div>
                      </div>
                          <div className="col-sm-6"></div>
                          <div className="btn-cntnt col-sm-6">
                              <div className="col-sm-12">
                                  <div className="col-sm-4"></div>
                                  <div className="col-sm-4">
                                        {this.state.profileDetails.profile.is_friend?'':<button type="button" className="reqBtn snd col-sm-12"  data-toggle="modal" data-target="#myModal">Send Friend Request</button>}
                                  </div>
                                  <div className="col-sm-4">
                                        <button type="button" className="msgBtn snd col-sm-12"  data-toggle="modal" data-target="#sendMessageModal">Send Message</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="detailsPart col-sm-12">
                      <div className="col-sm-2"></div>
                       <div className="namePart col-sm-10">
                        <div className="col-sm-1">
                          <img src={'http://'+ this.state.profileDetails.profile.profile_image_url} className="nameImg"></img>
                        </div>
                          <div className="pdng col-sm-1"></div>
                        <div className="col-sm-3 pdng">
                          <div className="personDetails pdng col-sm-12">
                              <div className="personName">{this.state.profileDetails.profile.first_name}</div>
                              <div className="personJoined">Joined {this.state.profileDetails.profile.joined} ago</div>
                          </div>
                        </div>
                         <div className="margtp col-sm-3">
                             <div className="col-sm-12">
                                 <div className="pdng fntbld col-sm-6">Skill Level</div>
                                 <div className="pdng fntlyt col-sm-6">{this.state.profileDetails.skills.skill_level}</div>
                             </div>
                             <div className="col-sm-12">
                                 <div className="pdng fntbld col-sm-6">Type of Golfer</div>
                                 <div className="pdng fntlyt col-sm-6">{this.state.profileDetails.skills.golfer_type}</div>
                             </div>
                          </div>
                          <div className="margtp col-sm-3">
                             <div className="col-sm-12">
                                 <div className="pdng fntbld col-sm-6">Profile Type</div>
                                 <div className="pdng fntlyt col-sm-6">{this.state.profileDetails.profile.is_private?'Private':'Public'}</div>
                             </div>
                             <div className="col-sm-12">
                                 <div className="pdng fntbld col-sm-6">Handicap</div>
                                 <div className="pdng fntlyt col-sm-6">{this.state.profileDetails.skills.handicap==0?'No':'Yes'}</div>
                             </div>
                          </div>
                      </div>
                  </div>
              </div>)}
          </div>
              );
            }else {
              return(<div></div>);
            }
   }
}

profileDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
       activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
       selectedProfileDetails: state.selectedProfileDetails,

    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({getProfileDetails, onSendRequest, createNewMessage}, dispatch);


}
export default connect(mapStateToProps,matchDispatchToProps) (profileDetail);
