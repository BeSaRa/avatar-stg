import{r as y}from"./chunk-VFJQQNNL.js";import{a as M}from"./chunk-QZSOFLIB.js";import{b as _}from"./chunk-XS2U3F55.js";import"./chunk-IBZOQCW6.js";import{B as u,Cc as L,Ga as h,Hc as g,Ic as C,Jb as d,Nb as x,Sb as m,Xb as i,Yb as n,Zb as r,ld as S,ob as a,qa as f,ua as w,uc as l,vc as c}from"./chunk-3MLM6FP2.js";function k(e,t){if(e&1&&(i(0,"div",2)(1,"h2",7),l(2),n(),i(3,"div",8),r(4,"canvas",9),n()()),e&2){let o=t;a(2),c(o.title),a(2),x("type",o.chart.type)("datasets",o.chart.data.datasets)("labels",o.chart.data.labels)("options",o.chart.options)}}function V(e,t){e&1&&(i(0,"div",2),r(1,"div",10)(2,"div",11),n())}function H(e,t){e&1&&(i(0,"p",12),l(1),n(),h(),i(2,"svg",13),r(3,"g",14)(4,"g",15),i(5,"g",16),r(6,"path",17)(7,"path",18)(8,"path",19)(9,"path",20),n()()),e&2&&(a(),c(t))}function E(e,t){e&1&&r(0,"div",6)}function P(e,t){e&1&&(i(0,"p",12),l(1),n(),h(),i(2,"svg",21),r(3,"g",14)(4,"g",15),i(5,"g",16)(6,"title"),l(7,"url [#bfbfbf]"),n(),i(8,"desc"),l(9,"Created with Sketch."),n(),r(10,"defs"),i(11,"g",22)(12,"g",23)(13,"g",24),r(14,"path",25),n()()()()()),e&2&&(a(),c(t))}function O(e,t){e&1&&r(0,"div",6)}var Z=class e{lang=f(_);adminService=f(M);reportCount$=this.adminService.getReportsCount();urlCount$=this.adminService.getUrlsCount();crawlingStatistics$=this.adminService.getCrawlingStatistics().pipe(u(t=>({title:this.lang.locals.web_crawling_stats,chart:this.getChartConfig(t)})));getChartConfig(t){return{type:"bar",data:this.calculateArticleDistribution(t),options:this.getChartOptions()}}calculateArticleDistribution(t){let o=[],s=[];for(let p in t)Object.prototype.hasOwnProperty.call(t,p)&&(o.push(p),s.push(t[p].length));return{labels:o,datasets:[{label:this.lang.locals.links_count,data:s,backgroundColor:"rgba(138, 21, 56, 0.5)",borderColor:"rgba(138, 21, 56)",borderWidth:2}]}}getChartOptions(){return{responsive:!0,indexAxis:"y",scales:{x:{beginAtZero:!0},y:{ticks:{font:{size:12}}}}}}static \u0275fac=function(o){return new(o||e)};static \u0275cmp=w({type:e,selectors:[["app-statistics"]],standalone:!0,features:[L],decls:18,vars:11,consts:[[1,"w-full","mx-auto","p-6"],[1,"grid","grid-cols-1","md:grid-cols-3","gap-6"],[1,"col-span-2","p-8","bg-white","rounded-2xl","shadow-lg","border","border-gray-200"],[1,"flex","flex-col","gap-6"],[1,"counter"],[1,"text-gray-700","text-lg","font-semibold"],[1,"h-10","bg-gray-300","rounded","animate-pulse","mt-2"],[1,"text-2xl","font-semibold","text-gray-700","mb-4"],[2,"display","block"],["baseChart","",1,"max-h-80",3,"type","datasets","labels","options"],[1,"h-10","bg-gray-300","rounded","animate-pulse","mb-4"],[1,"h-80","bg-gray-300","rounded","animate-pulse"],[1,"text-gray-900","text-4xl","font-bold","mt-2"],["viewBox","0 0 24 24","fill","none","xmlns","http://www.w3.org/2000/svg",1,"cover-svg"],["id","SVGRepo_bgCarrier","stroke-width","0"],["id","SVGRepo_tracerCarrier","stroke-linecap","round","stroke-linejoin","round"],["id","SVGRepo_iconCarrier"],["d","M6 14.5H14","stroke","#bfbfbf","stroke-width","1.5","stroke-linecap","round"],["d","M6 18H11.5","stroke","#bfbfbf","stroke-width","1.5","stroke-linecap","round"],["d","M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22","stroke","#bfbfbf","stroke-width","1.5"],["d","M2.75 10C2.75 9.58579 2.41421 9.25 2 9.25C1.58579 9.25 1.25 9.58579 1.25 10H2.75ZM21.25 14C21.25 14.4142 21.5858 14.75 22 14.75C22.4142 14.75 22.75 14.4142 22.75 14H21.25ZM15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM1.35509 5.92658C1.31455 6.33881 1.61585 6.70585 2.02807 6.7464C2.4403 6.78695 2.80734 6.48564 2.84789 6.07342L1.35509 5.92658ZM22.6449 18.0734C22.6855 17.6612 22.3841 17.2941 21.9719 17.2536C21.5597 17.2131 21.1927 17.5144 21.1521 17.9266L22.6449 18.0734ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25ZM2.84789 6.07342C2.96931 4.83905 3.23045 4.17335 3.7019 3.7019L2.64124 2.64124C1.80633 3.47616 1.48944 4.56072 1.35509 5.92658L2.84789 6.07342ZM21.1521 17.9266C21.0307 19.1609 20.7695 19.8266 20.2981 20.2981L21.3588 21.3588C22.1937 20.5238 22.5106 19.4393 22.6449 18.0734L21.1521 17.9266Z","fill","#bfbfbf"],["viewBox","0 -0.5 21 21","version","1.1","xmlns","http://www.w3.org/2000/svg",0,"xmlns","xlink","http://www.w3.org/1999/xlink","fill","#000000",1,"cover-svg"],["id","Page-1","stroke","none","stroke-width","1","fill","none","fill-rule","evenodd"],["id","Dribbble-Light-Preview","transform","translate(-339.000000, -600.000000)","fill","#bfbfbf"],["id","icons","transform","translate(56.000000, 160.000000)"],["d","M286.388001,443.226668 C288.054626,441.639407 290.765027,441.639407 292.431651,443.226668 L293.942296,444.665378 L295.452942,443.226668 L293.942296,441.787958 C291.439155,439.404014 287.380498,439.404014 284.877356,441.787958 C282.374215,444.171902 282.374215,448.03729 284.877356,450.421235 L286.388001,451.859945 L287.898647,450.421235 L286.388001,448.982525 C284.721377,447.395264 284.721377,444.813929 286.388001,443.226668 L286.388001,443.226668 Z M302.122644,449.578765 L300.611999,448.139038 L299.101353,449.578765 L300.611999,451.017475 C302.277554,452.603719 302.277554,455.186071 300.611999,456.773332 C298.945374,458.359576 296.233905,458.359576 294.568349,456.773332 L293.057704,455.333605 L291.54599,456.773332 L293.057704,458.212042 C295.560845,460.595986 299.619502,460.595986 302.122644,458.212042 C304.625785,455.828098 304.625785,451.96271 302.122644,449.578765 L302.122644,449.578765 Z M288.653969,443.946023 L299.856676,454.61425 L298.344962,456.053977 L287.143324,445.384733 L288.653969,443.946023 Z","id","url-[#bfbfbf]"]],template:function(o,s){if(o&1&&(i(0,"div",0)(1,"div",1),d(2,k,5,5,"div",2),g(3,"async"),d(4,V,3,0,"div",2),i(5,"div",3)(6,"div",4)(7,"h2",5),l(8),n(),d(9,H,10,1),g(10,"async"),d(11,E,1,0,"div",6),n(),i(12,"div",4)(13,"h2",5),l(14),n(),d(15,P,15,1),g(16,"async"),d(17,O,1,0,"div",6),n()()()()),o&2){let p,b,v;a(2),m((p=C(3,5,s.crawlingStatistics$))?2:4,p),a(6),c(s.lang.locals.total_reports),a(),m((b=C(10,7,s.reportCount$))?9:11,b),a(5),c(s.lang.locals.total_urls),a(),m((v=C(16,9,s.urlCount$))?15:17,v)}},dependencies:[S,y],styles:[".counter[_ngcontent-%COMP%]{position:relative;height:7rem;overflow:hidden;border-radius:.75rem;--tw-bg-opacity: 1;background-color:rgb(229 231 235 / var(--tw-bg-opacity));padding:1.5rem;--tw-shadow: 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);--tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow);transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.counter[_ngcontent-%COMP%]:hover{--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.cover-svg[_ngcontent-%COMP%]{position:absolute;top:0;left:0;margin:.5rem;height:8rem;width:10rem;opacity:.5}.cover-svg[_ngcontent-%COMP%]:where([dir=rtl], [dir=rtl][_ngcontent-%COMP%]   *)[_ngcontent-%COMP%]{right:0}"]})};export{Z as StatisticsComponent};
