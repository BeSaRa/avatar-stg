import{a as y}from"./chunk-EAWFRFEO.js";import"./chunk-6STCOJXD.js";import"./chunk-JTTZ5JU3.js";import{a as l}from"./chunk-ZBTDYPAT.js";import"./chunk-MKDINXEF.js";import{g as x}from"./chunk-AAWQFIIT.js";import"./chunk-33B2ENUU.js";import"./chunk-QVKAK5EM.js";import"./chunk-K34XQGTR.js";import"./chunk-OK5S6IU3.js";import{b as C}from"./chunk-XS2U3F55.js";import"./chunk-IBZOQCW6.js";import{Cc as A,Ga as d,Ha as g,Xb as t,Yb as a,Zb as u,ec as v,ob as i,qa as p,ua as f,uc as o,vc as r,wc as h}from"./chunk-3MLM6FP2.js";var m=class e{lang=p(C);chatService=p(y);toggleChat(){this.chatService.status.update(c=>!c)}static \u0275fac=function(s){return new(s||e)};static \u0275cmp=f({type:e,selectors:[["app-landing"]],standalone:!0,features:[A],decls:26,vars:7,consts:[[1,"flex","flex-col"],[1,"text-3xl","text-center","mt-10"],[1,"flex","flex-col","md:flex-row","w-full","gap-4","mt-10"],[1,"border","rounded-md","overflow-hidden","flex","flex-auto","md:basis-0","flex-col"],[1,"text-primary","bg-gray-200","py-2","px-4","flex","justify-between","items-center"],["fill","currentColor","xmlns","http://www.w3.org/2000/svg","viewBox","0 0 24 24",1,"size-6"],["d","M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"],[1,"p-4","flex","flex-col","gap-4","flex-auto"],[1,"flex-auto"],[1,"bg-gray-200","p-2","rounded-md","text-primary","hover:bg-gray-300","active:bg-gray-400","mt-auto",3,"click"],["xmlns","http://www.w3.org/2000/svg","fill","currentColor","viewBox","0 0 256 256",1,"size-6"],["d","M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"],["routerLink","search",1,"bg-gray-200","p-2","rounded-md","text-primary","hover:bg-gray-300","active:bg-gray-400","mt-auto"]],template:function(s,n){s&1&&(t(0,"div",0)(1,"h1",1),o(2),a(),t(3,"div",2)(4,"div",3)(5,"div",4)(6,"h1"),o(7),a(),d(),t(8,"svg",5),u(9,"path",6),a()(),g(),t(10,"div",7)(11,"p",8),o(12),a(),t(13,"button",9),v("click",function(){return n.toggleChat()}),o(14),a()()(),t(15,"div",3)(16,"div",4)(17,"h1"),o(18),a(),d(),t(19,"svg",10),u(20,"path",11),a()(),g(),t(21,"div",7)(22,"p",8),o(23),a(),t(24,"button",12),o(25),a()()()()()),s&2&&(i(2),r(n.lang.locals.welcome_message),i(5),r(n.lang.locals.chat),i(5),r(n.lang.locals.chat_description),i(2),h(" ",n.lang.locals.try_it_out," "),i(4),r(n.lang.locals.search),i(5),r(n.lang.locals.document_search_description),i(2),h(" ",n.lang.locals.try_it_out," "))},dependencies:[x]})};var w=[{path:"",component:m},{path:"search",loadComponent:()=>import("./chunk-FEEWSDO2.js").then(e=>e.AiSearchComponent),canActivate:[l.canActivate],data:{permissions:["SEARCH"],hasAnyPermission:!1}},{path:"chat-history",loadComponent:()=>import("./chunk-6LZ324Q5.js").then(e=>e.ChatHistoryComponent),canActivate:[l.canActivate],data:{permissions:["CHATBOT"],hasAnyPermission:!1}},{path:"web-crawler",loadComponent:()=>import("./chunk-NWDBDWA2.js").then(e=>e.WebCrawlerReportComponent),canActivate:[l.canActivate],data:{permissions:["SEARCH"],hasAnyPermission:!1}},{path:"statistics",loadComponent:()=>import("./chunk-3LX3NA5T.js").then(e=>e.StatisticsComponent)},{path:"admin",loadChildren:()=>import("./chunk-DKOKMPWR.js"),canActivate:[l.canActivate],data:{permissions:["ADMIN"],hasAnyPermission:!0}},{path:"**",redirectTo:""}],V=w;export{V as default};
