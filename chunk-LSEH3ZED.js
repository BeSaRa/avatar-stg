import{$ as T,Ea as we,G as he,J as ue,Pb as v,Q as fe,Qb as H,Ra as Ee,Sa as Se,Wb as Pe,X as pe,Yb as Ae,Z as _,_ as me,a as h,b as U,ba as k,cc as Ie,da as P,ea as f,g as Y,h as le,ia as ye,k as Z,ka as ge,la as Te,s as de,t as Q,ta as ve,ua as Re,wa as be,x as F}from"./chunk-OCYVAU27.js";var We=new WeakMap,R=Symbol("STATE_SOURCE");function M(n,...e){n[R].update(t=>e.reduce((r,s)=>h(h({},r),typeof s=="function"?s(r):s),t)),qe(n)}function Ge(n){return n[R]()}function Ke(n){return We.get(n[R][le])||[]}function qe(n){let e=Ke(n);for(let t of e){let r=H(()=>Ge(n));t(r)}}function Oe(n){let e=H(()=>n());return Ye(e)?new Proxy(n,{get(t,r){return r in e?(Ee(t[r])||Object.defineProperty(t,r,{value:v(()=>t()[r]),configurable:!0}),Oe(t[r])):t[r]}}):n}function Ye(n){return n?.constructor===Object}function Ne(...n){let e=[...n],t=typeof e[0]=="function"?{}:e.shift(),r=e;return(()=>{class i{constructor(){let c=r.reduce((l,d)=>d(l),Ze()),{stateSignals:a,computedSignals:p,methods:y,hooks:g}=c,b=h(h(h({},a),p),y);this[R]=t.protectedState===!1?c[R]:c[R].asReadonly();for(let l in b)this[l]=b[l];let{onInit:u,onDestroy:E}=g;u&&u(),E&&f(ve).onDestroy(E)}static \u0275fac=function(a){return new(a||i)};static \u0275prov=T({token:i,factory:i.\u0275fac,providedIn:t.providedIn||null})}return i})()}function Ze(){return{[R]:Se({}),stateSignals:{},computedSignals:{},methods:{},hooks:{}}}function ke(n){return e=>{let t=n(h(h({},e.stateSignals),e.computedSignals));return Object.keys(t),U(h({},e),{computedSignals:h(h({},e.computedSignals),t)})}}function Me(n){return e=>{let t=n(h(h(h({[R]:e[R]},e.stateSignals),e.computedSignals),e.methods));return Object.keys(t),U(h({},e),{methods:h(h({},e.methods),t)})}}function xe(n){return e=>{let t=typeof n=="function"?n():n,r=Object.keys(t);e[R].update(i=>h(h({},i),t));let s=r.reduce((i,o)=>{let c=v(()=>e[R]()[o]);return U(h({},i),{[o]:Oe(c)})},{});return U(h({},e),{stateSignals:h(h({},e.stateSignals),s)})}}var Qe={speechToken:{token:"",region:""},streamId:"",recording:"Stopped",streamingStatus:"Stopped",streamReady:!1},W=Ne({providedIn:"root",protectedState:!0},xe(Qe),ke(({streamId:n,speechToken:e,recording:t,streamingStatus:r})=>({hasToken:v(()=>!!e().token),hasRegion:v(()=>!!e().region),isRecordingStarted:v(()=>t()==="Started"),isRecordingStopped:v(()=>t()==="Stopped"),isRecordingLoading:v(()=>t()==="InProgress"),hasStream:v(()=>!!n()),isStreamStarted:v(()=>r()==="Started"),isStreamStopped:v(()=>r()==="Stopped"),isStreamLoading:v(()=>r()==="InProgress")})),Me(n=>({updateSpeechToken:(e={token:"",region:""})=>{M(n,{speechToken:e})},updateStreamId:e=>{M(n,{streamId:e})},recordingStarted:()=>{M(n,{recording:"Started"})},recordingStopped:()=>{M(n,{recording:"Stopped"})},recordingInProgress:()=>{M(n,{recording:"InProgress"})},updateStreamStatus:(e="Stopped")=>{M(n,{streamingStatus:e})}})));var B=class{},z=class{},w=class n{constructor(e){this.normalizedNames=new Map,this.lazyUpdate=null,e?typeof e=="string"?this.lazyInit=()=>{this.headers=new Map,e.split(`
`).forEach(t=>{let r=t.indexOf(":");if(r>0){let s=t.slice(0,r),i=s.toLowerCase(),o=t.slice(r+1).trim();this.maybeSetNormalizedName(s,i),this.headers.has(i)?this.headers.get(i).push(o):this.headers.set(i,[o])}})}:typeof Headers<"u"&&e instanceof Headers?(this.headers=new Map,e.forEach((t,r)=>{this.setHeaderEntries(r,t)})):this.lazyInit=()=>{this.headers=new Map,Object.entries(e).forEach(([t,r])=>{this.setHeaderEntries(t,r)})}:this.headers=new Map}has(e){return this.init(),this.headers.has(e.toLowerCase())}get(e){this.init();let t=this.headers.get(e.toLowerCase());return t&&t.length>0?t[0]:null}keys(){return this.init(),Array.from(this.normalizedNames.values())}getAll(e){return this.init(),this.headers.get(e.toLowerCase())||null}append(e,t){return this.clone({name:e,value:t,op:"a"})}set(e,t){return this.clone({name:e,value:t,op:"s"})}delete(e,t){return this.clone({name:e,value:t,op:"d"})}maybeSetNormalizedName(e,t){this.normalizedNames.has(t)||this.normalizedNames.set(t,e)}init(){this.lazyInit&&(this.lazyInit instanceof n?this.copyFrom(this.lazyInit):this.lazyInit(),this.lazyInit=null,this.lazyUpdate&&(this.lazyUpdate.forEach(e=>this.applyUpdate(e)),this.lazyUpdate=null))}copyFrom(e){e.init(),Array.from(e.headers.keys()).forEach(t=>{this.headers.set(t,e.headers.get(t)),this.normalizedNames.set(t,e.normalizedNames.get(t))})}clone(e){let t=new n;return t.lazyInit=this.lazyInit&&this.lazyInit instanceof n?this.lazyInit:this,t.lazyUpdate=(this.lazyUpdate||[]).concat([e]),t}applyUpdate(e){let t=e.name.toLowerCase();switch(e.op){case"a":case"s":let r=e.value;if(typeof r=="string"&&(r=[r]),r.length===0)return;this.maybeSetNormalizedName(e.name,t);let s=(e.op==="a"?this.headers.get(t):void 0)||[];s.push(...r),this.headers.set(t,s);break;case"d":let i=e.value;if(!i)this.headers.delete(t),this.normalizedNames.delete(t);else{let o=this.headers.get(t);if(!o)return;o=o.filter(c=>i.indexOf(c)===-1),o.length===0?(this.headers.delete(t),this.normalizedNames.delete(t)):this.headers.set(t,o)}break}}setHeaderEntries(e,t){let r=(Array.isArray(t)?t:[t]).map(i=>i.toString()),s=e.toLowerCase();this.headers.set(s,r),this.maybeSetNormalizedName(e,s)}forEach(e){this.init(),Array.from(this.normalizedNames.keys()).forEach(t=>e(this.normalizedNames.get(t),this.headers.get(t)))}};var te=class{encodeKey(e){return De(e)}encodeValue(e){return De(e)}decodeKey(e){return decodeURIComponent(e)}decodeValue(e){return decodeURIComponent(e)}};function He(n,e){let t=new Map;return n.length>0&&n.replace(/^\?/,"").split("&").forEach(s=>{let i=s.indexOf("="),[o,c]=i==-1?[e.decodeKey(s),""]:[e.decodeKey(s.slice(0,i)),e.decodeValue(s.slice(i+1))],a=t.get(o)||[];a.push(c),t.set(o,a)}),t}var et=/%(\d[a-f0-9])/gi,tt={40:"@","3A":":",24:"$","2C":",","3B":";","3D":"=","3F":"?","2F":"/"};function De(n){return encodeURIComponent(n).replace(et,(e,t)=>tt[t]??e)}function G(n){return`${n}`}var I=class n{constructor(e={}){if(this.updates=null,this.cloneFrom=null,this.encoder=e.encoder||new te,e.fromString){if(e.fromObject)throw new Error("Cannot specify both fromString and fromObject.");this.map=He(e.fromString,this.encoder)}else e.fromObject?(this.map=new Map,Object.keys(e.fromObject).forEach(t=>{let r=e.fromObject[t],s=Array.isArray(r)?r.map(G):[G(r)];this.map.set(t,s)})):this.map=null}has(e){return this.init(),this.map.has(e)}get(e){this.init();let t=this.map.get(e);return t?t[0]:null}getAll(e){return this.init(),this.map.get(e)||null}keys(){return this.init(),Array.from(this.map.keys())}append(e,t){return this.clone({param:e,value:t,op:"a"})}appendAll(e){let t=[];return Object.keys(e).forEach(r=>{let s=e[r];Array.isArray(s)?s.forEach(i=>{t.push({param:r,value:i,op:"a"})}):t.push({param:r,value:s,op:"a"})}),this.clone(t)}set(e,t){return this.clone({param:e,value:t,op:"s"})}delete(e,t){return this.clone({param:e,value:t,op:"d"})}toString(){return this.init(),this.keys().map(e=>{let t=this.encoder.encodeKey(e);return this.map.get(e).map(r=>t+"="+this.encoder.encodeValue(r)).join("&")}).filter(e=>e!=="").join("&")}clone(e){let t=new n({encoder:this.encoder});return t.cloneFrom=this.cloneFrom||this,t.updates=(this.updates||[]).concat(e),t}init(){this.map===null&&(this.map=new Map),this.cloneFrom!==null&&(this.cloneFrom.init(),this.cloneFrom.keys().forEach(e=>this.map.set(e,this.cloneFrom.map.get(e))),this.updates.forEach(e=>{switch(e.op){case"a":case"s":let t=(e.op==="a"?this.map.get(e.param):void 0)||[];t.push(G(e.value)),this.map.set(e.param,t);break;case"d":if(e.value!==void 0){let r=this.map.get(e.param)||[],s=r.indexOf(G(e.value));s!==-1&&r.splice(s,1),r.length>0?this.map.set(e.param,r):this.map.delete(e.param)}else{this.map.delete(e.param);break}}}),this.cloneFrom=this.updates=null)}};var ne=class{constructor(){this.map=new Map}set(e,t){return this.map.set(e,t),this}get(e){return this.map.has(e)||this.map.set(e,e.defaultValue()),this.map.get(e)}delete(e){return this.map.delete(e),this}has(e){return this.map.has(e)}keys(){return this.map.keys()}};function nt(n){switch(n){case"DELETE":case"GET":case"HEAD":case"OPTIONS":case"JSONP":return!1;default:return!0}}function Le(n){return typeof ArrayBuffer<"u"&&n instanceof ArrayBuffer}function je(n){return typeof Blob<"u"&&n instanceof Blob}function Ue(n){return typeof FormData<"u"&&n instanceof FormData}function rt(n){return typeof URLSearchParams<"u"&&n instanceof URLSearchParams}var C=class n{constructor(e,t,r,s){this.url=t,this.body=null,this.reportProgress=!1,this.withCredentials=!1,this.responseType="json",this.method=e.toUpperCase();let i;if(nt(this.method)||s?(this.body=r!==void 0?r:null,i=s):i=r,i&&(this.reportProgress=!!i.reportProgress,this.withCredentials=!!i.withCredentials,i.responseType&&(this.responseType=i.responseType),i.headers&&(this.headers=i.headers),i.context&&(this.context=i.context),i.params&&(this.params=i.params),this.transferCache=i.transferCache),this.headers??=new w,this.context??=new ne,!this.params)this.params=new I,this.urlWithParams=t;else{let o=this.params.toString();if(o.length===0)this.urlWithParams=t;else{let c=t.indexOf("?"),a=c===-1?"?":c<t.length-1?"&":"";this.urlWithParams=t+a+o}}}serializeBody(){return this.body===null?null:typeof this.body=="string"||Le(this.body)||je(this.body)||Ue(this.body)||rt(this.body)?this.body:this.body instanceof I?this.body.toString():typeof this.body=="object"||typeof this.body=="boolean"||Array.isArray(this.body)?JSON.stringify(this.body):this.body.toString()}detectContentTypeHeader(){return this.body===null||Ue(this.body)?null:je(this.body)?this.body.type||null:Le(this.body)?null:typeof this.body=="string"?"text/plain":this.body instanceof I?"application/x-www-form-urlencoded;charset=UTF-8":typeof this.body=="object"||typeof this.body=="number"||typeof this.body=="boolean"?"application/json":null}clone(e={}){let t=e.method||this.method,r=e.url||this.url,s=e.responseType||this.responseType,i=e.transferCache??this.transferCache,o=e.body!==void 0?e.body:this.body,c=e.withCredentials??this.withCredentials,a=e.reportProgress??this.reportProgress,p=e.headers||this.headers,y=e.params||this.params,g=e.context??this.context;return e.setHeaders!==void 0&&(p=Object.keys(e.setHeaders).reduce((b,u)=>b.set(u,e.setHeaders[u]),p)),e.setParams&&(y=Object.keys(e.setParams).reduce((b,u)=>b.set(u,e.setParams[u]),y)),new n(t,r,o,{params:y,headers:p,context:g,reportProgress:a,responseType:s,withCredentials:c,transferCache:i})}},O=function(n){return n[n.Sent=0]="Sent",n[n.UploadProgress=1]="UploadProgress",n[n.ResponseHeader=2]="ResponseHeader",n[n.DownloadProgress=3]="DownloadProgress",n[n.Response=4]="Response",n[n.User=5]="User",n}(O||{}),V=class{constructor(e,t=200,r="OK"){this.headers=e.headers||new w,this.status=e.status!==void 0?e.status:t,this.statusText=e.statusText||r,this.url=e.url||null,this.ok=this.status>=200&&this.status<300}},K=class n extends V{constructor(e={}){super(e),this.type=O.ResponseHeader}clone(e={}){return new n({headers:e.headers||this.headers,status:e.status!==void 0?e.status:this.status,statusText:e.statusText||this.statusText,url:e.url||this.url||void 0})}},X=class n extends V{constructor(e={}){super(e),this.type=O.Response,this.body=e.body!==void 0?e.body:null}clone(e={}){return new n({body:e.body!==void 0?e.body:this.body,headers:e.headers||this.headers,status:e.status!==void 0?e.status:this.status,statusText:e.statusText||this.statusText,url:e.url||this.url||void 0})}},A=class extends V{constructor(e){super(e,0,"Unknown Error"),this.name="HttpErrorResponse",this.ok=!1,this.status>=200&&this.status<300?this.message=`Http failure during parsing for ${e.url||"(unknown url)"}`:this.message=`Http failure response for ${e.url||"(unknown url)"}: ${e.status} ${e.statusText}`,this.error=e.error||null}},Be=200,st=204;function ee(n,e){return{body:e,headers:n.headers,context:n.context,observe:n.observe,params:n.params,reportProgress:n.reportProgress,responseType:n.responseType,withCredentials:n.withCredentials,transferCache:n.transferCache}}var J=(()=>{class n{constructor(t){this.handler=t}request(t,r,s={}){let i;if(t instanceof C)i=t;else{let a;s.headers instanceof w?a=s.headers:a=new w(s.headers);let p;s.params&&(s.params instanceof I?p=s.params:p=new I({fromObject:s.params})),i=new C(t,r,s.body!==void 0?s.body:null,{headers:a,context:s.context,params:p,reportProgress:s.reportProgress,responseType:s.responseType||"json",withCredentials:s.withCredentials,transferCache:s.transferCache})}let o=Q(i).pipe(ue(a=>this.handler.handle(a)));if(t instanceof C||s.observe==="events")return o;let c=o.pipe(he(a=>a instanceof X));switch(s.observe||"body"){case"body":switch(i.responseType){case"arraybuffer":return c.pipe(F(a=>{if(a.body!==null&&!(a.body instanceof ArrayBuffer))throw new Error("Response is not an ArrayBuffer.");return a.body}));case"blob":return c.pipe(F(a=>{if(a.body!==null&&!(a.body instanceof Blob))throw new Error("Response is not a Blob.");return a.body}));case"text":return c.pipe(F(a=>{if(a.body!==null&&typeof a.body!="string")throw new Error("Response is not a string.");return a.body}));case"json":default:return c.pipe(F(a=>a.body))}case"response":return c;default:throw new Error(`Unreachable: unhandled observe type ${s.observe}}`)}}delete(t,r={}){return this.request("DELETE",t,r)}get(t,r={}){return this.request("GET",t,r)}head(t,r={}){return this.request("HEAD",t,r)}jsonp(t,r){return this.request("JSONP",t,{params:new I().append(r,"JSONP_CALLBACK"),observe:"body",responseType:"json"})}options(t,r={}){return this.request("OPTIONS",t,r)}patch(t,r,s={}){return this.request("PATCH",t,ee(s,r))}post(t,r,s={}){return this.request("POST",t,ee(s,r))}put(t,r,s={}){return this.request("PUT",t,ee(s,r))}static{this.\u0275fac=function(r){return new(r||n)(P(B))}}static{this.\u0275prov=T({token:n,factory:n.\u0275fac})}}return n})(),ot=/^\)\]\}',?\n/,it="X-Request-URL";function Fe(n){if(n.url)return n.url;let e=it.toLocaleLowerCase();return n.headers.get(e)}var re=(()=>{class n{constructor(){this.fetchImpl=f(se,{optional:!0})?.fetch??((...t)=>globalThis.fetch(...t)),this.ngZone=f(be)}handle(t){return new Z(r=>{let s=new AbortController;return this.doRequest(t,s.signal,r).then(oe,i=>r.error(new A({error:i}))),()=>s.abort()})}doRequest(t,r,s){return Y(this,null,function*(){let i=this.createRequestInit(t),o;try{let u=this.ngZone.runOutsideAngular(()=>this.fetchImpl(t.urlWithParams,h({signal:r},i)));at(u),s.next({type:O.Sent}),o=yield u}catch(u){s.error(new A({error:u,status:u.status??0,statusText:u.statusText,url:t.urlWithParams,headers:u.headers}));return}let c=new w(o.headers),a=o.statusText,p=Fe(o)??t.urlWithParams,y=o.status,g=null;if(t.reportProgress&&s.next(new K({headers:c,status:y,statusText:a,url:p})),o.body){let u=o.headers.get("content-length"),E=[],l=o.body.getReader(),d=0,S,x,m=typeof Zone<"u"&&Zone.current;yield this.ngZone.runOutsideAngular(()=>Y(this,null,function*(){for(;;){let{done:N,value:j}=yield l.read();if(N)break;if(E.push(j),d+=j.length,t.reportProgress){x=t.responseType==="text"?(x??"")+(S??=new TextDecoder).decode(j,{stream:!0}):void 0;let ce=()=>s.next({type:O.DownloadProgress,total:u?+u:void 0,loaded:d,partialText:x});m?m.run(ce):ce()}}}));let L=this.concatChunks(E,d);try{let N=o.headers.get("Content-Type")??"";g=this.parseBody(t,L,N)}catch(N){s.error(new A({error:N,headers:new w(o.headers),status:o.status,statusText:o.statusText,url:Fe(o)??t.urlWithParams}));return}}y===0&&(y=g?Be:0),y>=200&&y<300?(s.next(new X({body:g,headers:c,status:y,statusText:a,url:p})),s.complete()):s.error(new A({error:g,headers:c,status:y,statusText:a,url:p}))})}parseBody(t,r,s){switch(t.responseType){case"json":let i=new TextDecoder().decode(r).replace(ot,"");return i===""?null:JSON.parse(i);case"text":return new TextDecoder().decode(r);case"blob":return new Blob([r],{type:s});case"arraybuffer":return r.buffer}}createRequestInit(t){let r={},s=t.withCredentials?"include":void 0;if(t.headers.forEach((i,o)=>r[i]=o.join(",")),t.headers.has("Accept")||(r.Accept="application/json, text/plain, */*"),!t.headers.has("Content-Type")){let i=t.detectContentTypeHeader();i!==null&&(r["Content-Type"]=i)}return{body:t.serializeBody(),method:t.method,headers:r,credentials:s}}concatChunks(t,r){let s=new Uint8Array(r),i=0;for(let o of t)s.set(o,i),i+=o.length;return s}static{this.\u0275fac=function(r){return new(r||n)}}static{this.\u0275prov=T({token:n,factory:n.\u0275fac})}}return n})(),se=class{};function oe(){}function at(n){n.then(oe,oe)}function ct(n,e){return e(n)}function lt(n,e,t){return(r,s)=>Te(t,()=>e(r,i=>n(i,s)))}var ie=new k(""),dt=new k(""),ht=new k("",{providedIn:"root",factory:()=>!0});var _e=(()=>{class n extends B{constructor(t,r){super(),this.backend=t,this.injector=r,this.chain=null,this.pendingTasks=f(Re),this.contributeToStability=f(ht)}handle(t){if(this.chain===null){let r=Array.from(new Set([...this.injector.get(ie),...this.injector.get(dt,[])]));this.chain=r.reduceRight((s,i)=>lt(s,i,this.injector),ct)}if(this.contributeToStability){let r=this.pendingTasks.add();return this.chain(t,s=>this.backend.handle(s)).pipe(fe(()=>this.pendingTasks.remove(r)))}else return this.chain(t,r=>this.backend.handle(r))}static{this.\u0275fac=function(r){return new(r||n)(P(z),P(ge))}}static{this.\u0275prov=T({token:n,factory:n.\u0275fac})}}return n})();var ut=/^\)\]\}',?\n/;function ft(n){return"responseURL"in n&&n.responseURL?n.responseURL:/^X-Request-URL:/m.test(n.getAllResponseHeaders())?n.getResponseHeader("X-Request-URL"):null}var Ce=(()=>{class n{constructor(t){this.xhrFactory=t}handle(t){if(t.method==="JSONP")throw new me(-2800,!1);let r=this.xhrFactory;return(r.\u0275loadImpl?de(r.\u0275loadImpl()):Q(null)).pipe(pe(()=>new Z(i=>{let o=r.build();if(o.open(t.method,t.urlWithParams),t.withCredentials&&(o.withCredentials=!0),t.headers.forEach((l,d)=>o.setRequestHeader(l,d.join(","))),t.headers.has("Accept")||o.setRequestHeader("Accept","application/json, text/plain, */*"),!t.headers.has("Content-Type")){let l=t.detectContentTypeHeader();l!==null&&o.setRequestHeader("Content-Type",l)}if(t.responseType){let l=t.responseType.toLowerCase();o.responseType=l!=="json"?l:"text"}let c=t.serializeBody(),a=null,p=()=>{if(a!==null)return a;let l=o.statusText||"OK",d=new w(o.getAllResponseHeaders()),S=ft(o)||t.url;return a=new K({headers:d,status:o.status,statusText:l,url:S}),a},y=()=>{let{headers:l,status:d,statusText:S,url:x}=p(),m=null;d!==st&&(m=typeof o.response>"u"?o.responseText:o.response),d===0&&(d=m?Be:0);let L=d>=200&&d<300;if(t.responseType==="json"&&typeof m=="string"){let N=m;m=m.replace(ut,"");try{m=m!==""?JSON.parse(m):null}catch(j){m=N,L&&(L=!1,m={error:j,text:m})}}L?(i.next(new X({body:m,headers:l,status:d,statusText:S,url:x||void 0})),i.complete()):i.error(new A({error:m,headers:l,status:d,statusText:S,url:x||void 0}))},g=l=>{let{url:d}=p(),S=new A({error:l,status:o.status||0,statusText:o.statusText||"Unknown Error",url:d||void 0});i.error(S)},b=!1,u=l=>{b||(i.next(p()),b=!0);let d={type:O.DownloadProgress,loaded:l.loaded};l.lengthComputable&&(d.total=l.total),t.responseType==="text"&&o.responseText&&(d.partialText=o.responseText),i.next(d)},E=l=>{let d={type:O.UploadProgress,loaded:l.loaded};l.lengthComputable&&(d.total=l.total),i.next(d)};return o.addEventListener("load",y),o.addEventListener("error",g),o.addEventListener("timeout",g),o.addEventListener("abort",g),t.reportProgress&&(o.addEventListener("progress",u),c!==null&&o.upload&&o.upload.addEventListener("progress",E)),o.send(c),i.next({type:O.Sent}),()=>{o.removeEventListener("error",g),o.removeEventListener("abort",g),o.removeEventListener("load",y),o.removeEventListener("timeout",g),t.reportProgress&&(o.removeEventListener("progress",u),c!==null&&o.upload&&o.upload.removeEventListener("progress",E)),o.readyState!==o.DONE&&o.abort()}})))}static{this.\u0275fac=function(r){return new(r||n)(P(Ie))}}static{this.\u0275prov=T({token:n,factory:n.\u0275fac})}}return n})(),ze=new k(""),pt="XSRF-TOKEN",mt=new k("",{providedIn:"root",factory:()=>pt}),yt="X-XSRF-TOKEN",gt=new k("",{providedIn:"root",factory:()=>yt}),q=class{},Tt=(()=>{class n{constructor(t,r,s){this.doc=t,this.platform=r,this.cookieName=s,this.lastCookieString="",this.lastToken=null,this.parseCount=0}getToken(){if(this.platform==="server")return null;let t=this.doc.cookie||"";return t!==this.lastCookieString&&(this.parseCount++,this.lastToken=Ae(t,this.cookieName),this.lastCookieString=t),this.lastToken}static{this.\u0275fac=function(r){return new(r||n)(P(Pe),P(we),P(mt))}}static{this.\u0275prov=T({token:n,factory:n.\u0275fac})}}return n})();function vt(n,e){let t=n.url.toLowerCase();if(!f(ze)||n.method==="GET"||n.method==="HEAD"||t.startsWith("http://")||t.startsWith("https://"))return e(n);let r=f(q).getToken(),s=f(gt);return r!=null&&!n.headers.has(s)&&(n=n.clone({headers:n.headers.set(s,r)})),e(n)}var ae=function(n){return n[n.Interceptors=0]="Interceptors",n[n.LegacyInterceptors=1]="LegacyInterceptors",n[n.CustomXsrfConfiguration=2]="CustomXsrfConfiguration",n[n.NoXsrfProtection=3]="NoXsrfProtection",n[n.JsonpSupport=4]="JsonpSupport",n[n.RequestsMadeViaParent=5]="RequestsMadeViaParent",n[n.Fetch=6]="Fetch",n}(ae||{});function Ve(n,e){return{\u0275kind:n,\u0275providers:e}}function Zt(...n){let e=[J,Ce,_e,{provide:B,useExisting:_e},{provide:z,useFactory:()=>f(re,{optional:!0})??f(Ce)},{provide:ie,useValue:vt,multi:!0},{provide:ze,useValue:!0},{provide:q,useClass:Tt}];for(let t of n)e.push(...t.\u0275providers);return ye(e)}function Qt(n){return Ve(ae.Interceptors,n.map(e=>({provide:ie,useValue:e,multi:!0})))}function Ht(){return Ve(ae.Fetch,[re,{provide:z,useExisting:re}])}var Xe={BASE_URL:"",SPEECH_TOKEN:"common/speech/token",CHAT:"website/chat",AVATAR:"common/avatar"};var D=class n{urls=Xe;URLS={};config;static hasTrailingSlash(e){return(e+"").indexOf("/")===(e+"").length-1}static hasPrefixSlash(e){return(e+"").indexOf("/")===0}static removeTrailingSlash(e){return n.hasTrailingSlash(e)?(e+"").substring(0,(e+"").length-1):e}static removePrefixSlash(e){return n.hasPrefixSlash(e)?n.removePrefixSlash((e+"").substring(1,(e+"").length)):e}prepareUrls(){this.URLS.BASE_URL=n.removeTrailingSlash(this.config.BASE_URL);for(let e in this.urls)e!=="BASE_URL"&&Object.prototype.hasOwnProperty.call(this.urls,e)&&(this.URLS[e]=this.addBaseUrl(this.urls[e]));return this.URLS}addBaseUrl(e){return(this.config.CONFIG.EXTERNAL_PROTOCOLS??[]).some(r=>e.toLowerCase().indexOf(r)===0)?e:this.URLS.BASE_URL+"/"+n.removePrefixSlash(e)}setConfigService(e){this.config=e}static \u0275fac=function(t){return new(t||n)};static \u0275prov=T({token:n,factory:n.\u0275fac,providedIn:"root"})};var Je=class n{urlService=f(D);http=f(J);store=f(W);startStream(){return this.http.post(this.urlService.URLS.AVATAR+"/start-stream",{},{params:{size:"life-size"}}).pipe(_(e=>this.store.updateStreamId(e.data.id)))}closeStream(){let e=this.store.streamId();return this.store.updateStreamId(""),this.http.delete(this.urlService.URLS.AVATAR+`/close-stream/${e}`)}sendCandidate(e){return this.http.post(this.urlService.URLS.AVATAR+`/send-candidate/${this.store.streamId()}`,{candidate:e})}sendAnswer(e){return this.http.put(this.urlService.URLS.AVATAR+`/send-answer/${this.store.streamId()}`,{answer:e})}interruptAvatar(){return this.http.delete(this.urlService.URLS.AVATAR+`/stop-render/${this.store.streamId()}`)}renderText(){return this.http.post(this.urlService.URLS.AVATAR+`/render-text/${this.store.streamId()}`,{})}static \u0275fac=function(t){return new(t||n)};static \u0275prov=T({token:n,factory:n.\u0275fac,providedIn:"root"})};var $e=class n{http=f(J);urlService=f(D);appStore=f(W);generateSpeechToken(){return this.http.get(this.urlService.URLS.SPEECH_TOKEN).pipe(_(e=>this.appStore.updateSpeechToken(e)))}static \u0275fac=function(t){return new(t||n)};static \u0275prov=T({token:n,factory:n.\u0275fac,providedIn:"root"})};export{J as a,Zt as b,Qt as c,Ht as d,W as e,D as f,Je as g,$e as h};