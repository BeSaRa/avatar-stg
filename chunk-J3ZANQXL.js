import{b as p}from"./chunk-GYXHAN4D.js";import{b as U}from"./chunk-UCKHWV5D.js";import{a as w}from"./chunk-477BP3S3.js";import{d as R,e as E}from"./chunk-3Y4VIYVE.js";import{a as S,b as M,n as b}from"./chunk-V32KLUJ4.js";import{b as C,e as I}from"./chunk-DCSLL5ZG.js";import{B as u,P as m,W as d,X as h,a as i,ha as f,ka as v,qa as o,zb as l}from"./chunk-IAZQTHFA.js";var A=class c{http=o(I);urlService=o(S);store=o(U);lang=o(M);messages=l([]);status=l(!1);conversationId=l("");sendMessage(s,r){let a=`${this.urlService.URLS.CHAT}/${r}`;return this.messages.update(e=>[...e,new p(s,"user")]),this.http.post(a,i(i(i({messages:this.messages()},this.store.streamId()?{stream_id:this.store.streamId()}:null),this.conversationId()?{conversation_id:this.conversationId()}:null),this.getUserId()?{user_id:this.getUserId()}:null)).pipe(m(e=>{throw new p().clone({content:e.message,role:"error"}),new Error(e)})).pipe(u(e=>(e.message.content=R(E(e.message.content,e.message)),e.message=new p().clone(e.message),this.conversationId.set(e.message.conversation_id),this.messages.update(n=>[...n,e.message]),e)))}botNameCtrl=new b("",{nonNullable:!0});onBotNameChange(){return this.botNameCtrl.valueChanges.pipe(d(),f(()=>{this.conversationId.set(""),this.messages.set([])}))}uploadDocument(s,r,a){let e=`${this.urlService.URLS.CHATBOT_UPLOAD_DOCUMENT}`,n=new FormData;Array.from(s).forEach(t=>{n.append("files",t,t.name)});let g=new C().set("bot_name",r);return a&&(g=g.set("conversation_id",a)),this.http.post(e,n,{params:g}).pipe(u(t=>(this.conversationId.set(t.data||""),t.data)),h(()=>this.sendMessage("summarize",r).pipe(m(t=>{throw console.error("Error sending summarize message:",t),t}))),m(t=>{throw console.error("Error uploading document:",t),t}))}getUserId(){let s=localStorage.getItem(w.USER),r="";return s&&(r=JSON.parse(s).user_id),r}static \u0275fac=function(r){return new(r||c)};static \u0275prov=v({token:c,factory:c.\u0275fac,providedIn:"root"})};export{A as a};
