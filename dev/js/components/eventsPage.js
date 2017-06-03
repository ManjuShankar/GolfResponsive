import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
 
import _ from 'lodash';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import {eventDetails, getCurrentEvent, calendarEvents, onDayEvents} from '../actions/eventDetailsAction';
import {createEvents, editEvents} from '../actions/createEventAction';
import EventsTab from './child-components/eventsTab';
import CreateEvent from './child-components/createEvent';
import Spinner from 'react-spinner';
import Calendar from './child-components/calendarExample';

class EventsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
                    currentEventList:[],
                    pastEventList:[],
                    dayEvents:[],
                    upComingeventDetail:{},
                    isCreateOrEdit: "Upcoming",
                    ajaxCallInProgress:false,
                    isSaveInProgress:false,
                     calendar:Object.assign([],props.eventReducer), manSelect:"",eventDisplayDate:""
                    
                    
        };

        this.onEventClick=this.onEventClick.bind(this);
    }


    componentWillMount(){
        this.setState({ajaxCallInProgress:true});
        this.props.eventDetails(this.props.activeUser.token).then(()=>{
            this.setState({currentEventList:this.props.eventList.CurrentEvents, pastEventList:this.props.eventList.PastEvents});
              this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
             if(error == "Error: Request failed with status code 401"){
             this.context.router.push('/');
            }
            this.setState({ajaxCallInProgress:false});
        });
    }

    componentWillReceiveProps(nextProps){
            if(this.props.eventList.CurrentEvents!=nextProps.eventList.CurrentEvents){
                this.setState({currentEventList:nextProps.eventList.CurrentEvents});
            }
            if(this.props.eventList.PastEvents!=nextProps.eventList.PastEvents){
              this.setState({pastEventList:nextProps.eventList.PastEvents});
            }
            if(_.size(this.state.upComingeventDetail)==0 && _.size(this.state.currentEventList)>0){
                this.getEvent(this.state.currentEventList[0].id);
            }
    }

    onTabClick(currentTab=1){
      if(currentTab==1 && _.size(this.state.currentEventList)>0){
          this.getEvent(this.state.currentEventList[0].id);
      }
      else if(currentTab==2 && _.size(this.state.pastEventList)>0){
        this.getEvent(this.state.pastEventList[0].id);
      }
      else if(currentTab==3){
        var today = moment();
        var eventDate = today.format("MM/DD/YYYY");
        today = today.format("MMM DD,YYYY");
        
       this.props.calendarEvents(this.props.activeUser.token).then(()=>{
       this.setState({calendar:this.props.eventReducer.CalendarEvents,eventDisplayDate:today});
       this.props.onDayEvents(this.props.activeUser.token,eventDate).then(()=>{
            this.setState({dayEvents : this.props.eventReducer.onDayEventDetails});
       });
       console.log("this.state.calendar",this.state.calendar);
      }).catch((error)=>{
      });
      }
      
       
     
    }
 
    getEvent(eventId){
      this.props.getCurrentEvent(eventId, this.props.activeUser.token).then(()=>{
        this.setState({upComingeventDetail:this.props.selectedEvent});
      }).catch((error)=>{
      });
    }
    onEventClick(eventsList, eventId){
        this.getEvent(eventId);
        this.setState({isCreateOrEdit: "Upcoming"});
    }

   onSaveClick(formData){
     this.setState({isSaveInProgress:true});
     if(this.state.isCreateOrEdit=="Create")
     {
      this.props.createEvents(formData, this.props.activeUser.token).then(()=>{
        this.setState({isCreateOrEdit: "Upcoming"});
        this.setState({isSaveInProgress:false});
        this.props.eventDetails(this.props.activeUser.token).then(()=>{
            this.setState({currentEventList:this.props.eventList.CurrentEvents, pastEventList:this.props.eventList.PastEvents});
            this.getEvent(this.props.eventList.CurrentEvents[0].id);
        }).catch((error)=>{
        });
      }).catch((error)=>{
        this.setState({isSaveInProgress:false});
      });
     }
     else {
       this.props.editEvents(formData,this.state.upComingeventDetail.id, this.props.activeUser.token).then(()=>{
         this.setState({isCreateOrEdit: "Upcoming"});
         this.setState({isSaveInProgress:false});
         this.props.eventDetails(this.props.activeUser.token).then(()=>{
             this.setState({currentEventList:this.props.eventList.CurrentEvents, pastEventList:this.props.eventList.PastEvents});
             this.getEvent(this.props.eventList.CurrentEvents[0].id);
         }).catch((error)=>{
         });
       }).catch((error)=>{
         this.setState({isSaveInProgress:false});
       });
     }
   }

    onButtonClick(val){
      this.setState({isCreateOrEdit:val});
    }

    onRequestInviteClick(){

    }
  selectOne(day){
    //this.forceUpdate();
  // console.log(day.date.format("MM/DD/YYYY")); 
  // this.setState({
  //     manSelect : day.date.format("MM/DD/YYYY")
  // });
  this.state.manSelect =  day.date.format("MM/DD/YYYY");
  var eventDate = this.state.manSelect;
  var dispDay = day.date.format("MMM DD,YYYY");
  this.state.eventDisplayDate = dispDay;
      
      this.props.onDayEvents(this.props.activeUser.token,eventDate).then(()=> {
      
      //this.state.dayEvents = this.props.eventReducer.onDayEventDetails;
      this.setState({
                dayEvents : this.props.eventReducer.onDayEventDetails
                
      })
      console.log("onClickEventDetails",this.props.eventReducer.onDayEventDetails);
    });
    console.log("indrajeetNaik",this.state.eventDisplayDate);
    console.log("selected_Date",this.state.manSelect);
   // console.log("names_of_event",this.props.eventReducer.onDayEventDetails[0].name);
  }
    componentDidMount() {
        $('.menu').parent().removeClass('active');
        $('#event').parent().addClass('active');
   }

    render(){
      
        return(<div className="eventsPage">
                <div className="leftBody">
                  <div className="coursesContainnerEvent">
                    <div className="eventsHeader"><img src="/assets/img/eventsImg.png" /><div className="img-event">My Events</div></div>
                      <div className="coursesContent">
                        <div className="tabsForEvents">
                          <Tabs>
                            <TabList className="EventsTabHeader">
                              <Tab onClick={this.onTabClick.bind(this, 1)}>Upcoming</Tab>
                              <Tab onClick={this.onTabClick.bind(this, 2)}>Past</Tab>
                              <Tab onClick={this.onTabClick.bind(this, 3)}>Calendar</Tab>
                              {(this.state.isCreateOrEdit=="Edit")?(<span></span>):(<span><button onClick={this.onButtonClick.bind(this, "Create")} className="btn-createEvent">+ Create Event</button></span>)}
                            </TabList>
                            <TabPanel>{(this.state.ajaxCallInProgress)?(<div className=""><Spinner /></div>):(
                              <EventsTab  isSaveInProgress={this.state.isSaveInProgress} onButtonClick={this.onButtonClick.bind(this)} onRequestInviteClick={this.onRequestInviteClick.bind(this)} onSaveClick={this.onSaveClick.bind(this)} eventsList={this.state.currentEventList} onEventClick={this.onEventClick} upComingeventDetail={this.state.upComingeventDetail} isCreateOrEdit={this.state.isCreateOrEdit} activeUser={this.props.activeUser} />
                            )}</TabPanel>
                            <TabPanel>
                              <EventsTab isSaveInProgress={this.state.isSaveInProgress} onRequestInviteClick={this.onRequestInviteClick.bind(this)} onSaveClick={this.onSaveClick.bind(this)} eventsList={this.state.pastEventList} onEventClick={this.onEventClick} upComingeventDetail={this.state.upComingeventDetail} isCreateOrEdit={this.state.isCreateOrEdit} activeUser={this.props.activeUser}  />
                            </TabPanel>
                            <TabPanel>
                            Calendar
                              {/*<div className="col-sm-12">
                                 <div className="col-sm-4">
                              <Calendar selFunc={this.selectOne.bind(this)} />
                              </div>
                              <div className="col-sm-8">
                                
                                
                                          <Tabs>
                            <TabList className="EventsTabHeader">
                             <Tab className="calender_Date wd100pc">{this.state.eventDisplayDate != undefined && this.state.eventDisplayDate != null ? this.state.eventDisplayDate : ""}</Tab>
                              </TabList>
                              <TabPanel>
                                          <div className="row">
  <div className="col-sm-12 calendarDiv">
     {this.state.dayEvents!=undefined && this.state.dayEvents!=null && _.size(this.state.dayEvents)!=0?
                                this.state.dayEvents.map((item,index)=>{
                                  return(<div className="thumbnail ml40px col-sm-5 hgt280px" key={index}>
                                    <div className="ovrflw">
      {item.cover_image!=null?<img src={'http://'+item.cover_image.image} className="eventImgForCalendar"  />:<div></div>}
      <div className="caption">
        <span className="eventName">{item.name}</span><br/>
         <span className="eventVenue">{item.venue}</span><br/>
         <span>{item.address1}</span><br/>
        <span>{item.start_time}-{item.end_time}</span>
        
     </div>
     {item.selected_group!=null?<div className="col-sm-12">
     <img src={'http://'+item.selected_group.image_url} className="grpImage col-sm-2 zeroPad"/>
     <div className="col-sm-10">
     <span className=" col-sm-12 fnt26px">{item.selected_group.name}</span><br/>
     <span className=" col-sm-12 fnt18px">{item.is_private?'Private Event':'Public Event'}</span>
     </div>

     </div>:<div></div>}
     <div>
    <span> Details</span>
     <p>{item.description}</p>
     </div>
     </div>
    </div>)
                               }):<div className="calenderDate_details">No Events on this Day</div>}
  </div>
</div>
</TabPanel>
</Tabs>
                                    </div>
                              </div>*/}
                              </TabPanel>
                            
                        </Tabs>
                   </div>
                 </div>
              </div>
            </div>
          </div>);
    }
}

EventsPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {

    return {
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
        eventList: (state.eventReducer!=null)?state.eventReducer:[],
        selectedEvent: state.selectedEvent,
        eventReducer:state.eventReducer
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({eventDetails, createEvents, editEvents, getCurrentEvent, calendarEvents, onDayEvents}, dispatch);
}

export default  connect(mapStateToProps, matchDispatchToProps)(EventsPage);
