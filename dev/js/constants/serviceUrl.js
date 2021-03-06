let devUrl = 'http://52.45.249.118:8080/';   ///'http://192.168.0.120:8000/'52.45.249.118:8080;
///let devUrl = 'http://192.168.0.101:8000/';


export const SERVICE_URLS ={
    LOGIN_API : devUrl + 'api/user/login',
    REGISTER_API:devUrl + 'api/user/signup',
    EVENTLIST_API: devUrl + 'api/events/upcoming/?format=json',
    EVENTLISTPAST_API: devUrl +  'api/events/past/?format=json',
    CREATEEVENT_API: devUrl +  'api/events/create/',
    GETGROUPS_API: devUrl +  'api/groups/?format=json',
    ACCOUNTS_API: devUrl +  'api/account-settings/profile/?format=json',
    SAVEPROFILE_API: devUrl + 'api/account-settings/profile/?format=json',
    GETCOURSE_API: devUrl +  'api/courses/old/?format=json',
    ADDGROUP_API: devUrl +  'api/groups/create/?format=json',
    PRIVATEACCOUNT_API: devUrl +  'api/account-settings/private/?format=json',
    EDITEVENT_API: devUrl +  'api/events/',
    ACCOUNTS_SETTING_PROFILE: devUrl +  'api/account-settings/profile/',
    ACCOUNTS_SETTING_PRIVATE: devUrl +  'api/account-settings/private/',
    ACCOUNTS_SETTING_NOTIFICATION: devUrl +  'api/account-settings/notification/',
    ACCOUNTS_SETTING_EMAIL: devUrl +  'api/account-settings/email/',
    GET_COURSE_OBJECT: devUrl +  'api/courses/',
    LOGOUT_API: devUrl +  'api/user/logout/',
    SEARCH_COURSES: devUrl +  'api/courses/old/',
    COURSE_UNFOLLOW: devUrl +  'api/courses/',
    COURSE_FOLLOW: devUrl +  'api/courses/',
    CREATE_POST_API: devUrl + 'api/posts/create/?format=json',
    GET_PROFILE_COURSES: devUrl +  'api/profile/courses',
    GET_PROFILE_POSTS: devUrl +  'api/profile/posts',
    GET_EVENT_OBJECT: devUrl +  'api/events/',
    GET_PROFILE_DETAILS: devUrl +  'api/profile/?format=json',
    GET_GOLF_MEMBERS: devUrl +  'api/directory',
    SEND_FRIEND_NOTIFICATION: devUrl +  'api/directory/',
    GET_PROFILE_FRIENDS: devUrl +  'api/profile/friends/',
    SEARCH_FRIENDS: devUrl +  'api/profile/friends/search/',
    GET_SELECTED_PROFILE: devUrl + 'api/directory/',
    GET_NOTIFICATION_COUNT: devUrl +  'api/notifications/count/?format=json',
    GET_NOTIFICATIONS: devUrl +   'api/notifications/?format=json',
    GET_NOTIFICATION_OBJECT: devUrl +  'api/notifications/',
    GETGROUP_DETAILS: devUrl + 'api/groups/',
    CREATE_GROUP_API: devUrl + 'api/groups/create/?format=json',
    EDIT_GROUP_API:devUrl + 'api/groups/edit/',
    GET_GROUP_MEMBERS_LIST:devUrl + 'api/groups/',
    SEARCH_GROUP_MEMBERS:devUrl +  'api/groups/',
    SEARCH_ADD_MEMBERS:devUrl+'api/groups/',
    GET_GROUP_POSTS_LIST: devUrl + 'api/groups/',
    ADD_GROUP_NEW_POST: devUrl +  'api/groups/',
    SEARCH_GROUPS: devUrl + 'api/profile/groups/search/',
    GET_PROFILE_GROUPS:devUrl+ 'api/profile/groups/',
    ACCOUNT_SETTINGS: devUrl + 'api/account-settings/upload-user-profile-image/',
    INVITE: devUrl + 'api/user/invite/',
    GET_MESSAGES: devUrl + 'api/messages/',
    GET_GROUPS_NEW_LIST: devUrl + 'api/groups/new/',
    GET_POSTS:devUrl+'api/posts/',
    ADD_NEW_COMMENT: devUrl+ 'api/posts/',
    GET_FORUM_COURSE:devUrl+ 'api/forums/courses/',
    SEARCH_ALL: devUrl+ 'api/search/',
    DELETE_MULTIPLE_MESSAGES:devUrl+'api/messages/delete-conversations/',
    EDIT_NOTES:devUrl+'api/profile/courses/',
    FORUM_CONVERSATIONS:devUrl+'api/forums/courses/course/',
    LIKE_POST: devUrl + '/api/posts/',
    CONTACT_US:devUrl+ 'api/contact-us/',
    FORGOT_PASSWORD:devUrl+'api/user/forget-pwd/',
    ENTER_OTP:devUrl+'api/user/enter-otp/',
    ENTER_PASSWORD:devUrl+'api/user/change-password/',
    GOLFER_SKILLS:devUrl+'api/account-settings/golfer-skills/',
    FORUM_POST:devUrl+'api/forums/courses/course/',
    FORUM_COMMENT:devUrl+'api/forums/courses/course/',
    FORUM_SEARCH:devUrl+'api/forums/courses/course/',
    WATERCOOLER_ADD_CATEGORY:devUrl+'api/forums/water-cooler/add-category',
    WATERCOOLER_GET_CATEGORY:devUrl+'api/forums/water-cooler/',
    WATERCOOLER_CATEGORY_OBJECT:devUrl+'api/forums/water-cooler/category/',
    WATERCOOLER_ADD_POST:devUrl+'api/forums/water-cooler/category/',
    WATERCOOLER_DETAILS:devUrl+'api/forums/water-cooler/category/',
    CATEGORY_COMMENT:devUrl+'api/forums/water-cooler/category/',
    CATEGORY_POST_SEARCH:devUrl+'api/forums/water-cooler/category/',
    SEARCH_WATERCOOLER_CATEGORY:devUrl+'api/forums/water-cooler/search-category/',
    GET_19HOLE_LIST:devUrl+'api/forums/19th-hole',
    SEARCH_19HOLE_CATEGORY:devUrl+'api/forums/19th-hole/search-category/',
    GET_GETLOCAL_LIST:devUrl+'api/forums/get-local',
    NINETEENTHHOLE_ADD_CATEGORY:devUrl+'api/forums/19th-hole/add-category',
    NINETEENTHHOLE_CATEGORY_OBJECT:devUrl+'api/forums/19th-hole/category/',
    GET_19HOLE_DETAILS:devUrl+'api/forums/19th-hole/category/',
    ADD_19thHOLE_POST:devUrl+'api/forums/19th-hole/category/',
    CATEGORY19_POST_SEARCH:devUrl+'api/forums/19th-hole/category/',
    CATEGORY19_COMMENT:devUrl+'api/forums/19th-hole/category/',
    LOCAL_CATEGORY_OBJECT:devUrl+'api/forums/get-local/category/',
    LOCAL_DETAILS:devUrl+'api/forums/get-local/category/',
    LOCAL_ADD_CATEGORY:devUrl+'api/forums/get-local/add-category',
    LOCAL_ADD_POST:devUrl+'api/forums/get-local/category/',
    LOCAL_CATEGORY_COMMENT:devUrl+'api/forums/get-local/category/',
    LOCAL_CATEGORY_POST_SEARCH:devUrl+'api/forums/get-local/category/',
    SEARCH_LOCAL_CATEGORY:devUrl+'api/forums/get-local/search-category/',
    
    /*forum equipment */
    GET_EQUIPMENT_LIST:devUrl + 'api/forums/equipment',
    EQUIPMENT_CATEGORY_OBJECT:devUrl + 'api/forums/equipment/category/',
    EQUIPMENT_DETAILS:devUrl + 'api/forums/equipment/category/',
    EQUIPMENT_ADD_CATEGORY:devUrl+'api/forums/equipment/add-category',
    EQUIPMENT_ADD_POST:devUrl+'api/forums/equipment/category/',
    EQUIPMENT_CATEGORY_COMMENT:devUrl+'api/forums/equipment/category/',
    EQUIPMENT_CATEGORY_POST_SEARCH:devUrl+'api/forums/equipment/category/',
    SEARCH_EQUIPMENT_CATEGORY:devUrl+'api/forums/equipment/search-category/',
    /*forum travel */
    GET_GOLFTRAVEL_LIST:devUrl+'api/forums/golf-travel',
    GOLFTRAVEL_CATEGORY_OBJECT:devUrl+ 'api/forums/golf-travel/category/',
    GOLFTRAVEL_DETAILS:devUrl+'api/forums/golf-travel/category/',
    GOLFTRAVEL_ADD_CATEGORY:devUrl+'api/forums/golf-travel/add-category',
    GOLFTRAVEL_ADD_POST:devUrl+'api/forums/golf-travel/category/',
    GOLFTRAVEL_CATEGORY_COMMENT:devUrl+'api/forums/golf-travel/category/',
    GOLFTRAVEL_CATEGORY_POST_SEARCH:devUrl+'api/forums/golf-travel/category/',
    SEARCH_GOLF_CATEGORY:devUrl+'api/forums/golf-travel/search-category/',
    /*forum instruction */
    GET_INSTRUCTION_LIST:devUrl+'api/forums/instruction-playing-tips',
    INSTRUCTION_CATEGORY_OBJECT:devUrl+ 'api/forums/instruction-playing-tips/category/',
    INSTRUCTION_DETAILS:devUrl+'api/forums/instruction-playing-tips/category/',
    INSTRUCTION_ADD_CATEGORY:devUrl+'api/forums/instruction-playing-tips/add-category',
    INSTRUCTION_ADD_POST:devUrl+'api/forums/instruction-playing-tips/category/',
    INSTRUCTION_CATEGORY_COMMENT:devUrl+'api/forums/instruction-playing-tips/category/',
    INSTRUCTION_CATEGORY_POST_SEARCH:devUrl+'api/forums/instruction-playing-tips/category/',
    SEARCH_INSTRUCTION_CATEGORY:devUrl+'api/forums/instruction-playing-tips/search-category/',
    /*forum discussion */
    GET_DISCUSSION_LIST:devUrl+'api/forums/pro-am-discussion',
    DISCUSSION_CATEGORY_OBJECT:devUrl+ 'api/forums/pro-am-discussion/category/',
    DISCUSSION_DETAILS:devUrl+'api/forums/pro-am-discussion/category/',
    DISCUSSION_ADD_CATEGORY:devUrl+'api/forums/pro-am-discussion/add-category',
    DISCUSSION_ADD_POST:devUrl+'api/forums/pro-am-discussion/category/',
    DISCUSSION_CATEGORY_COMMENT:devUrl+'api/forums/pro-am-discussion/category/',
    DISCUSSION_CATEGORY_POST_SEARCH:devUrl+'api/forums/pro-am-discussion/category/',
    SEARCH_DISCUSSION_CATEGORY:devUrl+'api/forums/pro-am-discussion/search-category/',

    GET_RULES_LIST:devUrl+'api/forums/rules-golf-etiquette',
    RULES_CATEGORY_OBJECT:devUrl+ 'api/forums/rules-golf-etiquette/category/',
    RULES_DETAILS:devUrl+'api/forums/rules-golf-etiquette/category/',
    RULES_ADD_CATEGORY:devUrl+'api/forums/rules-golf-etiquette/add-category',
    RULES_ADD_POST:devUrl+'api/forums/rules-golf-etiquette/category/',
    RULES_CATEGORY_COMMENT:devUrl+'api/forums/rules-golf-etiquette/category/',
    RULES_CATEGORY_POST_SEARCH:devUrl+'api/forums/rules-golf-etiquette/category/',
    SEARCH_RULES_CATEGORY:devUrl+'api/forums/rules-golf-etiquette/search-category',

     GET_FITNESS_LIST:devUrl+'api/forums/fitness-and-excercise',
    FITNESS_CATEGORY_OBJECT:devUrl+ 'api/forums/fitness-and-excercise/category/',
    FITNESS_DETAILS:devUrl+'api/forums/fitness-and-excercise/category/',
    FITNESS_ADD_CATEGORY:devUrl+'api/forums/fitness-and-excercise/add-category',
    FITNESS_ADD_POST:devUrl+'api/forums/fitness-and-excercise/category/',
    FITNESS_CATEGORY_COMMENT:devUrl+'api/forums/fitness-and-excercise/category/',
    FITNESS_CATEGORY_POST_SEARCH:devUrl+'api/forums/fitness-and-excercise/category/',
    SEARCH_FITNESS_CATEGORY:devUrl+'api/forums/fitness-and-excercise/search-category/',
    ADD_SCORE:devUrl+'api/profile/courses/',
    GET_ATTENDEES:devUrl+'api/events/',
    EVENTLIST_GROUP:devUrl+'api/groups/',
    EVENTLIST_COURSE:devUrl+'api/courses/',
    EVENTLIST_COURSE_PAST:devUrl+'api/courses/',
    GET_COURSE_GROUPS_LIST:devUrl+'api/courses/',
    CALENDAR_EVENTS:devUrl+'api/events/calendar-list',
    REQUEST_FOR_GROUP:devUrl+'api/groups/',
    CALENDAR_DAY_EVENTS:devUrl+'api/events/calendar',
    SEND_REQUESTS:devUrl+'api/directory/send-friend-request'
	};
