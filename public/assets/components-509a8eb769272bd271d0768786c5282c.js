var EmailSignupForm=React.createClass({displayName:"EmailSignupForm",getInitialState:function(){return{login:!1,visible:this.props.visible,error:this.props.error}},componentWillReceiveProps:function(t){t.visible===!1&&(this.refs.email.getDOMNode().value="",this.refs.password.getDOMNode().value="",this.refs.passwordConfirmation.getDOMNode().value=""),this.setState({login:t.login,visible:t.visible,error:t.error})},handleEmailSubmit:function(t){t.preventDefault();var e={email:this.refs.email.getDOMNode().value.trim(),password:this.refs.password.getDOMNode().value.trim()};this.state.login?SessionActions.emailLogin(e):(e.password_confirmation=this.refs.passwordConfirmation.getDOMNode().value.trim(),SessionActions.createUserWithEmail(e))},toggleLogin:function(){this.props.toggleLoginHandler(),this.setState({login:!this.state.login,error:!1})},visiblityClass:function(){return this.state.visible?"":"hidden"},loginClass:function(){return this.state.login?"":"hidden"},signupClass:function(){return this.state.login?"hidden":""},submitCTA:function(){return this.state.login?"Login":"Signup"},errorMessage:function(){return this.state.error?this.state.login?["Whoops! Login info doesn't match a Scribble user. Create Account instead?"]:SessionStore.userErrors():[]},toggleSocial:function(){this.props.toggleHandler()},render:function(){return React.DOM.div({className:"email-signup-form-component "+this.visiblityClass()},React.DOM.form({id:"email-signup-form",onSubmit:this.handleEmailSubmit},React.DOM.input({ref:"email",type:"email",id:"user_email",name:"user[email]",placeholder:"email"}),React.DOM.input({ref:"password",type:"password",id:"user_password",name:"user[password]",placeholder:"password"}),React.DOM.input({ref:"passwordConfirmation",className:this.signupClass(),type:"password",id:"user_password_confirmation",name:"user[password_confirmation]",placeholder:"password one more time"}),React.DOM.button({className:"large button",type:"submit",id:"email-form-submit"},this.submitCTA())),React.DOM.p({className:"signup-login-toggle "+this.signupClass()},"Already have an account? ",React.DOM.span({className:"clickable email-login-toggler",onClick:this.toggleLogin},"Login")),React.DOM.p({className:"signup-login-toggle "+this.loginClass()},"New to these parts? ",React.DOM.span({className:"clickable email-login-toggler",onClick:this.toggleLogin},"Signup")),React.DOM.p({className:"clickable email-form-toggle",onClick:this.toggleSocial},"or connect with Facebook or Google"))}}),FlashComponent=React.createClass({displayName:"FlashComponent",getInitialState:function(){return{type:this.props.type,messages:this.props.messages,visible:this.props.visible}},componentWillReceiveProps:function(t){this.setState({type:t.type,messages:t.messages,visible:t.visible})},getClasses:function(){var t=this.state.type;return this.state.visible||(t+=" hidden"),t},render:function(){var t=this.state.messages.map(function(t){return React.DOM.li(null,t)});return React.DOM.div({id:"flash-component",className:this.getClasses()},React.DOM.ul(null,t))}}),Janus=React.createClass({displayName:"Janus",getInitialState:function(){return this.props},componentDidMount:function(){AnalyticsActions.trackAuthStart(this.props.referringAction)},render:function(){return React.DOM.div({className:"janus-component"},LoginForm({subHeader:"Signup to "+this.state.referringAction}))}}),LoginForm=React.createClass({displayName:"LoginForm",getInitialState:function(){return null==this.props.header&&(this.props.header="Quick!"),null==this.props.subHeader&&(this.props.subHeader="Signup to post."),{emailSignup:!1,error:!1,header:this.props.header,login:!1,subHeader:this.props.subHeader,username:!1}},toggleEmailForm:function(){this.setState({emailSignup:!this.state.emailSignup,error:!1})},toggleLogin:function(){this.setState({login:!this.state.login})},getUsername:function(){this.setState({error:!1,header:"Last step!",subHeader:"Pick your username.",username:!0})},componentDidMount:function(){SessionStore.addChangeListener(this._onChange)},componentWillUnmount:function(){SessionStore.removeChangeListener(this._onChange)},render:function(){return React.DOM.div({className:"login-form-component"},React.DOM.div({id:"login-header"},React.DOM.h2({className:"header"},this.state.header),React.DOM.h4({className:"subheader"},this.state.subHeader)),UsernameInput({visible:this.state.username,error:this.state.error}),SocialConnectButtons({visible:!this.state.emailSignup&&!this.state.username,toggleHandler:this.toggleEmailForm}),EmailSignupForm({visible:this.state.emailSignup&&!this.state.username,toggleHandler:this.toggleEmailForm,toggleLoginHandler:this.toggleLogin,error:this.state.error,login:this.state.login}),React.DOM.p({className:"privacy-policy"},"we hate spam too - check out our rock solid\xa0",React.DOM.a({target:"_blank",href:scribble.helpers.routes.privacy_policy_url()},"privacy policy")))},_onChange:function(){user=SessionStore.currentUser(),user&&user.id?null==user.username&&this.getUsername():this.setState({emailSignup:this.state.emailSignup,error:!0})}}),SocialConnectButtons=React.createClass({displayName:"SocialConnectButtons",getInitialState:function(){return{visible:this.props.visible}},componentWillReceiveProps:function(t){this.setState({visible:t.visible})},handleFbLogin:function(t){t.preventDefault(),SessionActions.fbLogin()},handleGoogleLogin:function(t){t.preventDefault(),SessionActions.googleLogin()},visibilityClass:function(){return this.state.visible?"":"hidden"},render:function(){return React.DOM.div({className:"social-connect-buttons-component "+this.visibilityClass()},React.DOM.button({id:"fb-login",className:"fb-login button large",onClick:this.handleFbLogin},React.DOM.i({className:"ion-social-facebook"})," Connect With Facebook"),React.DOM.button({id:"google-login",className:"google-login button large",onClick:this.handleGoogleLogin},React.DOM.i({className:"ion-social-google"})," Connect With Google"),React.DOM.p({ref:"emailSignupLink",className:"clickable email-form-toggle",onClick:this.props.toggleHandler},"or signup with email"))}}),UsernameInput=React.createClass({displayName:"UsernameInput",getInitialState:function(){return{visible:this.props.visible,errors:this.props.error}},componentWillReceiveProps:function(t){this.setState({visible:t.visible})},visibilityClass:function(){return this.state.visible?"":"hidden"},errorMessage:function(){return this.state.error?SessionStore.userErrors():[]},submitUsername:function(t){t.preventDefault(),SessionActions.updateCurrentUser({username:this.refs.username.getDOMNode().value.trim()})},render:function(){return React.DOM.form({id:"username-select-component",className:this.visibilityClass(),onSubmit:this.submitUsername},React.DOM.input({name:"user[username]",id:"user_username",ref:"username",type:"text",placeholder:"pick your username"}),React.DOM.button({type:"submit",className:"large button"},"Finish"))}}),AnnotationPage=React.createClass({displayName:"AnnotationPage",getInitialState:function(){return this.props.server_rendered&&AppActions.initializeData({annotations:[this.props.annotation],comments:this.props.comments}),this.props},componentDidMount:function(){AnalyticsActions.trackAnnotationView(this.state.annotation,this.state.comments.length)},commentList:function(){return CommentList({comments:this.state.comments,annotationId:this.props.annotation.id})},header:function(){return this.refs.header.getDOMNode()},submitHandler:function(t){CommentActions.createComment({annotation_id:this.props.annotation.id,comment:{raw_content:t}})},render:function(){return React.DOM.div({className:"annotation-page-component"},React.DOM.h1({ref:"header"},React.DOM.img({src:this.props.logo})),FormVisibilityWrapper({commentList:this.commentList(),submitHandler:this.submitHandler,headerGetter:this.header,type:"comment"}))}}),AtMentionDropdown=React.createClass({displayName:"AtMentionDropdown",getInitialState:function(){var t=this.props.text.substring(1).trim();return{text:t,contentNode:this.props.contentNode}},componentDidMount:function(){UserStore.addChangeListener(this._onChange),this.debouncedFetchUser=scribble.helpers.utility.debounce(this._fetchUser,300),this._fetchUser(this.state.text),this.setPosition(),this.refs.component.getDOMNode().style.visibility="visible"},componentDidUpdate:function(){this.setPosition()},componentWillUnmount:function(){UserStore.removeChangeListener(this._onChange)},componentWillReceiveProps:function(t){var e=t.text.substring(1);e!==this.state.text&&(this.debouncedFetchUser(e),this.setState({text:e}))},completeMention:function(t){this.props.atMentionHandler(t.target.innerText)},setPosition:function(){var t=this.refs.component.getDOMNode(),e=(new TextareaCaretPositionService).get(this.state.contentNode,this.state.contentNode.selectionEnd),i=parseInt(getComputedStyle(this.state.contentNode).lineHeight)||0;t.style.top=e.top+t.clientHeight+i>window.innerHeight?e.top-t.clientHeight-i+"px":e.top+i+"px"},userListItems:function(){var t=this;return this.state.users&&this.state.users.length>0?this.state.users.map(function(e){return React.DOM.li({key:e.id,onClick:t.completeMention},"@"+e.username)}):this.state.text?this.state.users?React.DOM.li({className:"empty"},"No users found :("):React.DOM.li({className:"empty"},"searching..."):null},render:function(){return React.DOM.div({ref:"component",className:"at-mention-dropdown-component"},React.DOM.ul(null,this.userListItems()))},_onChange:function(){this.setState({users:UserStore.atMentionUsers()})},_fetchUser:function(t){var e=this;t&&t.trim()&&UserActions.fetchNameMatches(t.trim(),function(t){e.setState({users:t})})}}),Comment=React.createClass({displayName:"Comment",mixins:[React.addons.PureRenderMixin],getInitialState:function(){return{content:this.props.comment.content,replyCount:this.props.comment.reply_count,score:this.props.comment.score,userVote:this.props.comment.current_user_vote}},componentDidMount:function(){CommentStore.addChangeListener(this._onChange)},componentWillUnmount:function(){CommentStore.removeChangeListener(this._onChange)},replyButtonText:function(){return 0===this.state.replyCount?"reply":"view replies ( "+this.state.replyCount+" )"},typeClass:function(t){switch(t){case"comment-header":return" comment-header";case"reply":return" reply"}return""},viewReplies:function(t){t.stopPropagation(),0===this.state.replyCount?CommentActions.newReply(this.props.comment.id):CommentActions.showReplies(this.props.comment.id)},votingBooth:function(){return"reply"!==this.props.type?VotingBooth({score:this.state.score,userVote:this.state.userVote,commentId:this.props.comment.id}):void 0},render:function(){return React.DOM.div({className:"comment-component"+this.typeClass(this.props.type),"data-key":this.props.key},React.DOM.div({className:"row"},React.DOM.div({className:"small-12 column"},this.votingBooth(),React.DOM.div({className:"avatar-wrapper"}),React.DOM.h6({className:"author"},this.props.comment.author.username,"\xa0\xa0\xa0",React.DOM.div({className:"user-rating"},React.DOM.i({className:"ion-bookmark"}),"\xa0",this.props.comment.author.simple_score)))),React.DOM.div({className:"row"},React.DOM.div({className:"small-12 column content",dangerouslySetInnerHTML:{__html:this.state.content}})),React.DOM.div({className:"comment-actions row"},React.DOM.div({className:"small-12 column"},React.DOM.div({ref:"viewReplies",className:"button",onClick:this.viewReplies},this.replyButtonText()))))},_onChange:function(){var t=CommentStore.getById(this.props.comment.id);this.setState({content:t.content,replyCount:t.reply_count,score:t.score,userVote:t.current_user_vote})}}),CommentForm=React.createClass({displayName:"CommentForm",getInitialState:function(){return{visibility:this.props.visibilityStates.open,fixed:!1,firstRender:!0,submitted:!1,text:""}},componentDidMount:function(){var t=this;document.body.onmousedown=function(e){t.mouseDownE=e},document.body.onmouseup=function(){t.mouseDownE=null},CommentStore.addChangeListener(this._onChange),this.setState(this.initialMountedState())},componentWillUnmount:function(){CommentStore.removeChangeListener(this._onChange)},initialMountedState:function(){var t={firstRender:!1};return this._shouldSetFixed()&&(t.fixed=!0),t.visibility=this.props.initialState?this.props.visibilityStates[this.props.initialState]:this._shouldSetFixed()?this.props.visibilityStates.collapsed:this.props.visibilityStates.open,t},reset:function(){var t={submitted:!1,text:"",atMention:null};this.refs.content.getDOMNode().blur(),this.state.fixed||this._shouldSetFixed()?(t.fixed=!0,t.visibility=this.props.visibilityStates.collapsed):t.visibility=this.props.visibilityStates.open,this.setState(t),this.props.visibilityHandler(this.state.visibility)},atMentionSelect:function(t){var e=this.refs.content.getDOMNode(),i=e.value,s=this.getCurrentWordStartPos(e),n=i.substring(0,s),o=i.substring(s);o=o.replace(/^([^\s$]*)/,t+" "),this.setState({text:n+o,atMention:null}),e.focus()},maybeSetHeight:function(){if(this.state.visibility!==this.props.visibilityStates.expanded)return{};var t,e,i,s=this.props.headerGetter(),n=10,o=25;return t=s.offsetTop+s.clientHeight,e=2*this.refs.lowerActions.getDOMNode().clientHeight,i=window.innerHeight-t-e-n-o,{height:i+"px"}},setOpen:function(){this.state.visibility===this.props.visibilityStates.collapsed&&(this.setState({visibility:this.props.visibilityStates.open}),this.props.visibilityHandler(this.props.visibilityStates.open))},setCollapse:function(){this.mouseDownE&&this.mouseDownE.target.className.match(/button/)||this.state.fixed&&this.state.visibility===this.props.visibilityStates.open&&!this.refs.content.getDOMNode().value.trim()&&(this.setState({visibility:this.props.visibilityStates.collapsed,text:""}),this.props.visibilityHandler(this.props.visibilityStates.collapsed))},getCurrentWordStartPos:function(t){for(var e=t.selectionStart,i=t.value;e>0&&!i[e-1].match(/\s/);)e--;return e},getWordAtCursor:function(){var t,e=this.refs.content.getDOMNode(),i=e.value,s=this.getCurrentWordStartPos(e);return i=i.substring(s),t=i.match(/^([^\s$]*)/),t?t[0]:null},setStateText:function(){var t=this.getWordAtCursor();this.setState({text:this.refs.content.getDOMNode().value,atMention:t&&t.match(/^@/)?t:null})},submitHandler:function(t){t.preventDefault(),this.setState({submitted:!0,atMention:null}),this.props.submitHandler(this.state.text.trim())},toggleExpand:function(t){t.preventDefault();var e=this.state.visibility===this.props.visibilityStates.expanded?this.props.visibilityStates.open:this.props.visibilityStates.expanded;this.refs.content.getDOMNode().focus(),this.props.visibilityHandler(e),this.setState({visibility:e})},atMentionDropdown:function(){return this.state.atMention&&this.state.atMention.length>1?AtMentionDropdown({text:this.state.atMention,contentNode:this.refs.content.getDOMNode(),atMentionHandler:this.atMentionSelect}):void 0},expandBtnText:function(){return this.state.visibility===this.props.visibilityStates.expanded?"Collapse Field":"Expand Field"},textAreaPlaceholder:function(){var t;return t="reply"===this.props.type?"Add reply here":"Add annotation here",this.state.visibility===this.props.visibilityStates.expanded&&(t+=". You can use markdown, if you like."),t},visibilityClasses:function(){if(this.state.firstRender)return" invisible";var t="";switch(this.state.fixed&&(t+=" fixed"),this.state.visibility){case this.props.visibilityStates.collapsed:t+=" collapsed";break;case this.props.visibilityStates.expanded:t+=" expanded"}return t},render:function(){return React.DOM.form({ref:"component",className:"comment-form-component"+this.visibilityClasses(),onSubmit:this.submitHandler},React.DOM.div({className:"actions top-actions"},React.DOM.button({className:"button alt-button",onClick:this.toggleExpand},this.expandBtnText()),React.DOM.input({type:"submit",className:"button"})),React.DOM.textarea({ref:"content",placeholder:this.textAreaPlaceholder(),id:"comment_content",onFocus:this.setOpen,style:this.maybeSetHeight(),onBlur:this.setCollapse,onChange:this.setStateText,value:this.state.text}),this.atMentionDropdown(),React.DOM.div({ref:"lowerActions",className:"actions"},React.DOM.button({className:"button alt-button",onClick:this.toggleExpand},this.expandBtnText()),React.DOM.input({type:"submit",className:"button"})))},_onChange:function(){!CommentStore.getPending()&&this.state.submitted&&this.reset()},_shouldSetFixed:function(){var t=this.refs.component.getDOMNode().getBoundingClientRect();return t.bottom>window.innerHeight}}),CommentList=React.createClass({displayName:"CommentList",mixins:[CommentListMixin],getInitialState:function(){return{comments:CommentStore.sortByRating(this.props.comments)}},render:function(){return React.DOM.div({className:"comment-list-component"},this.collectComments(this.state.comments,"comment"))},_onChange:function(){var t,e=CommentStore.getByAnnotationAsList(this.props.annotationId);t=this.getNewComment(this.state.comments,e),t&&this.setState({comments:CommentStore.sortByRating(e),newComment:t})}}),CommentPage=React.createClass({displayName:"CommentPage",getInitialState:function(){return this.props.server_rendered&&AppActions.initializeData({comments:this.props.replies.concat([this.props.comment])}),this.props},componentDidMount:function(){AnalyticsActions.trackViewReplies(this.props.comment),this.props.reply_id&&this.scrollToReply(this.props.reply_id)},replyList:function(){return ReplyList({comment:this.state.comment,replies:this.state.replies})},header:function(){return this.refs.header.getDOMNode()},scrollToReply:function(t){var e=document.querySelector('.comment-component[data-key="'+t+'"]');e.scrollIntoViewIfNeeded()},submitHandler:function(t){CommentActions.createReply({comment_id:this.props.comment.id,reply:{raw_content:t}})},render:function(){return React.DOM.div({className:"comment-page-component"},React.DOM.nav({ref:"header"},React.DOM.a({href:scribble.helpers.routes.annotation_path(this.props.comment.annotation_id)},"<< Back")),FormVisibilityWrapper({commentList:this.replyList(),submitHandler:this.submitHandler,headerGetter:this.header,visibility:this.props.formVisibility,type:"reply"}))}}),FormVisibilityWrapper=React.createClass({displayName:"FormVisibilityWrapper",formVisibilityStates:{collapsed:"collapsed",open:"open",expanded:"expanded"},getInitialState:function(){var t=this.props;return t.formVisibility=this.props.visibility?this.formVisibilityStates[this.props.visibility]:this.formVisibilityStates.collapsed,t},commentList:function(){return this.state.commentList?this.state.commentList:void 0},commentListVisClass:function(){return this.state.formVisibility===this.formVisibilityStates.expanded?" hidden":""},visibilityHandler:function(t){this.setState({formVisibility:t})},formVisibilityClass:function(){switch(this.state.formVisibility){case this.formVisibilityStates.open:return" form-open";case this.formVisibilityStates.expanded:return" form-expanded";case this.formVisibilityStates.collapsed:return" form-collapsed";default:return""}},render:function(){return React.DOM.div({className:"form-visibility-wrapper-component"+this.formVisibilityClass()},React.DOM.div({className:"comment-list-wrapper"+this.commentListVisClass()},this.state.commentList),CommentForm({submitHandler:this.props.submitHandler,headerGetter:this.props.headerGetter,visibilityHandler:this.visibilityHandler,visibilityStates:this.formVisibilityStates,initialState:this.props.visibility,type:this.props.type}))}}),NewAnnotationPage=React.createClass({displayName:"NewAnnotationPage",componentDidMount:function(){AnalyticsActions.trackStartAnnotation(this.props.url,this.props.text.length)},header:function(){return this.refs.header.getDOMNode()},submitHandler:function(t){AnnotationActions.createWithComment({annotation:{text:this.props.text},url:this.props.url,comment:{raw_content:t}})},render:function(){return React.DOM.div({className:"annotation-page-component"},React.DOM.h1({ref:"header"},React.DOM.img({src:this.props.logo})),FormVisibilityWrapper({submitHandler:this.submitHandler,headerGetter:this.header,visibility:"expanded",type:"comment"}))}}),ReplyList=React.createClass({displayName:"ReplyList",mixins:[CommentListMixin],getInitialState:function(){return{comment:this.props.comment,replies:this.props.replies}},render:function(){return React.DOM.div({className:"comment-list-component"},Comment({comment:this.state.comment,key:this.state.comment.id,type:"comment-header"}),this.collectComments(this.state.replies,"reply"))},_onChange:function(){var t,e=CommentStore.getReplies(this.props.comment.id);t=this.getNewComment(this.state.replies,e),t&&this.setState({comment:CommentStore.getById(this.props.comment.id),replies:e,newComment:t})}}),VotingBooth=React.createClass({displayName:"VotingBooth",getInitialState:function(){return{score:this.props.score,userVote:this.props.userVote}},componentWillReceiveProps:function(t){return this.setState({score:t.score,userVote:t.userVote})},upVote:function(t){return t.stopPropagation(),"up"!==this.state.userVote?this.vote(!0):void 0},downVote:function(t){return t.stopPropagation(),"down"!==this.state.userVote?this.vote(!1):void 0},vote:function(t){return CommentActions.vote({id:this.props.commentId,positive:t})},voteClassName:function(t){var e="vote "+t+"-vote";return t===this.state.userVote?e+" active":e},render:function(){return React.DOM.div({className:"voting-booth-component"},React.DOM.div({ref:"upVote",className:this.voteClassName("up"),onClick:this.upVote},React.DOM.i({className:"ion-ios-play"})),React.DOM.p({ref:"voteCount",className:"vote-count"},this.state.score),React.DOM.div({ref:"downVote",className:this.voteClassName("down"),onClick:this.downVote},React.DOM.i({className:"ion-ios-play"})))}}),Corkboard=React.createClass({displayName:"Corkboard",getInitialState:function(){return this.props.server_rendered&&AppActions.initializeData({notifications:this.props.notifications}),{notifications:this.props.notifications}},logout:function(){SessionActions.logout()},render:function(){return React.DOM.div({className:"corkboard-component"},React.DOM.div({className:"logout-button",onClick:this.logout},"sign out"),NotificationList({notifications:this.state.notifications}))}}),Intro=React.createClass({displayName:"Intro",getInitialState:function(){return{firstRender:!0}},componentDidMount:function(){var t=this;setTimeout(function(){t.setState({firstRender:!1})},0)},visClass:function(){return this.state.firstRender?" hide-me":""},triggerLogin:function(){SessionActions.requestLogin()},render:function(){return React.DOM.div({className:"intro-component"},React.DOM.h4(null,"Welcome to Scribble"),React.DOM.button({ref:"signup",className:"large button"+this.visClass(),onClick:this.triggerLogin},"Sign In"),React.DOM.p({className:this.visClass()},React.DOM.strong(null,"To annotate a page"),", highlight some text, and click the \xa0",React.DOM.img({src:this.props.pencil_image_path,height:"18",width:"18"})," in the bottom right corner of your screen."),React.DOM.p({className:this.visClass()},React.DOM.strong(null,"To read others' annotations"),", click on the purple highlighted text, you see around the web."))}}),Notification=React.createClass({displayName:"Notification",getInitialState:function(){return{url:this.props.notification.url,message:this.props.notification.message,read:this.props.notification.read}},toggleRead:function(){NotificationActions.toggleRead(this.props.notification.id),this.setState({read:!this.state.read})},readAndNavigate:function(t){t.preventDefault(),this.state.read||this.toggleRead(),window.open(t.currentTarget.href,"_blank")},readClass:function(){return this.state.read?" read":""},readTip:function(){return"Mark as "+(this.state.read?"unread":"read")},render:function(){return React.DOM.li({className:"notification-component"+this.readClass(),"data-key":this.props.notification.id},React.DOM.a({href:this.state.url,target:"_blank",onClick:this.readAndNavigate},React.DOM.p({dangerouslySetInnerHTML:{__html:this.state.message}}),"View More"),React.DOM.div({className:"icon-wrapper","data-tip":this.readTip()},React.DOM.i({className:"ion-ios-circle-filled",onClick:this.toggleRead})))}}),NotificationList=React.createClass({displayName:"NotificationList",getInitialState:function(){return{notifications:this.props.notifications}},collectNotifications:function(){return this.state.notifications.length>0?this.state.notifications.map(function(t){return Notification({notification:t,key:"notification_"+t.id})}):React.DOM.h5({style:{margin:"10px"}},"Huh. No notifications right now.")},render:function(){return React.DOM.div({className:"notification-list-component"},React.DOM.header(null,React.DOM.h6({className:"title"},"Notifications")),React.DOM.ul(null,this.collectNotifications()))}});