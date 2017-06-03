import React, {Component} from 'react';

import _ from 'lodash';
import moment from 'moment';

class Week extends Component{
   constructor(props){
        super();
        this.state={
         selectedEventDates:(_.size(props.selected)>0)?(Object.assign([], props.selected)):([]),
         date: props.date
       };
     }

   componentWillMount(){

     this.setState({selectedEventDates:this.props.selected});
   }

   componentWillReceiveProps(nextProps){
      if(this.props.date!=nextProps.date){
        this.setState({date:nextProps.date});
      }
      if(this.props.selected!=nextProps.selected){
           this.setState({selectedEventDates:nextProps.selected});
       }
   }



   render(){
     let days = [],
     date = this.state.date,
     month = this.props.month;
     let modifiedMonth = ((month.month()+1).toString().length==1)?("0"+ (month.month()+1).toString()):((month.month()+1).toString());
     let modifiedDates = (date.date().toString().length==1)?("0"+ date.date().toString()):(date.date().toString());
     let modifiedDate = date.year().toString() + "-" + modifiedMonth + "-" + modifiedDates;

     for (let i = 0; i < 7; i++) {
     let day = {
       number: date.date(),
       isCurrentMonth: date.month() === month.month(),
       isToday: date.isSame(new Date(), "day"),
       date: date
     };

     /*let reducedArray = ["2017-05-01", "2017-05-02", "2017-05-03", "2017-05-04", "2017-05-05", "2017-05-06", "2017-05-07", "2017-05-08", "2017-05-09"];
     console.log("reducedArray", reducedArray);*/
     days.push(<span key={day.date.toString()}
                className={"day" + (day.isToday ? " today" : "") + (day.isCurrentMonth ? "" : " different-month") +
                      (_.find(this.state.selectedEventDates, function(n) { let isHighLight =  (n == modifiedDate); return isHighLight; })?" selected":"")
                }
              onClick={this.props.select.bind(this,day)}>{day.number}</span>);
     date = date.clone();
     date.add(1, "d");

   }
   return(<div className="week" key={days[0].toString()}>{days}</div>);
 }
}

export default Week;
