import{L as a,N as u,x as c}from"./chunk-VFLFNRAE.js";function d(e=!1){return t=>t.pipe(u(n=>(e&&console.log(n),c("CUSTOM_ERROR")))).pipe(a(n=>n!=="CUSTOM_ERROR"))}function g(){let e=new Date().getTime(),t=typeof performance<"u"&&performance.now&&performance.now()*1e3||0;return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(n){let o=Math.random()*16;return e>0?(o=(e+o)%16|0,e=Math.floor(e/16)):(o=(t+o)%16|0,t=Math.floor(t/16)),(n==="x"?o:o&3|8).toString(16)})}function m(e){return/[\u0600-\u06FF]+/.test(e)}var b=e=>(e.split(" ").map(t=>(m(t)?"\u202A":"\u202C")+t).join(" "),e);function T(e,t){let n=e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");return n=n.replace(/\[(.*?)\]/g,(o,i)=>{let r=t.context.citations[Number(i.replace(/[^0-9]/g,""))-1];if(!r)return o;let l=r.title;return`<br /><small class="px-1 text-primary"><a target="_blank" href="${r.url}">${l}</a><i class="link-icon"></i></small>`}),n.trim()}function h(e){let t=/^(#+)\s+(.*)$/gm;return e.replace(t,(n,o,i)=>{let r=o.length,s={1:"text-4xl font-bold ml-9",2:"text-3xl font-bold",3:"text-2xl font-bold",4:"text-xl font-bold",5:"text-lg font-semibold",6:"text-base font-medium"}[r]||"text-base font-medium";return`<h${r} class="${s}">${i}</h${r}>`})}function O(e){let n=new URL(e).pathname;return decodeURI(n.split("/").pop()||"file")}export{d as a,g as b,b as c,T as d,h as e,O as f};
