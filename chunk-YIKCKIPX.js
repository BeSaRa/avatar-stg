import{a as Pe,b as De,c as Fe}from"./chunk-H77BKREM.js";import{a as Le}from"./chunk-J3ZANQXL.js";import{a as we}from"./chunk-YXZDJEQA.js";import{a as Ee}from"./chunk-5GGTYTUP.js";import"./chunk-CVE6MJMZ.js";import"./chunk-GYXHAN4D.js";import{a as Ve}from"./chunk-R3AB64LA.js";import{c as ze}from"./chunk-SPRK6DMK.js";import{a as Te}from"./chunk-ARBWV7UX.js";import{a as He}from"./chunk-WDJHNEZ5.js";import{a as Me}from"./chunk-CJKUBRVY.js";import{b as xe}from"./chunk-UCKHWV5D.js";import{a as le}from"./chunk-BXGVR33D.js";import{a as be,b as ye,c as ke}from"./chunk-N3PBMZT4.js";import"./chunk-477BP3S3.js";import{a as Ie}from"./chunk-Y5V5Q5MM.js";import"./chunk-2W6XPGDR.js";import"./chunk-YKI6Z75V.js";import{b as ce,f as pe}from"./chunk-YYSSMGJR.js";import"./chunk-IHOFWBF3.js";import{b as Ae,c as Re}from"./chunk-GCAOOQ5K.js";import{M as se}from"./chunk-U4CFCUJG.js";import"./chunk-OK5S6IU3.js";import"./chunk-3Y4VIYVE.js";import{B as R,a as ae,b as M,e as de,j as A,k as me,n as ge,q as ue,r as he,u as ve,v as fe,w as Se,x as Ce,z as _e}from"./chunk-V32KLUJ4.js";import{e as oe}from"./chunk-DCSLL5ZG.js";import{$b as a,Ab as _,Ea as v,Fa as f,Fc as T,Ga as C,Ha as y,Hc as L,Ic as j,Ka as G,Kb as U,Kc as X,Lc as Y,P as F,Qb as c,T as N,V as B,Vb as w,Wb as W,Y as q,Yb as Z,Zb as J,_b as o,_c as ee,ac as m,ad as te,ec as O,f as Ne,ha as H,hc as h,jb as $,jc as S,kd as ie,nd as ne,ob as r,qa as d,qd as re,ua as k,uc as b,vc as K,w as P,xc as l,y as D,yc as g,zb as x,zc as z}from"./chunk-IAZQTHFA.js";var E=class n{lang=d(M);fb=d(_e);dialogRef=d(be);data=d(ye);form=this.fb.group({bgImgUrl:"",size:"Cropped-Portrait"});ngOnInit(){this.form.setValue(this.data)}save(){this.dialogRef.close(this.form.value)}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=k({type:n,selectors:[["app-ms-avatar-settings-popup"]],standalone:!0,features:[T],decls:23,vars:6,consts:[[1,"flex","flex-col","overflow-hidden","dialog-container","min-w-[400px]"],[1,"bg-primary","text-white","text-xl","p-4"],[1,"p-4","flex","flex-col","flex-auto",3,"formGroup"],[1,"w-full"],["formControlName","bgImgUrl","type","text","matInput",""],["appearance","outline",1,"w-full"],["formControlName","size"],["value","Square"],["value","Portrait"],["value","Cropped-Portrait"],["value","Landscape"],[1,"p-4"],["mat-raised-button","",1,"primary",3,"click","disabled"]],template:function(t,e){t&1&&(o(0,"div",0)(1,"div",1),l(2),a(),o(3,"div",2)(4,"mat-form-field",3)(5,"mat-label"),l(6),a(),m(7,"input",4),a(),o(8,"mat-form-field",5)(9,"mat-label"),l(10),a(),o(11,"mat-select",6)(12,"mat-option",7),l(13,"Square"),a(),o(14,"mat-option",8),l(15,"Portrait"),a(),o(16,"mat-option",9),l(17,"Cropped-Portrait"),a(),o(18,"mat-option",10),l(19,"Landscape"),a()()()(),o(20,"div",11)(21,"button",12),h("click",function(){return e.save()}),l(22),a()()()),t&2&&(r(2),g(e.lang.locals.settings),r(),c("formGroup",e.form),r(3),g(e.lang.locals.background_url),r(4),g(e.lang.locals.shape),r(11),c("disabled",e.form.invalid),r(),z(" ",e.lang.locals.save," "))},dependencies:[le,ce,pe,we,Te,se,R,de,A,me,he,ve]})};var s=Ne(He());var Qe=["overlayChatComponent"],Be=["video"],qe=["audio"],Ge=["idleVideo"],$e=["waves"],We=n=>({"!-right-14":n}),Ze=(n,i)=>({"bg-red-500":n,"bg-green-500":i}),Je=n=>({hidden:n}),Ke=n=>({"-translate-x-full":n}),Xe=(n,i)=>({"bg-green-700":n,"bg-red-600":i});function Ye(n,i){if(n&1&&(o(0,"span",22),l(1),a()),n&2){let t=S();r(),g(t.lang.locals.loading)}}function et(n,i){if(n&1&&(o(0,"span",23),l(1),a()),n&2){let t=S();r(),g(t.lang.locals.click_to_speak)}}function tt(n,i){if(n&1&&(o(0,"span",22),l(1),a()),n&2){let t=S();r(),g(t.lang.locals.listening_ongoing)}}function it(n,i){if(n&1&&(o(0,"span",22),l(1),a()),n&2){let t=S();r(),g(t.lang.locals.click_to_send)}}function nt(n,i){if(n&1&&(o(0,"option",31),l(1),a()),n&2){let t=i.$implicit;c("value",t),r(),g(t)}}function rt(n,i){if(n&1&&(o(0,"button",37)(1,"div",41)(2,"span"),l(3),a()()()),n&2){let t=S();r(3),g(t.onlineStatus())}}function ot(n,i){if(n&1){let t=O();o(0,"button",42),h("click",function(){v(t);let p=S();return f(p.toggleStream())}),l(1),a()}if(n&2){let t=S();c("ngClass",j(2,Xe,t.store.isStreamStarted(),t.store.isStreamStopped())),r(),z(" ",t.onlineStatus()," ")}}var Q=class n{overlayChatComponent=_.required("overlayChatComponent");video=_.required("video");audio=_.required("audio");idleVideo=_("idleVideo");waves=_.required("waves");urlService=d(ae);http=d(oe);store=d(xe);lang=d(M);speechService=d(Me);avatarService=d(ze);chatService=d(Le);chatHistoryService=d(Ie);injector=d(G);dialog=d(ke);botNames$=this.chatHistoryService.getAllBotNames().pipe(H(i=>this.chatService.botNameCtrl.patchValue(i.at(0))));videoFormat;avatarConfig;recognizer;avatarSynthesizer;peerConnection;recognizedText=x("");recognizingText=x("");recognizingStatus=x(!1);isSpeaking=!1;spokenTextQueue=[];personalVoiceSpeakerProfileID=new ge("");settingsOpened=!1;onlineStatus=ee(()=>{switch(this.lang.localChange(),this.store.streamingStatus()){case"Started":return this.lang.locals.connected;case"InProgress":return this.lang.locals.connecting;case"Disconnecting":return this.lang.locals.disconnecting;default:return this.lang.locals.not_connected}});settings={bgImgUrl:"",size:"Cropped-Portrait"};sizesMap={Square:{width:700,height:700},Portrait:{width:600,height:1e3},"Cropped-Portrait":{width:400,height:700},Landscape:{width:1920,height:1080}};ngAfterViewInit(){this.start(),this._initWaveSurfer()}start(){this._prepareRecorder(),this._prepareAvatar(),this._initWebRTC()}stop(){if(this.avatarSynthesizer&&!this.store.isStreamLoading()&&(this.store.updateStreamStatus("Disconnecting"),P(this.avatarSynthesizer.close()).pipe(N(1),q(()=>{this.store.updateStreamStatus("Stopped"),this.avatarSynthesizer=void 0})).subscribe()),this.recognizer&&!this.store.isRecordingLoading()){this.store.recordingInProgress(),this.recognizer.stopContinuousRecognitionAsync(()=>this.recognizer.close(()=>i(),()=>i()),()=>this.recognizer.close(()=>i(),()=>i()));let i=()=>{this.store.recordingStopped(),this.recognizer=void 0}}}_prepareRecorder(){this.recognizer=s.SpeechRecognizer.FromConfig(s.SpeechConfig.fromAuthorizationToken(this.store.speechToken.token(),this.store.speechToken.region()),s.AutoDetectSourceLanguageConfig.fromLanguages(["ar-QA","en-US"]),s.AudioConfig.fromDefaultMicrophoneInput()),this.recognizer.recognizing=(i,t)=>{t.result.reason===s.ResultReason.RecognizingSpeech&&(this.recognizingText.set(this.recognizedText()+" "+t.result.text),this.recognizingStatus.set(!0))},this.recognizer.recognized=(i,t)=>{t.result.reason===s.ResultReason.RecognizedSpeech&&this.store.isRecordingStarted()&&(this.recognizedText.update(e=>e+" "+t.result.text),this.recognizingStatus.set(!1))},this.recognizer.canceled=()=>{this.store.recordingInProgress(),this.speechService.generateSpeechToken().subscribe(()=>{this._prepareRecorder(),this.startRecording()})}}_prepareAvatar(){this.videoFormat=new s.AvatarVideoFormat;let i=this.sizesMap[this.settings.size].width,t=this.sizesMap[this.settings.size].height,e=(i?Math.ceil((1920-i)/2):0)+20,p=i?Math.min(1920,Math.ceil(1920-(1920-i)/2)+20):1920,u=0,I=t?Math.ceil(t):1080;this.videoFormat.setCropRange(new s.Coordinate(e,u),new s.Coordinate(p,I)),this.avatarConfig=new s.AvatarConfig("ebla","fb-avatar-01",this.videoFormat),this.avatarConfig.customized=!0,this.settings?.bgImgUrl&&(this.avatarConfig.backgroundImage=this.settings.bgImgUrl);let V=s.SpeechConfig.fromAuthorizationToken(this.store.speechToken.token(),this.store.speechToken.region());V.endpointId="",V.setProperty(s.PropertyId.SpeechServiceConnection_LanguageIdMode,"Continuous"),this.avatarSynthesizer=new s.AvatarSynthesizer(V,this.avatarConfig),this.avatarSynthesizer.avatarEventReceived=function(){}}_initWebRTC(){this.store.updateStreamStatus("InProgress"),this.avatarService.getMSICEServerInfo().pipe(F(i=>(this.store.updateStreamStatus("Stopped"),D(()=>i)))).subscribe(i=>{this.peerConnection=new RTCPeerConnection({iceServers:[{urls:[i.Urls[0]],username:i.Username,credential:i.Password}]}),this.peerConnection.onicegatheringstatechange=t=>{t.target.iceGatheringState=="complete"&&(this.video().nativeElement.paused&&this.video().nativeElement.play().then(),this.audio().nativeElement.paused&&this.audio().nativeElement.play().then(),this.store.updateStreamStatus("Started"))},this.peerConnection.ontrack=t=>{t.track.kind==="video"&&(this.video().nativeElement.srcObject=t.streams[0]),t.track.kind==="audio"&&(this.audio().nativeElement.srcObject=t.streams[0])},this.peerConnection.oniceconnectionstatechange=t=>{if(!this.store.isStreamLoading()){let e=t.target.iceConnectionState;e==="connected"&&this.store.updateStreamStatus("Started"),e==="disconnected"&&this.store.updateStreamStatus("Stopped")}},this.peerConnection.addTransceiver("video",{direction:"sendrecv"}),this.peerConnection.addTransceiver("audio",{direction:"sendrecv"}),P(this.avatarSynthesizer.startAvatarAsync(this.peerConnection)).pipe(N(1),H(()=>this.store.updateStreamStatus("Started")),F(t=>(this.store.updateStreamStatus("Stopped"),D(()=>t)))).subscribe()})}_initWaveSurfer(){navigator.mediaDevices.getUserMedia({audio:!0,video:!1}).then(i=>{new De({waveColor:"white",progressColor:"white",container:this.waves().nativeElement,height:"auto"}).registerPlugin(Fe.create({scrollingWaveform:!1})).renderMicStream(i)})}toggleStream(){this.store.isStreamLoading()||(this.store.isStreamStopped()?this.start():this.stop())}startRecording(){this.store.recordingInProgress(),this.recognizer?.startContinuousRecognitionAsync(()=>{(this.recognizer?.internalData).privConnectionPromise.__zone_symbol__state===!0&&this.store.recordingStarted(),this.recognizingStatus.set(!0)},()=>this.store.recordingStopped())}stopRecording(){this.recognizer?.stopContinuousRecognitionAsync(()=>{this.store.recordingStopped()})}toggleRecording(){this.store.isRecordingLoading()||(this.store.isRecordingStarted()?this.acceptText():this.startRecording())}acceptText(){if(!this.recognizedText())return;let i=this.recognizedText();this.recognizedText.set(""),this.recognizingText.set(""),this.recognizingStatus.set(!1),this.stopRecording(),this._goToEndOfChat(),this.chatService.sendMessage(i,this.chatService.botNameCtrl.value).pipe(B(200)).subscribe(t=>{this.speak(t.message.content);let e=this.overlayChatComponent().container().nativeElement.querySelectorAll(".assistant"),p=setInterval(()=>e[e.length-1].scrollIntoView(!1),200),u=te(()=>{this.overlayChatComponent().animationStatus()||(clearInterval(p),u.destroy())},{injector:this.injector})})}rejectText(){this.recognizingText.set(""),this.recognizedText.set(""),this.recognizingStatus.set(!1),this.stopRecording()}clearChat(){this.chatService.messages.set([])}speak(i,t=0){if(this.isSpeaking){this.spokenTextQueue.push(this._cleanText(i));return}this.speakNext(this._cleanText(i),t)}speakNext(i,t=0){let e="ar-SA-HamedNeural",p=`<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis'
    xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'><voice name='${e}'
    ><mstts:ttsembedding speakerProfileId='${this.personalVoiceSpeakerProfileID.value}'>
    <mstts:leadingsilence-exact value='0'/>${this._htmlEncode(i)}</mstts:ttsembedding></voice></speak>`;t>0&&(p=`<speak version='1.0'
      xmlns='http://www.w3.org/2001/10/synthesis'
      xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'
      ><voice name='${e}'><mstts:ttsembedding speakerProfileId='${this.personalVoiceSpeakerProfileID.value}'>
      <mstts:leadingsilence-exact value='0'/>${this._htmlEncode(i)}<break time='${t}ms' /></mstts:ttsembedding></voice></speak>`),this.isSpeaking=!0,this.avatarSynthesizer?.speakSsmlAsync(p).then(()=>{this.spokenTextQueue.length>0?this.speakNext(this.spokenTextQueue.shift()):this.isSpeaking=!1}).catch(()=>{this.spokenTextQueue.length>0?this.speakNext(this.spokenTextQueue.shift()):this.isSpeaking=!1})}stopSpeaking(){this.spokenTextQueue=[],this.avatarSynthesizer?.stopSpeakingAsync().then(()=>this.isSpeaking=!1)}toggleSettings(){this.settingsOpened=!this.settingsOpened}openSettingsPopup(){this.dialog.open(E,{data:this.settings}).afterClosed().subscribe(i=>{i&&(this.settings=i,this._prepareAvatar(),this._initWebRTC())})}_goToEndOfChat(){setTimeout(()=>{let i=this.overlayChatComponent().container().nativeElement.querySelectorAll(".user");i[i.length-1].scrollIntoView(!0)},100)}_htmlEncode(i){let t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};return String(i).replace(/[&<>"'/]/g,e=>t[e])}_cleanText(i){return i=i.replace(/<[^>]*>|\[doc\d+\]|<pre[^>]*>.*?<\/pre>|doc\d+|###|\*/g,""),i}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=k({type:n,selectors:[["app-ms-avatar"]],viewQuery:function(t,e){t&1&&(b(e.overlayChatComponent,Qe,5),b(e.video,Be,5),b(e.audio,qe,5),b(e.idleVideo,Ge,5),b(e.waves,$e,5)),t&2&&K(5)},standalone:!0,features:[T],decls:53,vars:33,consts:[["video",""],["idleVideo",""],["audio",""],["overlayChatComponent",""],["waves",""],["id","video-wrapper",1,"flex","items-center","w-full","h-full","justify-center"],[1,"flex","flex-col","items-center","w-full","h-full","justify-center","absolute"],["autoplay","",1,"h-full",3,"hidden"],[1,"h-full",3,"hidden"],["type","video/webm",3,"src"],["autoplay","","hidden",""],["id","toolbar","cdkDrag","",1,"absolute","top-10","right-10","w-24","flex","justify-center","items-start","text-white","flex-col","rounded-md","p-2","pt-36","bg-black/50"],["cdkDragHandle",""],["width","24px","fill","currentColor","viewBox","0 0 24 24",1,"absolute","cursor-move","top-1","right-1"],["d","M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"],["d","M0 0h24v24H0z","fill","none"],[1,"absolute","w-1/2","right-0","top-16","transition-all","duration-300",3,"ngClass"],[1,"w-full","bg-red-500","rounded-full",3,"click","matTooltip"],["fill","currentColor","xmlns","http://www.w3.org/2000/svg","viewBox","0 0 24 24"],["d","M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"],["aria-label","record",1,"absolute","top-8","left-1/2","disabled:bg-gray-400","-translate-x-1/2","flex","flex-col","p-2","bg-white","size-28","overflow-hidden","rounded-full",3,"pointerdown","contextmenu","disabled"],[1,"relative","flex","items-center","justify-center"],[1,"absolute","z-20","font-semibold","text-white"],[1,"absolute","z-20","font-semibold","text-black"],[1,"size-24","overflow-hidden","transition-all","rounded-full","relative",3,"ngClass"],[1,"w-full","mt-5","pointer-events-none","h-full","opacity-90",3,"ngClass"],["matRipple","",1,"text-white",3,"click","matTooltip"],["fill","currentColor","xmlns","http://www.w3.org/2000/svg","viewBox","0 0 24 24",1,"w-full"],["d","M15.46 15.88L16.88 14.46L19 16.59L21.12 14.47L22.54 15.88L20.41 18L22.54 20.12L21.12 21.54L19 19.41L16.88 21.54L15.46 20.12L17.59 18L15.47 15.88M12 3C17.5 3 22 6.58 22 11C22 11.58 21.92 12.14 21.78 12.68C20.95 12.25 20 12 19 12C15.69 12 13 14.69 13 18L13.08 18.95L12 19C10.76 19 9.57 18.82 8.47 18.5C5.55 21 2 21 2 21C4.33 18.67 4.7 17.1 4.75 16.5C3.05 15.07 2 13.14 2 11C2 6.58 6.5 3 12 3Z"],[3,"interrupt","isDefault","disabled"],[1,"block","p-1","w-full","truncate","text-gray-200","text-sm","border-b-2","border-gray-300","bg-transparent","focus:ring-primary","focus:border-primary","outline-none",3,"matTooltip","matTooltipClass","formControl"],[1,"text-gray-800","truncate",3,"value"],["id","settings",1,"bg-black/50","absolute","left-0","top-60","rounded","p-4","transition-transform",3,"ngClass"],[1,"relative","flex","flex-col","items-center"],["aria-label","Settings",1,"absolute","-top-2","-right-14","z-20","bg-black/50","rounded-r","text-white",3,"click","matTooltip"],["fill","currentColor","xmlns","http://www.w3.org/2000/svg","viewBox","0 0 24 24",1,"size-10"],["d","M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"],["aria-label","close stream",1,"text-white","cursor-progress","size-20","bg-orange-500","rounded-full"],["matRipple","","aria-label","close stream",1,"text-white","size-20","rounded-full",3,"ngClass"],[1,"mt-2","text-white",3,"click"],["fill","currentColor","xmlns","http://www.w3.org/2000/svg","viewBox","0 0 24 24",1,"size-16"],[1,"pulse","rounded-full","w-full","h-full","bg-primary","flex","justify-center","items-center"],["matRipple","","aria-label","close stream",1,"text-white","size-20","rounded-full",3,"click","ngClass"]],template:function(t,e){if(t&1){let p=O();o(0,"div",5)(1,"div",6),m(2,"video",7,0),o(4,"video",8,1),m(6,"source",9),a(),m(7,"audio",10,2),a()(),m(9,"app-overlay-chat",null,3),o(11,"div",11)(12,"button",12),C(),o(13,"svg",13),m(14,"path",14)(15,"path",15),a()(),y(),o(16,"div",16)(17,"button",17),h("click",function(){return v(p),f(e.rejectText())}),C(),o(18,"svg",18)(19,"title"),l(20,"close"),a(),m(21,"path",19),a()()(),y(),o(22,"button",20),h("pointerdown",function(){return v(p),f(e.toggleRecording())})("contextmenu",function(I){return v(p),f(I.preventDefault())}),o(23,"div",21),U(24,Ye,2,1,"span",22)(25,et,2,1,"span",23)(26,tt,2,1,"span",22)(27,it,2,1,"span",22),o(28,"div",24),m(29,"div",25,4),a()()(),o(31,"button",26),h("click",function(){return v(p),f(e.clearChat())}),C(),o(32,"svg",27)(33,"title"),l(34,"remove chat"),a(),m(35,"path",28),a()(),y(),o(36,"app-avatar-interrupter-btn",29),h("interrupt",function(){return v(p),f(e.stopSpeaking())}),a(),o(37,"select",30),Z(38,nt,2,2,"option",31,W),X(40,"async"),a()(),o(41,"div",32)(42,"div",33)(43,"button",34),h("click",function(){return v(p),f(e.toggleSettings())}),C(),o(44,"svg",35)(45,"title"),l(46,"cog"),a(),m(47,"path",36),a()(),U(48,rt,4,1,"button",37)(49,ot,2,5,"button",38),y(),o(50,"button",39),h("click",function(){return v(p),f(e.openSettingsPopup())}),C(),o(51,"svg",40),m(52,"path",36),a()()()()}t&2&&(r(2),c("hidden",e.store.isStreamStopped()||e.store.isStreamLoading()),r(2),c("hidden",e.store.isStreamStarted()),r(2),c("src",e.store.idleAvatarUrl(),$),r(10),c("ngClass",L(24,We,e.store.isRecordingStarted())),r(),c("matTooltip",e.lang.locals.cancel_recording),r(5),c("disabled",e.store.isRecordingLoading()||e.recognizingStatus()),r(2),w(e.store.isRecordingLoading()?24:-1),r(),w(e.store.isRecordingStopped()?25:-1),r(),w(e.store.isRecordingStarted()&&e.recognizingStatus()?26:-1),r(),w(e.store.isRecordingStarted()&&!e.recognizingStatus()?27:-1),r(),c("@recordButton",e.store.recording())("ngClass",j(26,Ze,e.recognizingStatus(),!e.recognizingStatus())),r(),c("ngClass",L(29,Je,!e.store.isRecordingStarted())),r(2),c("matTooltip",e.lang.locals.clear_chat_history),r(5),c("isDefault",!1)("disabled",!e.isSpeaking),r(),c("matTooltip",e.lang.locals.change_bot+`
`+e.lang.locals.change_bot_note)("matTooltipClass","whitespace-pre-line")("formControl",e.chatService.botNameCtrl),r(),J(Y(40,22,e.botNames$)),r(3),c("ngClass",L(31,Ke,!e.settingsOpened)),r(2),c("matTooltip",e.lang.locals.settings),r(5),w(e.store.isStreamLoading()?48:49))},dependencies:[re,ie,ne,Re,Ae,Pe,Ve,R,Se,Ce,fe,A,ue,Ee]})};export{Q as default};
