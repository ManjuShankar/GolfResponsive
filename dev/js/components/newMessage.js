import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createNewMessage, getUsers} from '../actions/messagesAction';
var serialize = require('form-serialize');
var ReactTags = require('react-tag-autocomplete');

class NewMessage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state={
      tags: [],
      suggestions: [],
      errMsg: "",
      msgTxt: "",
      buttonDisable1:true
      
    };
  }

  componentWillMount(){
      this.props.getUsers(this.props.activeUser.token).then((data)=>{
          this.setState({suggestions: data});
          console.log("suggestions",data);
      }).catch((error)=>{

      });
  }

  handleDelete(i) {
   let tags = this.state.tags.slice(0);
   tags.splice(i, 1);
   this.setState({ tags: tags });
 }

 handleAddition(tag) {
   let tags = this.state.tags.concat(tag);
   this.setState({ tags: tags });
 }

  navigateToMessages(){
      this.context.router.push('/messages');
  }

  sendNewMessage(){
    let form = document.querySelector('#addMessageForm');
    let formData = serialize(form, { hash: true });
    let participants;
    if(_.size(this.state.tags)>0)
    {
        this.state.tags.map((item, index)=>{
          if(participants==undefined){
            participants = item.email;
          }
          else {
            participants = participants + "," + item.email;
          }
      });
    }
      ///formData.participants=participants;
      _.set(formData, 'participants', participants);
      console.log("Form Data", formData);
      this.props.createNewMessage(this.props.activeUser.token, formData).then(()=>{
      this.context.router.push('/messages');
    }).catch((error)=>{
      console.log("Error", error);
    });
  }
  /*****/
  onRequired(e){
    if(e.target.name == "message"){
      if(e.target.value == ""){
        this.setState({
          errM:(<span className="err-msg">Please enter something . . .</span>),
          msgTxt:"",
          buttonDisable1 : true
        });
      }
      else{
        this.setState({
          errM:"",
          msgTxt:e.target.value,
          buttonDisable1 : false
        });
      }
    }
  }
  /*****/
  render() {
    console.log("tags",this.state.tags);
    return (
      <div className="newMessage">
        <div className="msg_screenPage">
          <form action="/" className="card" id="addMessageForm" method="post">
            <div className="msgcontainer">
                <div className="msgHeading">
                    MESSAGES
                 </div>
            </div>
            <div className="compose col-sm-12">

                <div className="sendto">
                <span className="col-xs-1 txtRyt">
                  TO:</span><span className="col-sm-10 zindex1"> <ReactTags
                    tags={this.state.tags}
                    suggestions={this.state.suggestions}
                    handleDelete={this.handleDelete.bind(this)}
                    handleAddition={this.handleAddition.bind(this)}
                    placeholder="Add Recipients" /></span>
                </div><div className="divLine col-sm-12"></div>
                <div className="msg col-sm-12">
                    <textarea name="message" maxLength="1000" id="message" ref="message" className="txtarea" onChange={this.onRequired.bind(this)}></textarea>
                </div>
                {this.state.errM}
                <div className="brdrline col-sm-12"></div>
                <div className="col-sm-12">

                    <span className="rytside">
                        <button onClick={this.navigateToMessages.bind(this)} className="btn btnCncl">Cancel</button>
                        <input type="button" value="Send" onClick={this.sendNewMessage.bind(this)} className="btn btnSnd btnSend" disabled={(!(_.size(this.state.tags)>0)) || !this.state.msgTxt || this.state.buttonDisable1} />
                    </span>
                </div>
            </div>
          </form>
        </div>
        <div className="mobileMsgRspnsv">
          <div className="headerMsg col-sm-12 zeroPad">
            <span className="glyphicon glyphicon-remove col-sm-1 txtwhite" onClick={this.navigateToMessages.bind(this)}/>
            <h3 className="col-sm-11 msgbg">NEW MESSAGE</h3>
          </div>
          <div className="send_to">
            <ReactTags
                    tags={this.state.tags}
                    suggestions={this.state.suggestions}
                    handleDelete={this.handleDelete.bind(this)}
                    handleAddition={this.handleAddition.bind(this)}
                    className="email_ID" placeholder="To"/>
          </div>
          <div className="recent_rply">Recent</div>
          <div className="sendingMsg">
            <div className="bgType">
              <span className="glyphicon glyphicon-camera msg_Media" />
              <input type="text" placeholder="Type message here.." className="msg_Typing" />
              <button className="msg_send">Send</button>
            </div>
          </div>
        </div>
      </div>
         );
   }
}

NewMessage.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
       activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({createNewMessage, getUsers}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps) (NewMessage);