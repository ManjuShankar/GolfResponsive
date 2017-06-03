import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {savePostDetails, getPostList} from '../actions/postAction';
import {getNotificationsCount, invite, searchAll} from '../actions/headerAction';

import _ from 'lodash';
var serialize = require('form-serialize');

import { Link } from 'react-router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {userSignOut} from '../actions/loginAction';
import {isValidEmail} from '../utils/Validation';

class Header extends React.Component {
    constructor(props, context) {
    super(props, context);
        this.state={
          PostData:{},
          GroupList: (props.savePost!=undefined && props.savePost!=null && _.size(props.savePost)>0 && _.size(props.savePost.groups)>0)?(props.savePost.groups):([]),
           EventList: (props.savePost!=undefined && props.savePost!=null && _.size(props.savePost)>0 && _.size(props.savePost.events)>0)?(props.savePost.events):([]),
          notificationCount: 0,
          isGroupSelected: true,
          errEmail:"",
          errTitle :"",
          email:"",
          inviteMsg:"",
          titleMsg:"",
          contentMsg:"",
          buttonDisable1 : true,
          buttonDisable2 : true
        };
        this.onFieldChange=this.onFieldChange.bind(this);
  }

    getCount(){
      this.props.getNotificationsCount(this.props.activeUser.token).then((notificationLength)=>{
            this.setState({notificationCount:notificationLength});
          }).catch((error)=>{
       });
    }

    getNotificationsCount(){
        var self = this;
          setTimeout(function() {
                      self.getCount(); // do it once and then start it up ...
                      self._timer = setInterval(self.getCount.bind(self), 20000);
            }, 1000);
    }

    componentWillUnmount(){
      if (this._timer) {
          clearInterval(this._timer);
          this._timer = null;
        }
    }

    componentDidMount(){
        this.getNotificationsCount();
    }

    componentWillMount(){
        this.props.getNotificationsCount(this.props.activeUser.token).then((notificationLength)=>{
              this.setState({notificationCount:notificationLength});
               
            }).catch((error)=>{
         });
         this.props.getPostList( this.props.activeUser.token).then(()=>{
            this.setState({PostList:this.props.savePost.PostList});
        }).catch((error)=>{

       });
    }
    
    componentWillReceiveProps(nextProps){
      if(this.props.PostList!=nextProps.savePost){
             this.setState({PostList:this.props.savePost});
      }

     /* if(this.props.getGroupList!=nextProps.getGroupList){
          this.props.getPostList(this.props.activeUser.token).then(()=>{
                 this.setState({GroupList:nextProps.savePost.groups});
             }).catch((error)=>{
          });
      }
       if(this.props.eventList!=nextProps.eventList){
          this.props.getPostList(this.props.activeUser.token).then(()=>{
                 this.setState({EventList:nextProps.savePost.events});
             }).catch((error)=>{
          });
      }*/
    }
    onRadioGroupChange(e, val){
        this.setState({isGroupSelected: e});
    }

    onFieldChange(e){
      console.log("Event", e);
    }


    savePostInformation(formData){
      this.props.savePostDetails(formData, this.props.activeUser.token).then(()=>{
            this.setState({PostData:this.props.savePost});
            document.getElementById('title').value='';
            document.getElementById('body').value='';
            
            $('#firstModal').modal('hide');
        }).catch((error)=>{
        });
    }

     onPostDetailsSave (){
       let form = document.querySelector('#postForm');
       let formData = serialize(form, { hash: true });
       if(formData.modal_post=="groups"){
         if(_.has(formData, 'title') && _.has(formData, 'body') && _.has(formData, 'group'))
         {
           this.savePostInformation(formData);
         }
         else{
            if(_.has(formData, 'group')){
                  toastr.error("Fill all the required fields");
            }else{
              toastr.error("You are not yet part of any group");
            }
         }
       }else if(formData.modal_post=="events"){
         if(_.has(formData, 'title') && _.has(formData, 'body') && _.has(formData, 'event'))
         {
           this.savePostInformation(formData);
         }
         else{
           if(_.has(formData, 'group')){
                 toastr.error("Fill all the required fields");
           }else{
             toastr.error("You are not yet part of any event");
           }
         }
       }
     }

