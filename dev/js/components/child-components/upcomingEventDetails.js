import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
 import {getAttendeesList} from '../../actions/eventDetailsAction';
class UpcomingEventDetails extends Component{
constructor(props){
  super(props);
  this.state={
        courseId:"", attendees:Object.assign([],props.EventReducer)
       };
}
 
onButtonClick(val)
{
  this.setState({courseId:"hello"});
 
  if(this.props.onButtonClick){
    this.props.onButtonClick(val);
 
  }
}
/*componentWillMount(){
   this.props.getAttendeesList(this.props.selectedEvent.id, this.props.activeUser.token).then(()=>{
            this.setState({attendees:this.props.EventReducer});
        }).catch((error)=>{
        });
}*/
componentWillReceiveProps(nextProps){
            if(this.props.upComingeventDetail!=nextProps.upComingeventDetail){
                this.setState({courseDetails:nextProps.upComingeventDetail});
            }
}
 
  render(){
    const {upComingeventDetail, onRequestInviteClick, activeUser, onButtonClick}= this.props;
 
    return(
      (upComingeventDetail!=undefined && upComingeventDetail!=null && _.size(this.props.upComingeventDetail)>0)?(<div className="col-sm-8 mt20px">
      {(upComingeventDetail.cover_image!=undefined && upComingeventDetail.cover_image!=null)?((upComingeventDetail.cover_image.height>=103 && upComingeventDetail.cover_image.width>=725)?(<img src={'http://' + upComingeventDetail.cover_image.image} className="eventImg" />):(
      <div className="hero">
            <img className="hero__background" src={'http://' + upComingeventDetail.cover_image.image} />
            <center><img className="hero__image"  src={'http://' + upComingeventDetail.cover_image.image} /></center>
       </div>
       )):(<img src="/assets/img/4th_july.jpg" className="eventImg" />)}
 
             <div className="inlinedisplay">
                <div className="eventbody"><span className="datespan">{upComingeventDetail.start_date}</span>
                <br/>
                <span className="addspan">{upComingeventDetail.name}</span>
                <br/>
                <span className="addspan">{upComingeventDetail.venue}</span>
           <br/>
           <span className="addspan">{upComingeventDetail.start_time} - {upComingeventDetail.end_time}</span>
              </div>
 
               {(this.props.upComingeventDetail!=undefined && this.props.upComingeventDetail!=null && this.props.activeUser!=null && this.props.activeUser.id!=this.props.upComingeventDetail.created_by.id)?(<div>
 
                <button onClick={onRequestInviteClick}  className="requestinvite">Request an Invite</button>
 
               </div>):(<div>
                <img src="/assets/img/black-male-user-symbol.png" className="adminIconImg" />
                <button onClick={this.onButtonClick.bind(this, "Edit")} className="btn-EditEvent">Edit Event</button>
                 <input type="hidden" className="shareEvent" value="Share Event" />
                 </div>)}
              </div>
              <div className="dividerLine"></div>
                {upComingeventDetail.selected_group!=null && upComingeventDetail.selected_group!=undefined?<div className="inlinediv">
                  <img className="eventGroup" src={"http://"+upComingeventDetail.selected_group.image_url}></img>
                  <div className="eventgrptxt">
                  <h3 className="mt0px">{upComingeventDetail.selected_group.name}</h3>
                    <span className="pvtevnt">{upComingeventDetail.is_private?"Private Event":"Public Event"}</span>
                  
                  </div>
                  {(this.props.upComingeventDetail!=undefined && this.props.upComingeventDetail!=null && this.props.activeUser!=null && this.props.activeUser.id!=this.props.upComingeventDetail.created_by.id)?(<div className="col-sm-4"><button className="adminimg">Contact Admin</button></div>):(<div></div>)}
                </div>:<div></div>}
                <div className="detailsheader">Details
                <div className="eventDetails">
                <div className="col-sm-12 mt1pc zeroPad">
                {this.props.upComingeventDetail.description}
                </div>
                </div>
              </div>
              <div className="dividerLine1Event"></div>
              <div className="col-sm-10">
                <div  className="modaldiv">
                <div className="modal fade" id="myModal" role="dialog">
    <div className="modal-dialog modal-sm">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal">&times;</button>
          <h4 className="modal-title">Modal Header</h4>
        </div>
        <div className="modal-body">
          <p>This is a small modal.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
                 <div className="eventFriends col-sm-4" >
                    <span className="fr atndfrnd mt3px mr15px" >{this.props.upComingeventDetail.attendee_stats.attending} attending</span>
                  </div>
                </div>
                <div className="col-sm-3 brdright brdrleft mt3px txtAlignCentre"><span>{this.props.upComingeventDetail.attendee_stats.notattending} Rejected</span></div>
                  <div className="col-sm-3 mt3px"><span>{this.props.upComingeventDetail.attendee_stats.maybe} Responding</span></div>
                </div>
                <div className="greenBrdr col-sm-12"></div>
                {_.size(this.props.upComingeventDetail.files)>0?(<div><div className="dividerLine2"></div>
                  <button className="downloadbutton">
                    <span><img src="/assets/img/downloadimg.png" className="mr15px"></img><a href={'http://' + this.props.upComingeventDetail.files[0].file} target="_blank"> Download/Upload Tee Time/Results</a></span>
                  </button></div>):('')}
                </div>):(<div></div>));
  }
}
 UpcomingEventDetails.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
      activeUser:(state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
         selectedEvent:state.selectedEvent
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({getAttendeesList}, dispatch);


}

export default  connect(mapStateToProps, matchDispatchToProps)(UpcomingEventDetails);
