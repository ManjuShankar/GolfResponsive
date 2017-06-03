import React, {Component} from 'react';
import GoogleMap from 'google-map-react';
import Marker from '../marker';


class NonPremiumCourse extends Component{
    constructor(props,context){
        super(props,context);
        

    }

    OnUnfollow(){
      if(this.props.OnUnfollow){
        this.props.OnUnfollow();
      }
    }

render(){
    console.log("this.props.courseDetails", this.props.courseDetails);

    return(
    	<div>{
    	 ((_.size(this.props.courseDetails)>0)?(<div className="col-sm-8">
        <div className="imgGolf"><img src="/assets/img/nonPremBanner.jpg"/></div>
                    <div className="col-sm-6"><div className="following nonPrefollowing">{((_.size(this.props.courseDetails)>0 && this.props.courseDetails.course_user_details.is_following)?(<span><span className="OrangeDot"><img src="/assets/img/icons/eclipse.png"/></span>Following</span>):(<span className="clrTrnsparnt">following</span>))}</div></div>
                   
                    <div className="col-sm-12"><div className="coursesTitle">{this.props.courseDetails.course.name}</div></div>
                     <div className="courseAdd">{this.props.courseDetails.course.address1}</div>
            <div className="col-sm-3">
                <button onClick={this.OnUnfollow.bind(this)} className="btn_followCourse">
                {(_.size(this.props.courseDetails)>0 && this.props.courseDetails.course_user_details.is_following)?'Unfollow Course':'Follow Course'}</button>
            </div>
            <div className="col-sm-6 mt5pc txtcenter mt1pc">


                    
                   
          {/*<img src="/assets/img/nonPremBanner.jpg" className="nonPreBanner"/>*/}
               
               
            </div>
            <div className="col-sm-3 mt1pc">
                <span className="coursePhone">{this.props.courseDetails.course.phone}</span>
            </div>
            <div className="col-sm-12 map mt-100px  NonPremiumMap">
      <GoogleMap
        center={{lat: (_.size(this.props.courseDetails)>0)?this.props.courseDetails.course.lat:0, lng: (_.size(this.props.courseDetails)>0)?this.props.courseDetails.course.lon:0}}
         defaultZoom={14}>
                <Marker lat={(_.size(this.props.courseDetails)>0)?this.props.courseDetails.course.lat:0} lng={(_.size(this.props.courseDetails)>0)?this.props.courseDetails.course.lon:0}/>
      </GoogleMap>
      </div>
      <div className="mt30pc">
      <button className="upgradeToPremium" data-toggle="modal" data-target="#myModal">Upgrade to Premium</button>
       <div className="modal fade" id="myModal" role="dialog">
    <div className="modal-dialog wd100pc">
      <div className="modal-content">
        <div className="modal-header bgWhiteBrdr">
          <button type="button" className="close" data-dismiss="modal">&times;</button>
          <span className="modal-title nonPrem">Have your course upgrade and become a premium course</span>
        </div>
        <div className="modal-body">
          <p className="fnt22px">Have your course contact Golf Connectx by sending an email to <a href={"mailto:" + this.props.courseDetails.course.email}>{this.props.courseDetails.course.email}</a> to get more information.</p>
          <center className="FtrBnfit">Features and Benefits</center>
          <ul className="featureList">
          <li className="fnt20px clr44b54a"><span className="fnt20px clrBlack">Ability to customize your content and photos.</span></li>
          <li className="fnt20px clr44b54a"><span className="fnt20px clrBlack">Ability to organize and manage groups that play outof your course  + Men's, Women's, Jr's Sr's, etc ALL ON ONE PAGE.</span></li>
          <li className="fnt20px clr44b54a"><span className="fnt20px clrBlack">Ability to organize and manage course events includingcharity, corporate, member member, member guest, etc ALL ON ONE PAGE.</span></li>
          <li className="fnt20px clr44b54a"><span className="fnt20px clrBlack">Premier page Ads to generate income.</span></li>
          <li className="fnt20px clr44b54a"><span className="fnt20px clrBlack">See GolfConnectx users and get reports for users who follow your course and have your course as a favorite.</span></li>
          <li className="fnt20px clr44b54a"><span className="fnt20px clrBlack">Have access to View all the groups and events that select your course as home course or event course.</span></li>
          </ul>
        </div>
        <div className="modal-footer">
          <button type="button" className="ModalClose" data-dismiss="modal">CLOSE</button>
        </div>
      </div>
    </div>
  </div></div>
        </div>):(<div></div>))}</div>
    
    );
    }
}

export default NonPremiumCourse;
