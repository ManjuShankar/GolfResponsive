import React,{Component} from 'react';
import EventListDetail from './eventListDetail';
import UpcomingEventDetails from './upcomingEventDetails';
import CreateEvent from './createEvent';
import _ from 'lodash';
class EventsTab extends Component{
  constructor(props){
    super(props);
  }

  onSaveClick(formData){
    if(this.props.onSaveClick){
        this.props.onSaveClick(formData);
    }
  }

  render(){
    const {eventsList, onEventClick, upComingeventDetail, isCreateOrEdit, onSaveClick, onRequestInviteClick, activeUser, onButtonClick, isSaveInProgress} = this.props;
    return(<div className="eventsPageDetail">
      <div className="col-sm-4 eventScrollTab brdr2pxddd">
        <div className="eventListLeft">
          <ul className="noListStyle">
            {_.size(eventsList)>0 && eventsList.map((eventDetail, index)=>{
                return(<div key={index}><EventListDetail onEventClick={onEventClick} eventsList={eventsList} eventDetail={eventDetail} /></div>);
            })}
          </ul>
        </div>
     </div>
          {(isCreateOrEdit=="Create" || isCreateOrEdit=="Edit")?(<CreateEvent isSaveInProgress={isSaveInProgress} activeUser={activeUser} onSaveClick={this.onSaveClick.bind(this)} isCreateOrEdit={isCreateOrEdit} upComingeventDetail={upComingeventDetail} />):(<UpcomingEventDetails activeUser={activeUser} onRequestInviteClick={onRequestInviteClick} upComingeventDetail={upComingeventDetail} activeUser={activeUser} onButtonClick={onButtonClick} />)}
    </div>);
  }
}

export default EventsTab;
