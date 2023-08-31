/**
 * AgoraWebSDK_N-LiveVideo-2023/8/29 15:31:40 Copyright AgoraInc.
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("agora-rtc-sdk-ng")):"function"==typeof define&&define.amd?define(["exports","agora-rtc-sdk-ng"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).AgoraLiveVideo={},e.AgoraRTC)}(this,(function(e,t){"use strict";class i{_events=new Map;getListeners(e){const t=this._events.get(e);return Array.isArray(t)?t.map((e=>e.listener)):[]}on(e,t){let i=this._events.get(e);Array.isArray(i)||(i=[],this._events.set(e,i)),-1===this._indexOfListener(i,t)&&i.push({listener:t,once:!1})}addListener=this.on;once(e,t){let i=this._events.get(e);Array.isArray(i)||(i=[],this._events.set(e,i)),-1===this._indexOfListener(i,t)&&i.push({listener:t,once:!0})}off(e,t){const i=this._events.get(e);if(!Array.isArray(i))return;const s=this._indexOfListener(i,t);-1!==s&&i.splice(s,1),0===this._events.size&&this._events.delete(e)}removeAllListeners(e){if(!e)return this._events.clear();this._events.delete(e)}emit(e,...t){const i=this._events.get(e);Array.isArray(i)&&i.forEach((i=>{i.once&&this.off(e,i.listener),i.listener.apply(this,t||[])}))}safeEmit(e,...t){const i=this._events.get(e);Array.isArray(i)&&i.forEach((i=>{i.once&&this.off(e,i.listener);try{i.listener.apply(this,t||[])}catch(t){console.error(`safeEmit event:${e} error ${t?.toString()}`)}}))}_indexOfListener(e,t){return e.findIndex((e=>e.listener===t))}}const s=()=>{};function a(){const e={promise:void 0,isResolved:!1,isRejected:!1,isFinished:!1,resolve:void 0,reject:void 0,cancel:s};return e.promise=new Promise(((t,i)=>{e.resolve=i=>{e.isFinished||(e.isResolved=!0,e.isFinished=!0,t(i),e.value=i)},e.reject=t=>{e.isFinished||(e.isRejected=!0,e.isFinished=!0,i(t))}})),e}function o(e){const t=a();return t.resolve(e),t}var h,r,n,d,l;e.LiveVideoEvent=void 0,(h=e.LiveVideoEvent||(e.LiveVideoEvent={})).AUTOPLAY_PREVENTED="autoplay_was_prevented",h.STATE_CHANGED="state_changed",h.VIDEO_STATE_CHANGED="video_state_changed",h.AUDIO_STATE_CHANGED="audio_state_changed",h.HOST_CHANGED="host_changed",h.USER_STATE_CHANGED="user_state_changed",h.ERROR="error",e.LiveVideoState=void 0,(r=e.LiveVideoState||(e.LiveVideoState={})).CREATING="creating",r.CREATED="created",r.CONNECTING="connecting",r.CONNECTED="connected",r.CONNECT_FAILED="connect-failed",r.DESTROYED="destroyed",e.UserState=void 0,(n=e.UserState||(e.UserState={})).JOINED="joined",n.LEFT="left",n.UNPUBLISHED="unpublished",n.PUBLISHED="published",e.MediaState=void 0,(d=e.MediaState||(e.MediaState={})).PLAYING="playing",d.PAUSED="paused",d.STOPPED="stopped",d.EMPTY="empty";class c extends i{client;host;options;element;state=e.LiveVideoState.CREATING;videoState=e.MediaState.EMPTY;audioState=e.MediaState.EMPTY;pendingRemoteUsers=[];videoTrack;audioTrack;audioDefer;videoDefer;constructor(e){super(),this.options=e,this.create(),t.onAutoplayFailed=this.onAutoplayFailed}onAutoplayFailed=()=>{this.safeEmit(e.LiveVideoEvent.AUTOPLAY_PREVENTED)};setState(t){this.state!==t&&(this.state=t,this.safeEmit(e.LiveVideoEvent.STATE_CHANGED,t))}setVideoState(t){this.videoState!==t&&(this.videoState=t,this.safeEmit(e.LiveVideoEvent.VIDEO_STATE_CHANGED,t))}setAudioState(t){this.audioState!==t&&(this.audioState=t,this.safeEmit(e.LiveVideoEvent.AUDIO_STATE_CHANGED,t))}createElement(e,t,i,s){if(this.element="string"==typeof e?document.getElementById(e):e||document.createElement("video"),!this.element||"VIDEO"!==this.element.tagName)throw new Error(`Cannot get video element by id: ${e}`);t&&(this.element.style.width=`${t}px`),i&&(this.element.style.height=`${i}px`),s&&(this.element.style.aspectRatio=`${s}`)}async join(){this.setState(e.LiveVideoState.CONNECTING);const t=function(e){const t=/([^\/\?&]+)=([^\/\?&]+)/g,[,i,s,a,o]=Array.from(e.match(/^rte:\/\/([^\/]+)\/([^\/]+)\/([^\/\?]+)(\?[^\/\?]+)?/)||[]),h={appid:i,appname:s,steamname:a,token:null,uid:null};let r=[];for(;(r=Array.from(t.exec(o)||[])).length>0;)"token"===r[1]&&(h[r[1]]=r[2]),"uid"===r[1]&&(h[r[1]]=Number(r[2])||r[2]);return"null"===h.token&&(h.token=null),"null"===h.uid&&(h.uid=null),h}(this.options.url);try{await this.client.join(t.appid,`${t.appname}|${t.steamname}`,t.token,t.uid),this.setState(e.LiveVideoState.CONNECTED)}catch(t){this.setState(e.LiveVideoState.CONNECT_FAILED)}return this.state===e.LiveVideoState.CONNECTED&&this.bindEvents(),this.state===e.LiveVideoState.CONNECTED}reset(t){this.audioDefer&&!this.audioDefer.isFinished&&(this.audioDefer.reject(t),this.audioDefer=void 0),this.videoDefer&&!this.videoDefer.isFinished&&(this.videoDefer.reject(t),this.videoDefer=void 0),this.videoTrack&&(this.videoTrack.stop(),this.videoTrack=void 0,this.host&&this.client.unsubscribe(this.host,"video"),this.setVideoState(e.MediaState.EMPTY)),this.audioTrack&&(this.audioTrack.stop(),this.audioTrack=void 0,this.host&&this.client.unsubscribe(this.host,"audio"),this.setAudioState(e.MediaState.EMPTY)),this.host=void 0,this.pendingRemoteUsers=[],this.unbindEvent()}async recreate(){return this.reset("switch url"),this.client&&this.client.leave(),this.create()}async playAudio(){if(this.host&&!this.host.hasAudio&&(this.audioDefer&&!this.audioDefer.isFinished||(this.audioDefer=a()),await this.audioDefer.promise),!this.host)return;const t=await this.client.subscribe(this.host,"audio");this.audioTrack=t,this.audioTrack.play(),this.setAudioState(e.MediaState.PLAYING)}async playVideo(){if(this.host&&!this.host.hasVideo&&(this.videoDefer&&!this.videoDefer.isFinished||(this.videoDefer=a()),await this.videoDefer.promise),!this.host)return;const t=await this.client.subscribe(this.host,"video");this.videoTrack=t,this.videoTrack.play(this.element),this.setVideoState(e.MediaState.PLAYING)}async pauseAudio(t){const i=this.audioState===e.MediaState.PLAYING,s=this.audioState===e.MediaState.PAUSED;if(this.audioTrack&&this.host&&(i||s))return i&&this.audioTrack.stop(),t?(await this.client.unsubscribe(this.host,"audio"),this.setAudioState(e.MediaState.STOPPED)):this.setAudioState(e.MediaState.PAUSED)}async pauseVideo(t){const i=this.videoState===e.MediaState.PLAYING,s=this.videoState===e.MediaState.PAUSED;if(this.videoTrack&&this.host&&(i||s))return i&&this.videoTrack.stop(),t?(await this.client.unsubscribe(this.host,"video"),this.setVideoState(e.MediaState.STOPPED)):this.setVideoState(e.MediaState.PAUSED)}async playRemoteUser(e){throw new Error("should implement by child class")}onUserJoined=async t=>{this.host?this.pendingRemoteUsers.push(t):await this.playRemoteUser(t),this.safeEmit(e.LiveVideoEvent.USER_STATE_CHANGED,{state:e.UserState.JOINED,user:t,isHost:this.host&&this.host.uid===t.uid})};onUserLeft=async t=>{this.safeEmit(e.LiveVideoEvent.USER_STATE_CHANGED,{state:e.UserState.LEFT,user:t,isHost:this.host&&this.host.uid===t.uid});const i=this.pendingRemoteUsers.findIndex((e=>e.uid===t.uid));if(-1!==i)return this.pendingRemoteUsers.splice(i,1);this.host&&this.host.uid===t.uid&&(this.audioDefer&&this.audioDefer.reject("user left"),this.videoDefer&&this.videoDefer.reject("user left"));const s=this.pendingRemoteUsers.findIndex((e=>e.hasVideo))||this.pendingRemoteUsers.findIndex((e=>e.hasVideo))||0;let a;this.pendingRemoteUsers.length>0&&(a=this.pendingRemoteUsers[s],this.pendingRemoteUsers.splice(s,1)),this.playRemoteUser(a)};onUserUnpublished=async(t,i)=>{const s=this.host&&this.host.uid===t.uid;this.safeEmit(e.LiveVideoEvent.USER_STATE_CHANGED,{state:e.UserState.UNPUBLISHED,user:t,mediaType:i,isHost:s}),"video"===i&&s&&(this.videoTrack=void 0,this.setVideoState(e.MediaState.STOPPED),this.videoDefer=a(),this.playVideo().catch((()=>{}))),"audio"===i&&s&&(this.audioTrack=void 0,this.setAudioState(e.MediaState.STOPPED),this.audioDefer=a(),this.playAudio().catch((()=>{})))};onUserPublished=async(t,i)=>{const s=this.host&&this.host.uid===t.uid;this.safeEmit(e.LiveVideoEvent.USER_STATE_CHANGED,{state:e.UserState.PUBLISHED,user:t,mediaType:i,isHost:s}),s&&("video"===i&&this.videoDefer&&this.videoDefer.resolve(),"audio"===i&&this.audioDefer&&this.audioDefer.resolve())};bindEvents(){this.client.on("user-published",this.onUserPublished),this.client.on("user-unpublished",this.onUserUnpublished),this.client.on("user-joined",this.onUserJoined),this.client.on("user-left",this.onUserLeft)}unbindEvent(){this.client.off("user-published",this.onUserPublished),this.client.off("user-unpublished",this.onUserUnpublished),this.client.off("user-joined",this.onUserJoined),this.client.off("user-left",this.onUserLeft)}async _retry(){return this.reset("retry"),this.client.leave(),this.join()}async _pause(e){await Promise.all([this.pauseAudio(e),this.pauseVideo(e)])}async _play(){let t=!1;if(this.videoTrack&&this.videoState===e.MediaState.PAUSED&&(this.videoTrack.play(this.element),this.setVideoState(e.MediaState.PLAYING)),this.audioTrack&&this.audioState===e.MediaState.PAUSED&&(this.audioTrack.play(),this.setAudioState(e.MediaState.PLAYING)),t=this.videoState===e.MediaState.PLAYING||this.audioState===e.MediaState.PLAYING,!t){if(this.state===e.LiveVideoState.CONNECT_FAILED&&await this.join(),this.state===e.LiveVideoState.CONNECT_FAILED){const t={message:"play failed",reason:this.host?"join failed!":"no user joined"};throw this.safeEmit(e.LiveVideoEvent.ERROR,t),t}this.host&&await this.playRemoteUser(this.host)}}async _switch(e){e!==this.options.url&&(this.options.url=e,await this.recreate())}async create(){this.setState(e.LiveVideoState.CREATING),this.setAudioState(e.MediaState.EMPTY),this.setVideoState(e.MediaState.EMPTY),this.client=t.createClient({mode:"live",codec:"vp8"}),this.createElement(this.options.id,this.options.width,this.options.height,this.options.aspectRatio),this.setState(e.LiveVideoState.CREATED),await this.join()}getStats(){if(this.client&&this.host)return{audio:this.client.getRemoteAudioStats()[this.host.uid],video:this.client.getRemoteVideoStats()[this.host.uid]}}async _destroy(){t.off("autoplay-failed",this.onAutoplayFailed),this.reset("destroy"),this.client&&this.client.leave(),this.state=e.LiveVideoState.DESTROYED}}!function(e){e.WILL_PLAY="will_play",e.PLAYING="playing",e.PAUSED="paused",e.STOPPED="stopped"}(l||(l={}));e.LiveVideoPlayer=class extends c{playDefer=o(!1);pauseDefer=o(!1);retryDefer=o(!1);switchDefer=o(!1);playState=l.STOPPED;get isPlaying(){return this.playState===l.PLAYING}get isPaused(){return this.playState===l.PAUSED}get isStopped(){return this.playState===l.STOPPED}async playRemoteUser(t){(!this.host||!t||this.host.uid!==t.uid)&&this.safeEmit(e.LiveVideoEvent.HOST_CHANGED,this.host,t),this.host=t,!this.host||this.isPaused||this.isStopped||await Promise.any([this.playAudio(),this.playVideo()]).catch((t=>{this.safeEmit(e.LiveVideoEvent.ERROR,t)}))}constructor(e){super(e)}async play(){await Promise.all([this.switchDefer.promise,this.pauseDefer.promise,this.playDefer.promise]),this.playDefer=a();const e=this.playState;try{this.playState=l.WILL_PLAY,await this._play(),this.playState=l.PLAYING}catch(t){throw this.playState=e,t}finally{this.playDefer.resolve(!0)}}async pause(e){await Promise.all([this.switchDefer.promise,this.pauseDefer.promise]),this.pauseDefer=a();try{await this._pause(e),this.playState=this.playState===l.STOPPED||e?l.STOPPED:l.PAUSED}finally{this.pauseDefer.resolve(!0)}}async retry(){await Promise.all([this.playDefer.promise,this.pauseDefer.promise,this.switchDefer.promise,this.retryDefer.promise]),this.retryDefer=a();try{await this._retry()}finally{this.retryDefer.resolve(!0)}}async switchURL(e){await this.switchDefer.promise,this.switchDefer=a();try{await this._switch(e)}finally{this.switchDefer.resolve(!0)}}destroy(){this._destroy(),this.playState=l.STOPPED,!this.playDefer.isFinished&&this.playDefer.reject(!1),!this.pauseDefer.isFinished&&this.pauseDefer.reject(!1),!this.retryDefer.isFinished&&this.retryDefer.reject(!1),!this.switchDefer.isFinished&&this.switchDefer.reject(!1),this.pauseDefer=o(!1),this.retryDefer=o(!1),this.playDefer=o(!1),this.switchDefer=o(!1)}}}));