     onInvite(){
       let form = document.querySelector('#inviteForm');
       let formData = serialize(form, { hash: true });
       this.props.invite(formData, this.props.activeUser.token).then(()=>{
            document.getElementById('useremails').value='';
            document.getElementById('messagebody').value='';
            $('#secondModal').modal('hide');
         }).catch((error)=>{
         });
     }



  onSignOut(){
    this.props.userSignOut(this.props.activeUser.token).then(()=>{
        this.context.router.push('/');
    }).catch((error)=>{
        this.context.router.push('/');

    });
  } 

  onSearchButtonClick(){
      let searchTxtValue =document.getElementById('searchCriteriaText').value;
      this.props.searchAll(this.props.activeUser.token, searchTxtValue).then(()=>{
        this.context.router.push('/globalSearch');
      }).catch((error)=>{
          console.log("Error", error);
      });
  }

  onGlobalSearch(e){
      if(e.which==13)
      {
        this.props.searchAll(this.props.activeUser.token, e.target.value).then(()=>{
          this.context.router.push('/globalSearch');

        }).catch((error)=>{
            console.log("Error", error);
        });
      }
  }
  onPostClick(){
    
    $('#firstModal').modal('show');
     this.props.getPostList( this.props.activeUser.token).then(()=>{
            this.setState({PostList:this.props.savePost.PostList});
        }).catch((error)=>{

       });
         /* this.props.getPostList(this.props.activeUser.token).then(()=>{
                 this.setState({GroupList:nextProps.savePost.groups});
             }).catch((error)=>{
          });
     
          this.props.getPostList(this.props.activeUser.token).then(()=>{
                 this.setState({EventList:nextProps.savePost.events});
             }).catch((error)=>{
          });*/
      
  }

  settingsIconToggle(){
    $('#settingsIcon').on('click',function(){
      if($('#xx').is(':visible')){
    $('#settingsIcon').fadeOut(function () {
        $('#sidebar-toggle').toggle('slide', {
            direction: 'right'
        }, 1000);
    });
    }
    else{
        $('#sidebar-toggle').toggle('slide', {
            direction: 'right'
        }, 1000, function(){ $('#settingsIcon').fadeIn();});
    }
  });
  }
  /*backToggleIcon(){
    $('#backToggle').on('click',function(){
      if($('#xx').is(':visible')){
    $('#settingsIcon').fadeIn(function () {
        $('#sidebar-toggle').toggle('slide', {
            direction: 'right'
        }, 1000);
    });
    }
    else{
        $('#sidebar-toggle').toggle('slide', {
            direction: 'right'
        }, 1000, function(){ $('#settingsIcon').fadeOut();});
    }
  });

 }*/
   /*{ $("#backToggle").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
});

    $('#backToggle').on('click',function() {             
        $(this).closest('#sidebar-wrapper').fadeOut('slide',function(){
          $('#settingstoggle').fadeIn();  
        });
        $('#settingsIcon').on('click',function(){   
        $('#sidebar-wrapper').fadeIn();}
       {/* $('#settingstoggle').hide();
 {/* })
        
      });
}  */
/*****/
onRequired(e){
   if(e.target.name == "useremails"){
            let errors = isValidEmail(e.target.value);
             if(errors == false){
                    this.setState({
                    errEmail : (<span className="err-msg"> Invalid Email</span>),
                    email : "",
                    buttonDisable2: true
               });
            }
            else{
                     this.setState({
                    errEmail : "",
                    email : e.target.value,
                    buttonDisable2 : false
               });
            }
          }
  if(e.target.name == "messagebody"){
            if(e.target.value == ""){
              this.setState({
                 inviteMsg : "",
                 buttonDisable2 : true
              });
            }
            else{
              this.setState({
                inviteMsg: e.target.value,
                buttonDisable2 : false
              });
            }
          }
  if(e.target.name == "title"){
          if(e.target.value == ""){
              this.setState({
                    titleMsg : "",
                    errTitle : (<span className="err-msg"> Please enter the Title</span>),
                    buttonDisable1 : true
              });
            }
            else{
               this.setState({
                    errTitle : "",
                    titleMsg : e.target.value,
                    buttonDisable1 : false
              });
            }
          }
  if(e.target.name == "body"){
            if(e.target.value == ""){
              this.setState({
                    contentMsg : "",
                    buttonDisable1 : true
              });
            }
            else{
               this.setState({
                    contentMsg : e.target.value,
                    buttonDisable1 : false
              });
            }
          }
       }
/*****/


