import{a as qe,b as Ue,c as He}from"./chunk-H77BKREM.js";import{a as $e}from"./chunk-J3ZANQXL.js";import{a as De,b as Ne}from"./chunk-YXZDJEQA.js";import"./chunk-CVE6MJMZ.js";import"./chunk-GYXHAN4D.js";import{a as Be}from"./chunk-R3AB64LA.js";import{c as F}from"./chunk-SPRK6DMK.js";import{a as We}from"./chunk-WDJHNEZ5.js";import{a as je}from"./chunk-CJKUBRVY.js";import{b as A}from"./chunk-UCKHWV5D.js";import{d as _e,f as ye}from"./chunk-A3RPS73V.js";import"./chunk-477BP3S3.js";import{a as Pe}from"./chunk-Y5V5Q5MM.js";import"./chunk-2W6XPGDR.js";import"./chunk-YKI6Z75V.js";import{b as Te,f as Le,g as Re}from"./chunk-YYSSMGJR.js";import"./chunk-IHOFWBF3.js";import{a as D}from"./chunk-5UX5ZLMF.js";import{b as Oe}from"./chunk-GCAOOQ5K.js";import{D as we,I as xe}from"./chunk-U4CFCUJG.js";import{c as be,d as ze,f as R,g as k,i as Ie}from"./chunk-OK5S6IU3.js";import"./chunk-3Y4VIYVE.js";import{B as V,b as L,e as ke,g as Me,j as M,n as Ee,q as E,v as Ve,w as Ae,x as Fe}from"./chunk-V32KLUJ4.js";import"./chunk-DCSLL5ZG.js";import{$b as a,Ab as ae,B as G,Ea as u,Fa as g,Fb as z,Fc as T,Ga as q,Ha as U,Hc as Q,Ia as b,Ic as ue,K as Z,Ka as re,Kb as I,Kc as ge,Lc as fe,N as J,P as K,Qa as ne,Qb as c,Ra as oe,T as X,V as Y,Vb as v,Wb as se,X as ee,Y as te,Yb as le,Zb as ce,_b as o,ac as d,ad as he,ea as ie,ec as w,f as Qe,fa as B,ha as _,hc as C,i as j,id as ve,jc as f,kd as Ce,nd as Se,ob as n,q as O,qa as l,ua as x,uc as pe,vc as me,wc as de,x as P,xc as p,yc as h,zb as y,zc as H}from"./chunk-IAZQTHFA.js";var m=Qe(We());var Ke=["waves"],Xe=i=>({"!-right-14":i}),Ye=(i,e)=>({"bg-red-500":i,"bg-green-500":e}),et=i=>({hidden:i});function tt(i,e){if(i&1&&(o(0,"span",8),p(1),a()),i&2){let r=f();n(),h(r.lang.locals.loading)}}function it(i,e){if(i&1&&(o(0,"span",9),p(1),a()),i&2){let r=f();n(),h(r.lang.locals.click_to_speak)}}function rt(i,e){if(i&1&&(o(0,"span",8),p(1),a()),i&2){let r=f();n(),h(r.lang.locals.listening_ongoing)}}function nt(i,e){if(i&1&&(o(0,"span",8),p(1),a()),i&2){let r=f();n(),h(r.lang.locals.click_to_send)}}function ot(i,e){if(i&1&&(o(0,"option",16),p(1),a()),i&2){let r=e.$implicit;c("value",r),n(),h(r)}}var N=class i extends D(class{}){overlayChatComponent=oe.required();waves=ae.required("waves");store=l(A);chatService=l($e);chatHistoryService=l(Pe);avatarService=l(F);injector=l(re);recognizedText=y("");recognizingText=y("");speechService=l(je);recognizing$=ne();recognized$=new O;accept$=new O;recognizingStatus=y(!1);botNames$=this.chatHistoryService.getAllBotNames().pipe(_(e=>this.chatService.botNameCtrl.patchValue(e.at(0))));lang=l(L);ngOnInit(){return j(this,null,function*(){this.listenToAccept(),this.listenToBotNameChange(),yield this.prepareRecorder()})}listenToBotNameChange(){this.chatService.onBotNameChange().pipe(B(this.destroy$)).subscribe()}prepareRecorder(){return j(this,null,function*(){this.recordingStream=yield navigator.mediaDevices.getUserMedia({audio:!0,video:!1}),this.waveSurfer=new Ue({waveColor:"white",progressColor:"white",container:this.waves().nativeElement,height:"auto"}),this.recorder=this.waveSurfer.registerPlugin(He.create({scrollingWaveform:!1})),this.recorder.renderMicStream(this.recordingStream);let e=m.AudioConfig.fromDefaultMicrophoneInput(),r=m.AutoDetectSourceLanguageConfig.fromLanguages(["ar-QA","en-US","zh-CN","wuu-CN"]);this.recognizer=m.SpeechRecognizer.FromConfig(m.SpeechConfig.fromAuthorizationToken(this.store.speechToken.token(),this.store.speechToken.region()),r,e),this.recognizer.recognizing=(t,s)=>{s.result.reason===m.ResultReason.RecognizingSpeech&&(this.recognizingText.set(this.recognizedText()+" "+s.result.text),this.recognizing$.emit(this.recognizingText()),this.recognizingStatus.set(!0))},this.recognizer.recognized=(t,s)=>{s.result.reason===m.ResultReason.RecognizedSpeech&&this.store.isRecordingStarted()&&(this.recognizedText.update(S=>S+" "+s.result.text),this.recognized$.next(),this.recognizingStatus.set(!1))},this.recognizer.canceled=()=>{this.store.recordingInProgress(),this.speechService.generateSpeechToken().pipe(X(1)).subscribe(()=>{this.prepareRecorder().then(()=>this.startRecording())})}})}startRecording(){this.store.recordingInProgress(),this.recognizer.startContinuousRecognitionAsync(()=>{this.recognizer.internalData.privConnectionPromise.__zone_symbol__state===!0&&this.store.recordingStarted(),this.recognizingStatus.set(!0)})}stopRecording(){this.recognizer.stopContinuousRecognitionAsync(()=>{this.store.recordingStopped()})}toggleRecording(){this.store.isRecordingLoading()||(this.store.isRecordingStarted()?this.acceptText():this.startRecording())}acceptText(){this.accept$.next()}rejectText(){this.recognizingText.set(""),this.recognizedText.set(""),this.recognizing$.emit(""),this.recognizingStatus.set(!1),this.stopRecording()}goToEndOfChat(){setTimeout(()=>{let e=this.overlayChatComponent().container().nativeElement.querySelectorAll(".user");e[e.length-1].scrollIntoView(!0)},100)}listenToAccept(){this.accept$.pipe(G(()=>this.recognizedText())).pipe(J(e=>!!e)).pipe(B(this.destroy$)).pipe(_(()=>{this.recognizedText.set(""),this.recognizingText.set(""),this.recognizingStatus.set(!1),this.recognizing$.emit(""),this.stopRecording()})).pipe(_(()=>this.goToEndOfChat())).pipe(ee(e=>this.chatService.sendMessage(e,this.chatService.botNameCtrl.value))).pipe(Y(200)).subscribe(()=>{let e=this.overlayChatComponent().container().nativeElement.querySelectorAll(".assistant"),r=setInterval(()=>e[e.length-1].scrollIntoView(!1),200),t=he(()=>{this.overlayChatComponent().animationStatus()||(clearInterval(r),t.destroy())},{injector:this.injector})})}clearChat(){this.chatService.messages.set([])}static \u0275fac=(()=>{let e;return function(t){return(e||(e=b(i)))(t||i)}})();static \u0275cmp=x({type:i,selectors:[["app-screen-control"]],viewQuery:function(r,t){r&1&&pe(t.waves,Ke,5),r&2&&me()},inputs:{overlayChatComponent:[1,"overlayChatComponent"]},outputs:{recognizing$:"recognizing$"},standalone:!0,features:[z,T],decls:26,vars:23,consts:[["waves",""],["id","toolbar",1,"w-24","relative","flex","justify-center","items-start","text-white","flex-col","rounded-md","p-2","pt-36"],[1,"absolute","w-1/2","right-0","top-16","transition-all","duration-300",3,"ngClass"],[1,"w-full","bg-red-500","rounded-full",3,"click","matTooltip"],["fill","currentColor","xmlns","http://www.w3.org/2000/svg","viewBox","0 0 24 24"],["d","M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"],["aria-label","record",1,"absolute","top-8","left-1/2","disabled:bg-gray-400","-translate-x-1/2","flex","flex-col","p-2","bg-white","size-28","overflow-hidden","rounded-full",3,"pointerdown","contextmenu","disabled"],[1,"relative","flex","items-center","justify-center"],[1,"absolute","z-20","font-semibold","text-white"],[1,"absolute","z-20","font-semibold","text-black"],[1,"size-24","overflow-hidden","transition-all","rounded-full","relative",3,"ngClass"],[1,"w-full","mt-5","pointer-events-none","h-full","opacity-90",3,"ngClass"],["matRipple","",1,"text-white",3,"click","matTooltip"],["fill","currentColor","xmlns","http://www.w3.org/2000/svg","viewBox","0 0 24 24",1,"w-full"],["d","M15.46 15.88L16.88 14.46L19 16.59L21.12 14.47L22.54 15.88L20.41 18L22.54 20.12L21.12 21.54L19 19.41L16.88 21.54L15.46 20.12L17.59 18L15.47 15.88M12 3C17.5 3 22 6.58 22 11C22 11.58 21.92 12.14 21.78 12.68C20.95 12.25 20 12 19 12C15.69 12 13 14.69 13 18L13.08 18.95L12 19C10.76 19 9.57 18.82 8.47 18.5C5.55 21 2 21 2 21C4.33 18.67 4.7 17.1 4.75 16.5C3.05 15.07 2 13.14 2 11C2 6.58 6.5 3 12 3Z"],[1,"p-1","w-full","truncate","text-gray-200","text-sm","border-b-2","border-gray-300","bg-transparent","focus:ring-primary","focus:border-primary","outline-none",3,"matTooltip","matTooltipClass","formControl"],[1,"text-gray-800","truncate",3,"value"]],template:function(r,t){if(r&1){let s=w();o(0,"div",1)(1,"div",2)(2,"button",3),C("click",function(){return u(s),g(t.rejectText())}),q(),o(3,"svg",4)(4,"title"),p(5,"close"),a(),d(6,"path",5),a()()(),U(),o(7,"button",6),C("pointerdown",function(){return u(s),g(t.toggleRecording())})("contextmenu",function($){return u(s),g($.preventDefault())}),o(8,"div",7),I(9,tt,2,1,"span",8)(10,it,2,1,"span",9)(11,rt,2,1,"span",8)(12,nt,2,1,"span",8),o(13,"div",10),d(14,"div",11,0),a()()(),o(16,"button",12),C("click",function(){return u(s),g(t.clearChat())}),q(),o(17,"svg",13)(18,"title"),p(19,"remove chat"),a(),d(20,"path",14),a()(),U(),d(21,"app-avatar-interrupter-btn"),o(22,"select",15),le(23,ot,2,2,"option",16,se),ge(25,"async"),a()()}r&2&&(n(),c("ngClass",Q(16,Xe,t.store.isRecordingStarted())),n(),c("matTooltip",t.lang.locals.cancel_recording),n(5),c("disabled",t.store.isRecordingLoading()||t.recognizingStatus()),n(2),v(t.store.isRecordingLoading()?9:-1),n(),v(t.store.isRecordingStopped()?10:-1),n(),v(t.store.isRecordingStarted()&&t.recognizingStatus()?11:-1),n(),v(t.store.isRecordingStarted()&&!t.recognizingStatus()?12:-1),n(),c("@recordButton",t.store.recording())("ngClass",ue(18,Ye,t.recognizingStatus(),!t.recognizingStatus())),n(),c("ngClass",Q(21,et,!t.store.isRecordingStarted())),n(2),c("matTooltip",t.lang.locals.clear_chat_history),n(6),c("matTooltip",t.lang.locals.change_bot+`
`+t.lang.locals.change_bot_note)("matTooltipClass","whitespace-pre-line")("formControl",t.chatService.botNameCtrl),n(),ce(fe(25,14,t.botNames$)))},dependencies:[Ce,xe,Oe,Be,V,Ae,Fe,Ve,M,E,Se],data:{animation:[be("recordButton",[k("InProgress",R({transform:"scale(1)",backgroundColor:"gray"})),k("Started",R({transform:"scale(1)"})),k("Stopped",R({transform:"scale(0)"})),Ie("* <=> *",[ze("150ms ease-in-out")])])]}})};function at(i,e){i&1&&(o(0,"div",7)(1,"div",9),d(2,"div")(3,"div")(4,"div")(5,"div"),a()())}function st(i,e){if(i&1){let r=w();o(0,"div",8)(1,"div",10)(2,"span",11),p(3),a(),o(4,"mat-form-field",12)(5,"mat-label"),p(6,"Stream ID"),a(),d(7,"input",13),a(),o(8,"button",14),C("click",function(){u(r);let s=f();return g(s.saveStreamId())}),p(9),a()()()}if(i&2){let r=f();n(3),H("",r.lang.locals.scan_qr,":"),n(4),c("formControl",r.streamId),n(),c("disabled",r.streamId.invalid),n(),H(" ",r.lang.locals.save," ")}}var W=class i extends D(class{}){_route=l(_e);_router=l(ye);_location=l(ve);_avatarService=l(F);store=l(A);lang=l(L);streamId=new Ee("",[Me.required]);isLoading=!1;text=y("");ngAfterViewInit(){this.streamId.setValue(this._route.snapshot.queryParamMap.get("streamId")),this.store.updateStreamId(this.streamId.value??""),this._checkStreamId().subscribe(),this._checkStreamRecursivley().subscribe()}_checkStreamId(e=!0){return this.store.hasStream()?(e&&(this.isLoading=!0),this._avatarService.checkStreamStatus().pipe(te(()=>this.isLoading=!1),K(()=>(this._clearStreamId(),P(null))))):P(null)}_checkStreamRecursivley(){return this._checkStreamId(!1).pipe(ie(()=>Z(6e4).pipe(_(()=>this._checkStreamRecursivley().subscribe()))))}_clearStreamId(){this.store.updateStreamId("");let e=this._router.parseUrl(this._router.url);e.queryParams={},this._location.replaceState(e.toString())}saveStreamId(){this.store.updateStreamId(this.streamId.value??"");let e=this._router.parseUrl(this._router.url);e.queryParams=this.streamId.value?{streamId:this.streamId.value}:{},this._location.replaceState(e.toString()),this._checkStreamId().subscribe()}recognizing(e){this.text.set(e)}static \u0275fac=(()=>{let e;return function(t){return(e||(e=b(i)))(t||i)}})();static \u0275cmp=x({type:i,selectors:[["app-control"]],standalone:!0,features:[z,T],decls:10,vars:3,consts:[["overlayChatComponent",""],[1,"w-full","h-full","px-16","flex","justify-start","items-center","gap-12"],[3,"recognizing$","overlayChatComponent"],[1,"w-full","flex","flex-col","items-center","justify-center","gap-4"],[1,"flex-1","w-full","max-h-[95vh]","overflow-y-auto"],[1,"w-full"],[1,"bg-black/40","text-white"],[1,"left-0","top-0","z-50","flex","items-center","justify-center","w-full","bg-black/60","h-full","fixed"],[1,"left-0","top-0","z-50","flex","items-center","justify-center","w-full","bg-black/80","h-full","fixed"],[1,"lds-ellipsis"],[1,"flex","flex-col","items-center","justify-center","gap-8"],[1,"max-w-[700px]","font-bold","text-white","text-3xl"],["dir","ltr",1,"w-full"],["matInput","",3,"formControl"],[1,"-mt-10","bg-white","w-full","text-gray-800","font-medium","py-2","px-4","rounded-lg","hover:bg-white/90","disabled:bg-gray-400","disabled:cursor-not-allowed","focus:ring-2","focus:ring-white","focus:outline-none",3,"click","disabled"]],template:function(r,t){if(r&1){let s=w();o(0,"div",1)(1,"app-screen-control",2),C("recognizing$",function($){return u(s),g(t.recognizing($))}),a(),o(2,"div",3)(3,"div",4),d(4,"app-overlay-chat",5,0),a(),o(6,"div",6),p(7),a()()(),I(8,at,6,0,"div",7)(9,st,10,4,"div",8)}if(r&2){let s=de(5);n(),c("overlayChatComponent",s),n(6),h(t.text()),n(),v(t.isLoading?8:t.store.hasStream()?-1:9)}},dependencies:[qe,N,V,ke,M,E,Re,Le,Te,we,Ne,De]})};export{W as default};
