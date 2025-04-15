import{a as fe}from"./chunk-F6OI7MQG.js";import{a as ge}from"./chunk-R3AB64LA.js";import{c as pe}from"./chunk-SPRK6DMK.js";import{b as le}from"./chunk-UCKHWV5D.js";import{c as de}from"./chunk-U7A6JFEH.js";import"./chunk-BXGVR33D.js";import{g as ie}from"./chunk-YYSSMGJR.js";import{a as ce}from"./chunk-5UX5ZLMF.js";import{b as me,c as ue}from"./chunk-GCAOOQ5K.js";import"./chunk-U4CFCUJG.js";import"./chunk-OK5S6IU3.js";import{b as E}from"./chunk-3Y4VIYVE.js";import{B as se,b as te,e as ne,j as oe,n as re,q as ae}from"./chunk-V32KLUJ4.js";import"./chunk-DCSLL5ZG.js";import{$b as s,Ab as D,B as L,Ea as g,Fa as f,Fb as B,Fc as Q,Ga as N,Hc as q,Ia as j,Ic as W,Jc as A,Kb as v,Kc as Y,Lc as Z,M as R,N as F,P as $,Qb as l,Vb as h,X as P,Y as T,_b as a,_c as J,ac as c,ea as p,ec as I,fa as b,ha as x,hc as S,i as M,jb as U,jc as m,kd as K,nd as X,ob as o,qa as C,qd as ee,s as V,ua as z,uc as k,vc as H,w as _,x as O,xc as d,yc as y,zc as w}from"./chunk-IAZQTHFA.js";var Se=["video"],we=["idleVideo"],ve=(t,i,n)=>({"bg-red-600":t,"bg-green-700":i,"bg-orange-500":n}),Ce=t=>({"-translate-x-full":t}),_e=(t,i)=>({"bg-green-700":t,"bg-red-600":i});function be(t,i){t&1&&(a(0,"div",8),c(1,"app-avatar-interrupter-btn"),s())}function xe(t,i){if(t&1&&(a(0,"p",16),d(1),s()),t&2){let n=m();o(),w("*",n.lang.locals.words_limit_is," 70")}}function ye(t,i){t&1&&c(0,"app-spinner-loader",19),t&2&&l("width",24)("borderWidth",4)}function Ee(t,i){if(t&1&&d(0),t&2){let n=m();w(" ",n.lang.locals.test," ")}}function Ve(t,i){if(t&1&&(a(0,"button",25)(1,"div",28)(2,"span"),d(3),s()()()),t&2){let n=m();o(3),y(n.onlineStatus())}}function Le(t,i){if(t&1){let n=I();a(0,"button",29),S("click",function(){g(n);let r=m();return f(r.toggleStream())}),d(1),s()}if(t&2){let n=m();l("ngClass",W(2,_e,n.store.isStreamStarted(),n.store.isStreamStopped())),o(),w(" ",n.onlineStatus()," ")}}function Te(t,i){if(t&1&&(a(0,"div",27)(1,"span",30),d(2),s(),a(3,"span",31)(4,"span",32),d(5,"."),s(),a(6,"span",33),d(7,"."),s(),a(8,"span",34),d(9,"."),s()()()),t&2){let n=m();o(2),y(n.lang.locals.video_generating_and_downloading_progress)}}var G=class t extends ce(class{}){video=D.required("video");idleVideo=D("idleVideo");lang=C(te);avatarService=C(pe);store=C(le);messageService=C(de);start$=new V(1);stop$=new V(1);text=new re("");isLoading=!1;isDownloading=!1;wordsLimitExceeded=!1;settingsOpened=!1;onlineStatus=J(()=>{switch(this.lang.localChange(),this.store.streamingStatus()){case"Started":return this.lang.locals.connected;case"InProgress":return this.lang.locals.connecting;case"Disconnecting":return this.lang.locals.disconnecting;default:return this.lang.locals.not_connected}});init$=this.start$.asObservable().pipe(x(()=>this.store.updateStreamStatus("InProgress"))).pipe(b(this.destroy$)).pipe(P(()=>this.avatarService.startStream().pipe($(i=>{throw this.store.updateStreamStatus("Stopped"),i})).pipe(E()))).pipe(p(i=>{let{data:{webrtcData:{offer:n,iceServers:e}}}=i;return this.pc=new RTCPeerConnection({iceServers:e,iceTransportPolicy:"relay"}),this.pc.addEventListener("icecandidate",r=>{r.candidate&&this.avatarService.sendCandidate(r.candidate).subscribe()}),this.pc.addEventListener("icegatheringstatechange",r=>{r.target.iceGatheringState=="complete"&&this.video().nativeElement.paused&&(this.video().nativeElement.play().then(),this.store.updateStreamStatus("Started"))}),this.pc.addEventListener("track",r=>{this.video().nativeElement.srcObject=r.streams[0]}),this.pc.addEventListener("connectionstatechange",r=>{let u=r.target.connectionState;u==="connected"&&this.store.updateStreamStatus("Started"),u==="disconnected"&&this.store.updateStreamStatus("Stopped")}),_(this.pc.setRemoteDescription(new RTCSessionDescription(n))).pipe(p(()=>_(this.pc.createAnswer()))).pipe(p(r=>_(this.pc.setLocalDescription(r)).pipe(L(()=>r)))).pipe(p(r=>this.avatarService.sendAnswer(r)))})).pipe(L(()=>""));ngOnInit(){return M(this,null,function*(){this.text.valueChanges.pipe(b(this.destroy$)).subscribe(i=>{(i?.split(" ")??"").length>70?this.wordsLimitExceeded=!0:this.wordsLimitExceeded=!1}),R(this.destroy$).pipe(x(()=>this.store.updateStreamStatus("Stopped"))).pipe(p(()=>this.avatarService.closeStream().pipe(E()))).subscribe(()=>{console.log("COMPONENT DESTROYED")}),this.stop$.pipe(F(()=>this.store.hasStream())).pipe(x(()=>this.store.updateStreamStatus("Disconnecting"))).pipe(b(this.destroy$)).pipe(p(()=>this.avatarService.closeStream().pipe(E()))).subscribe(()=>{console.log("MANUAL CLOSE")}),this.start$.next()})}toggleSettings(){this.settingsOpened=!this.settingsOpened}interruptAvatar(){this.avatarService.interruptAvatar().subscribe()}test(){!this.text.value||this.isLoading||!this.store.isStreamStarted()||this.wordsLimitExceeded||(this.isLoading=!0,this.avatarService.renderText(this.text.value).pipe(T(()=>this.isLoading=!1)).subscribe())}updateAndDownload(){!this.text.value||this.isLoading||this.isDownloading||this.wordsLimitExceeded||(this.isDownloading=!0,this.avatarService.updateVideo(this.text.value).pipe(p(i=>i.status==="SUCCESS"?this.avatarService.retrieveVideo():(i.status==="RENDERING"&&this.messageService.showInfo(this.lang.locals.another_video_is_being_generated_please_try_again_after_a_while),O(null)))).pipe(T(()=>this.isDownloading=!1)).subscribe(i=>{i&&window.open(i)}))}ngAfterViewInit(){this.playIdle()}playIdle(){this.idleVideo()&&this.idleVideo()?.nativeElement&&(this.idleVideo().nativeElement.src=this.store.idleAvatarUrl(),this.idleVideo().nativeElement.muted=!0,this.idleVideo().nativeElement.loop=!0,this.idleVideo().nativeElement.play().then())}toggleStream(){this.store.isStreamStopped()?this.start$.next():this.store.isStreamStarted()&&this.stop$.next()}static \u0275fac=(()=>{let i;return function(e){return(i||(i=j(t)))(e||t)}})();static \u0275cmp=z({type:t,selectors:[["app-video-generator"]],viewQuery:function(n,e){n&1&&(k(e.video,Se,5),k(e.idleVideo,we,5)),n&2&&H(2)},standalone:!0,features:[B,Q],decls:36,vars:30,consts:[["video",""],["idleVideo",""],["id","video-wrapper",1,"relative","flex","flex-col","justify-center","items-center","gap-2","h-[100vh]","px-4","py-4","overflow-hidden"],[1,"flex","flex-col","items-end","w-full","md:w-[700px]","h-full","overflow-hidden","justify-center","relative","rounded-md"],[1,"flex","items-center","gap-1","shadow-2xl","shadow-white","bg-black/20","p-1","absolute","z-50","top-2","end-2","rounded-md"],[1,"p-4","rounded-full",3,"ngClass"],[1,"p-4","absolute","pulse","rounded-full",3,"ngClass"],[1,"text-white","font-semibold"],[1,"absolute","z-50","top-2","start-2","w-10"],[1,"relative","w-full","h-[500px]","overflow-hidden"],["autoplay","",1,"absolute","min-w-full","min-h-full",3,"hidden"],[1,"absolute","min-w-full","min-h-full",3,"hidden"],["type","video/webm",3,"src"],[1,"w-full","md:w-[700px]"],[1,"w-full"],["type","text","tabindex","1","rows","3",1,"w-full","resize-none","text-lg","p-2","text-gray-700","border","border-gray-300","rounded-lg","bg-gray-100","focus:ring-gray-400","focus:border-gray-400","focus:ring-4","outline-none","ring-2","ring-gray-500",3,"keydown.enter","formControl"],[1,"text-gray-300","font-semibold","text-sm"],[1,"flex","justify-center","items-center","gap-4"],[1,"bg-gray-300","w-1/2","text-gray-800","font-medium","py-2","px-4","rounded-lg","hover:bg-gray-400","disabled:bg-gray-400","focus:ring-2","focus:ring-gray-200","focus:outline-none",3,"click","disabled"],["color","#374151",3,"width","borderWidth"],["id","settings",1,"bg-black/50","absolute","left-0","top-1/2","rounded","p-4","transition-transform",3,"ngClass"],[1,"relative","flex","flex-col"],["aria-label","Settings",1,"absolute","-top-2","-right-14","z-20","bg-black/50","rounded-r","text-white",3,"click","matTooltip"],["fill","currentColor","xmlns","http://www.w3.org/2000/svg","viewBox","0 0 24 24",1,"size-10"],["d","M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"],["aria-label","close stream",1,"text-white","cursor-progress","size-20","bg-orange-500","rounded-full"],["matRipple","","aria-label","close stream",1,"text-white","size-20","rounded-full",3,"ngClass"],[1,"absolute","top-0","left-0","w-full","h-full","bg-black/75","z-50","flex","items-center","justify-center","gap-2","text-gray-200"],[1,"pulse","rounded-full","w-full","h-full","bg-primary","flex","justify-center","items-center"],["matRipple","","aria-label","close stream",1,"text-white","size-20","rounded-full",3,"click","ngClass"],[1,"font-medium","text-2xl"],[1,"flex","text-6xl"],[1,"animate-[bounce_1s_ease-in-out_infinite]"],[1,"animate-[bounce_1s_ease-in-out_infinite_0.2s]"],[1,"animate-[bounce_1s_ease-in-out_infinite_0.4s]"]],template:function(n,e){if(n&1){let r=I();a(0,"div",2)(1,"div",3)(2,"div",4),c(3,"div",5)(4,"div",6),a(5,"span",7),d(6),s()(),v(7,be,2,0,"div",8),a(8,"div",9),c(9,"video",10,0),a(11,"video",11,1),c(13,"source",12),s()()(),a(14,"div",13)(15,"div",14)(16,"textarea",15),S("keydown.enter",function(he){return g(r),he.preventDefault(),f(e.test())}),s()(),v(17,xe,2,1,"p",16),a(18,"div",17)(19,"button",18),S("click",function(){return g(r),f(e.test())}),v(20,ye,1,2,"app-spinner-loader",19)(21,Ee,1,1),s(),a(22,"button",18),S("click",function(){return g(r),f(e.updateAndDownload())}),d(23),s()()(),d(24),Y(25,"async"),s(),a(26,"div",20)(27,"div",21)(28,"button",22),S("click",function(){return g(r),f(e.toggleSettings())}),N(),a(29,"svg",23)(30,"title"),d(31,"cog"),s(),c(32,"path",24),s()(),v(33,Ve,4,1,"button",25)(34,Le,2,5,"button",26),s()(),v(35,Te,10,1,"div",27)}n&2&&(o(3),l("ngClass",A(20,ve,e.store.isStreamStopped(),e.store.isStreamStarted(),e.store.isStreamLoading())),o(),l("ngClass",A(24,ve,e.store.isStreamStopped(),e.store.isStreamStarted(),e.store.isStreamLoading())),o(2),y(e.onlineStatus()),o(),h(e.store.isStreamStarted()?7:-1),o(2),l("hidden",e.store.isStreamStopped()||e.store.isStreamLoading()),o(2),l("hidden",e.store.isStreamStarted()),o(2),l("src",e.store.idleAvatarUrl(),U),o(3),l("formControl",e.text),o(),h(e.wordsLimitExceeded?17:-1),o(2),l("disabled",!e.store.isStreamStarted()||e.isLoading||!e.text.value||e.wordsLimitExceeded),o(),h(e.isLoading?20:21),o(2),l("disabled",e.isLoading||e.isDownloading||!e.text.value||e.wordsLimitExceeded),o(),w(" ",e.lang.locals.download," "),o(),w(" ",Z(25,18,e.init$),`
`),o(2),l("ngClass",q(28,Ce,!e.settingsOpened)),o(2),l("matTooltip",e.lang.locals.settings),o(5),h(e.store.isStreamLoading()?33:34),o(2),h(e.isDownloading?35:-1))},dependencies:[ee,K,X,se,ne,oe,ae,ie,fe,ge,ue,me],styles:["[_nghost-%COMP%]{position:relative}"]})};export{G as default};