   render() {

      return (
         <div className="leftBody">
          <div className="MobileNav" id="mobileNav">
            <div className="NameOfScreen">
                    <span>Home</span>
            </div>
            <div className="geaderIconScreen">
            <div id="xx">
                <Link to="/notifications">{(this.state.notificationCount>0)?(<span className="badge notifyCount">{this.state.notificationCount}</span>):(<span></span>)}<button className="notiButton m0px glyphicon glyphicon-bell notificationsIcon"></button></Link>
                           <Link to="/messages"><button className="chatbtn"> <span className="chatButton"><img src="/assets/img/icons/Chat_icon.png" className="mrgn9px"/></span></button></Link>
                          <button className="settingsIcon" id="settingsIcon" onClick={this.settingsIconToggle.bind(this)}><span className="glyphicon glyphicon-cog"></span></button>
                           </div>
                           <div id="sidebar-toggle" onClick={this.settingsIconToggle.bind(this)}>
                            <div>
                              <div className="bg4b4">
                              <span className="glyphicon glyphicon-chevron-right backToggle" id="backToggle" onClick={this.settingsIconToggle.bind(this)}/>
                                <div className="">
                                  <img src="../assets/img/Golf_login_Logo.png" className="settingsImg"/>
                                </div>
                                <h3 className="txt-center settingsName">SETTINGS</h3>
                              </div>
                              <div>
                                <ul className="nav sidebar-nav">
                                  <Link to="/profile_0"><li className="sidebar-brand">My Clubhouse</li></Link>
                                  <Link to="/accountSettings"><li className="sidebar-brand">Account Settings</li></Link>
                                  <li className="sidebar-brand" onClick={this.onSignOut.bind(this)}>Sign Out</li>
                                </ul>
                            </div>
                            </div>
                           </div>
                           {/*<button className="sidebar-toggle settingsIcon" id="settingsIcon" data-toggle="collapse" data-target="#sidebar-wrapper" role="navigation" onClick={this.settingsIconToggle.bind(this)}><span className="glyphicon glyphicon-cog"></span></button>
                            <div className="">
                              <nav className="navbar navbar-inverse navbar-fixed-top " id="sidebar-wrapper" role="navigation">
                              <div className="bg4b4">
                                <span className="glyphicon glyphicon-chevron-right backToggle" id="backToggle"/>
                                <div className="">
                                  <img src="../assets/img/Golf_login_Logo.png" className="settingsImg"/>
                                </div>
                                <h3 className="txt-center settingsName">SETTINGS</h3>
                                </div>
                                <ul className="nav sidebar-nav">
                                  <Link to="/profile_0"><li className="sidebar-brand">My Clubhouse</li></Link>
                                  <Link to="/accountSettings"><li className="sidebar-brand">Account Settings</li></Link>
                                  <li className="sidebar-brand" onClick={this.onSignOut.bind(this)}>Sign Out</li>
                                    </ul>
                              </nav>
                              
                            
                           </div>*/}
          </div>  
          </div>
          <nav>
            <div className="row col-sm-12 zeroPad">
                <div className="col-sm-5 col-md-5 pdngryt0px mtp2pc">
                    <div className="col-sm-12 pdngryt0px">
                        <div className="searchBox col-sm-12">
                          <div className="col-sm-11 zeroPad">
                            <input id="searchCriteriaText" onKeyPress={this.onGlobalSearch.bind(this)} type="text" placeholder="Search for courses, groups, people, events, posts, #tags"  />
                          </div>
                          <div className="col-sm-1 zeroPad">
                            <button className="search-btn"><span className="searchbtn-img"><img onClick={this.onSearchButtonClick.bind(this)} src="/assets/img/icons/Search_Icon.png"/></span></button>
                          </div>
                        </div>
                    </div>

                </div>
                <div className="col-sm-7 col-md-7 mt2pc">
                    <div className="col-sm-12 col-md-12">
                        <div className="navHeader">
                            <button className="pstbtn" onClick={this.onPostClick.bind(this)}><a className="butn-post" data-toggle="modal" data-target="#"><span className="postButton m0px"><img src="/assets/img/icons/POST.png" /></span></a></button>
                            <div className="modal fade addPost" id="firstModal" role="dialog" data-backdrop="static">
                            <div className="modal-dialog">
                            <form id="postForm">
                               <div className="modal-content">
                                   <div className="modal-header col-sm-12 bgGreen">Add Post</div>
                                   <div className="modal-body col-sm-12 bgwhite mb0px">

                                       <div className="chckbx radio">
                                              <span className="grp1 ttt"><label onClick={this.onRadioGroupChange.bind(this, true)} className="grp2 sss"><input defaultChecked={this.state.isGroupSelected} type="radio" value="groups" name="modal_post" onChange={this.onRadioGroupChange.bind(this, true)} id="grp3" className="inpt" />Group</label></span>
                                              <span className="evnt1 ttt"><label onClick={this.onRadioGroupChange.bind(this, false)} className="evnt2 sss"><input defaultChecked={!this.state.isGroupSelected} type="radio"  value="events" name="modal_post"  onChange={this.onRadioGroupChange.bind(this, false)} id="evnt3"  className="inpt"  />Event</label></span>
                                       </div>

                                       <div className="tab-content mtpbtm">
                                       <div id="groups"  className="tab-pane active yyy">
                                                {(this.state.isGroupSelected)?(<select className="form-control" onChange={this.onFieldChange} id="selection" name="group">
                                                  {_.size(this.props.savePost)>0 && this.props.savePost.groups.map((item,i)=>{
                                                      return(<option key={i} value={item.id} id="grpList" className="selection">{item.name}</option>)
                                                    })}
                                                </select>):(
                                                <select className="form-control" id="selection" name="event" onChange={this.onFieldChange}>
                                                     {_.size(this.props.savePost)>0 && this.props.savePost.events.map((item,i)=>{
                                                      return(<option key={i} value={item.id} id="eventList" className="selection">{item.name}</option>);
                                                    })}
                                                </select>)}

                                      </div>
                                       </div>
                                       <div className="txtarea1 mtpbtm">
                                            <textarea className="txt-Title form-control" maxLength="100" placeholder= "Title*" id="title" name="title" onChange={this.onRequired.bind(this)}></textarea></div>
                                            {this.state.errTitle}
                                       <div className="txtarea2 mtpbtm">
                                            <textarea className="txt-Body form-control" maxLength="1000" placeholder= "Content*" id="body" name="body" onChange={this.onRequired.bind(this)}></textarea>
                                       </div>

                                   </div>
                                  <div className="modal-footer col-sm-12 bgwhite">
                                    <input type="button" className=" btn btnPrimary " value="Send" id="btnSend" onClick={this.onPostDetailsSave.bind(this)} disabled={this.state.buttonDisable1 || !this.state.titleMsg || !this.state.contentMsg }/>
                                    <input type="button" className=" btn btnSecondary " data-dismiss="modal" value="Cancel" />
                                 </div>
                                </div>
                                </form>
                            </div>
                          </div>

                            <button className="invtbtn"><a className="butn-invite" data-toggle="modal" data-target="#secondModal"><span className="inviteButton m0px"><img src="/assets/img/icons/inviteIcon.png" /></span></a></button>
                            <div className="modal fade addInvite" id="secondModal" role="dialog" data-backdrop="static">
                            <form action="" method="post" id="inviteForm" name="inviteForm" ref="inviteForm">
                            <div className="modal-dialog  tpmdl">
                               <div className="modal-content">
                                   <div className="modal-header col-sm-12 bgGreen"><h4 className="m0px">INVITE NEW USER TO GOLF CONNECTX</h4></div>
                                   <div className="modal-body col-sm-12 bgwhite mb0px">
                                   <div className="col-sm-12">
                                      To:<input type="email" placeholder="abc@gmail.com" id="useremails" name="useremails" className="invtSearch" onChange={this.onRequired.bind(this)}/>
                                   </div>
                                   {this.state.errEmail}
                                   <div className="col-sm-12">
                                    <textarea className="txtarea form-control invtTxtArea" id="messagebody" name="messagebody" maxLength="500" placeholder="Write Something..." onChange={this.onRequired.bind(this)} />
                                   </div>
                                   </div>
                                  <div className="modal-footer col-sm-12 bgwhite">
                                    <button type="button" className="btn butnSend" id="btnSend"  onClick={this.onInvite.bind(this)} disabled={this.state.buttondisable2 || !this.state.inviteMsg || !this.state.email}>Send</button>
                                    <button type="button" className="btn butnCncl" data-dismiss="modal">Cancel</button>
                                 </div>
                                </div>
                            </div>
                            </form>
                          </div>


                           <Link to="/notifications">{(this.state.notificationCount>0)?(<span className="badge notifyCount">{this.state.notificationCount}</span>):(<span></span>)}<button className="notiButton m0px glyphicon glyphicon-bell notificationsIcon"></button></Link>
                           <Link to="/messages"><button className="chatbtn"> <span className="chatButton"><img src="/assets/img/icons/Chat_icon.png" className="mrgn9px"/></span></button></Link>

                                 <button className="nzbtn"> <span className="accButton"><img src={'http://'+this.props.activeUser.profile_image_url} className="profileImage"/></span></button>

                        <div className="dropdown mt10px">
                                 <button className="dropdown-toggle " type="button" id="dd1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <span className="arrowButton"><img src="/assets/img/icons/Arrow_Icon.png" className="arwbtn"/></span></button>
                            <ul className="dropdown-menu dropdownContent" aria-labelledby="dd1">
                               <Link to="/profile_0"><li className="dropdown-item" type="button">My Clubhouse</li></Link>
                               <Link to="/accountSettings"> <li className="dropdown-item" type="button">Account Settings</li></Link>

                              <li className="dropdown-item signout-chngs" type="button" onClick={this.onSignOut.bind(this)}><img src="/assets/img/icons/signout_icon.png" className="signout-icon" id="initial"/><img src="/assets/img/icons/signout_hover.png" className="hover-signout" id="onhover" />Sign Out</li>
                               </ul>
                            </div>




                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>

      );
   }
}

Header.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {

    return {
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
        savePost:state.savePost,
        getGroupList: (state.getgroupList!=undefined && state.getgroupList!=null)?state.getgroupList:[],
         eventList: (state.eventReducer!=null)?state.eventReducer:[]
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({userSignOut, savePostDetails, getNotificationsCount, invite, getPostList, searchAll}, dispatch);
}

export default  connect(mapStateToProps, matchDispatchToProps)(Header);