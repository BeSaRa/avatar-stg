import{a as A}from"./chunk-V32KLUJ4.js";import{b as i,e as h}from"./chunk-DCSLL5ZG.js";import{B as o,C as c,ka as p,qa as s}from"./chunk-IAZQTHFA.js";var l=class n{urlServices=s(A);http=s(h);getQuestions(e,t="website"){let r=`${this.urlServices.URLS.FAQ}/faqs/archive`,a=new i().append("limit",e).append("bot_name",t);return this.http.get(r,{params:a})}get archiveUrl(){return`${this.urlServices.URLS.FAQ_ARCHIEVE}`}getAllFAQs(e){let t=`${this.urlServices.URLS.FAQ}/faqs`,r=new i().append("bot_name",e);return this.http.get(t,{params:r})}getArchivedFAQs(e,t){let r=new i().append("bot_name",e);return t&&(r=r.append("limit",t)),this.http.get(this.archiveUrl,{params:r})}addToArchivedFAQs(e,t){let r=new i().append("bot_name",e);return this.http.post(this.archiveUrl,t,{params:r})}updateArchivedFAQs(e,t){let r=new i().append("row_key",e);return this.http.put(this.archiveUrl,t,{params:r})}deleteFAQBulk(e,t){let r=new i().append("bot_name",e);return this.http.delete(this.archiveUrl,{body:t,params:r})}getUnArchivedFAQs(e){let t=this.getAllFAQs(e),r=this.getArchivedFAQs(e);return c([t,r]).pipe(o(([a,m])=>a.filter(d=>!m.some(v=>d.RowKey===v.RowKey))))}static \u0275fac=function(t){return new(t||n)};static \u0275prov=p({token:n,factory:n.\u0275fac,providedIn:"root"})};export{l as a};
