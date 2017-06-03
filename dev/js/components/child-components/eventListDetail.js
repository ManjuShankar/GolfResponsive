import React, {Component} from 'react';

class EventListDetail extends Component{
    onEventClick(id){
        if(this.props.onEventClick){
            this.props.onEventClick(this.props.eventsList,id);
        }
    }

render(){
    const {eventDetail, onEventClick, eventsList}=this.props;
    const is_private=this.props.eventDetail.is_private;
    return(<div className="EventsLink cursor-pointer hover-property" >
                  <li onClick={this.onEventClick.bind(this, eventDetail.id)} className="noListStyle">
                      <div className="eventListTop">
                    <div className="eventDate">{eventDetail.start_date}</div>
                   <div className="priImg"><span className="privateTxt">{is_private?'Private':'Public'}</span><img src=""></img></div>
                    </div>
                      <div className="eventListMiddle">
                        <div className="eventListName">{eventDetail.name}</div>
                          <div className="ElViewLink">View <span className="glyphicon glyphicon-menu-right"></span></div>
                        <div className="EventListDT">{eventDetail.start_time} - {eventDetail.end_time}</div>
                      </div>
                      <div className="attending">
                        <div className="friendAttend">{eventDetail.attendee_stats.attending} attending</div>
                        <div className="friendThumb"></div>
                      </div>
                  </li>
              </div>
    );
    }
}

export default EventListDetail;
