import{a as ct,c as lt}from"./chunk-BXGVR33D.js";import{E as T,Y as F,Z as mt,_ as ht,a as at,aa as L,ba as pt,ca as ut,fa as ft,ia as _t,n as st,o as rt,y as ot}from"./chunk-U4CFCUJG.js";import{c as dt,d as j,f as A,g as O,i as P}from"./chunk-OK5S6IU3.js";import{$b as _,Ea as H,Fa as Q,Fb as W,Fc as I,Ka as u,Kb as B,Oa as U,Pb as K,Sa as Z,Vb as X,Vc as nt,_b as y,a as h,ac as Y,ec as G,fa as N,gc as J,gd as it,hc as tt,ic as et,jc as w,ka as b,la as V,na as x,ob as f,pa as m,pb as c,q as d,qa as k,qc as C,rb as $,rc as M,sc as D,ua as S,va as q,wa as g,xc as R,zc as E}from"./chunk-IAZQTHFA.js";function xt(i,o){if(i&1){let t=G();y(0,"div",1)(1,"button",2),tt("click",function(){H(t);let n=w();return Q(n.action())}),R(2),_()()}if(i&2){let t=w();f(2),E(" ",t.data.action," ")}}var St=["label"];function Bt(i,o){}var wt=Math.pow(2,31)-1,v=class{constructor(o,t){this._overlayRef=t,this._afterDismissed=new d,this._afterOpened=new d,this._onAction=new d,this._dismissedByAction=!1,this.containerInstance=o,o._onExit.subscribe(()=>this._finishDismiss())}dismiss(){this._afterDismissed.closed||this.containerInstance.exit(),clearTimeout(this._durationTimeoutId)}dismissWithAction(){this._onAction.closed||(this._dismissedByAction=!0,this._onAction.next(),this._onAction.complete(),this.dismiss()),clearTimeout(this._durationTimeoutId)}closeWithAction(){this.dismissWithAction()}_dismissAfter(o){this._durationTimeoutId=setTimeout(()=>this.dismiss(),Math.min(o,wt))}_open(){this._afterOpened.closed||(this._afterOpened.next(),this._afterOpened.complete())}_finishDismiss(){this._overlayRef.dispose(),this._onAction.closed||this._onAction.complete(),this._afterDismissed.next({dismissedByAction:this._dismissedByAction}),this._afterDismissed.complete(),this._dismissedByAction=!1}afterDismissed(){return this._afterDismissed}afterOpened(){return this.containerInstance._onEnter}onAction(){return this._onAction}},vt=new x("MatSnackBarData"),p=class{constructor(){this.politeness="assertive",this.announcementMessage="",this.duration=0,this.data=null,this.horizontalPosition="center",this.verticalPosition="bottom"}},Ct=(()=>{class i{static{this.\u0275fac=function(e){return new(e||i)}}static{this.\u0275dir=g({type:i,selectors:[["","matSnackBarLabel",""]],hostAttrs:[1,"mat-mdc-snack-bar-label","mdc-snackbar__label"],standalone:!0})}}return i})(),Mt=(()=>{class i{static{this.\u0275fac=function(e){return new(e||i)}}static{this.\u0275dir=g({type:i,selectors:[["","matSnackBarActions",""]],hostAttrs:[1,"mat-mdc-snack-bar-actions","mdc-snackbar__actions"],standalone:!0})}}return i})(),Dt=(()=>{class i{static{this.\u0275fac=function(e){return new(e||i)}}static{this.\u0275dir=g({type:i,selectors:[["","matSnackBarAction",""]],hostAttrs:[1,"mat-mdc-snack-bar-action","mdc-snackbar__action"],standalone:!0})}}return i})(),bt=(()=>{class i{constructor(t,e){this.snackBarRef=t,this.data=e}action(){this.snackBarRef.dismissWithAction()}get hasAction(){return!!this.data.action}static{this.\u0275fac=function(e){return new(e||i)(c(v),c(vt))}}static{this.\u0275cmp=S({type:i,selectors:[["simple-snack-bar"]],hostAttrs:[1,"mat-mdc-simple-snack-bar"],exportAs:["matSnackBar"],standalone:!0,features:[I],decls:3,vars:2,consts:[["matSnackBarLabel",""],["matSnackBarActions",""],["mat-button","","matSnackBarAction","",3,"click"]],template:function(e,n){e&1&&(y(0,"div",0),R(1),_(),B(2,xt,3,1,"div",1)),e&2&&(f(),E(" ",n.data.message,`
`),f(),X(n.hasAction?2:-1))},dependencies:[ct,Ct,Mt,Dt],styles:[".mat-mdc-simple-snack-bar{display:flex}"],encapsulation:2,changeDetection:0})}}return i})(),Rt={snackBarState:dt("state",[O("void, hidden",A({transform:"scale(0.8)",opacity:0})),O("visible",A({transform:"scale(1)",opacity:1})),P("* => visible",j("150ms cubic-bezier(0, 0, 0.2, 1)")),P("* => void, * => hidden",j("75ms cubic-bezier(0.4, 0.0, 1, 1)",A({opacity:0})))])},Et=0,It=(()=>{class i extends ht{constructor(t,e,n,a,s){super(),this._ngZone=t,this._elementRef=e,this._changeDetectorRef=n,this._platform=a,this.snackBarConfig=s,this._document=k(it),this._trackedModals=new Set,this._announceDelay=150,this._destroyed=!1,this._onAnnounce=new d,this._onExit=new d,this._onEnter=new d,this._animationState="void",this._liveElementId=`mat-snack-bar-container-live-${Et++}`,this.attachDomPortal=r=>{this._assertNotAttached();let l=this._portalOutlet.attachDomPortal(r);return this._afterPortalAttached(),l},s.politeness==="assertive"&&!s.announcementMessage?this._live="assertive":s.politeness==="off"?this._live="off":this._live="polite",this._platform.FIREFOX&&(this._live==="polite"&&(this._role="status"),this._live==="assertive"&&(this._role="alert"))}attachComponentPortal(t){this._assertNotAttached();let e=this._portalOutlet.attachComponentPortal(t);return this._afterPortalAttached(),e}attachTemplatePortal(t){this._assertNotAttached();let e=this._portalOutlet.attachTemplatePortal(t);return this._afterPortalAttached(),e}onAnimationEnd(t){let{fromState:e,toState:n}=t;if((n==="void"&&e!=="void"||n==="hidden")&&this._completeExit(),n==="visible"){let a=this._onEnter;this._ngZone.run(()=>{a.next(),a.complete()})}}enter(){this._destroyed||(this._animationState="visible",this._changeDetectorRef.markForCheck(),this._changeDetectorRef.detectChanges(),this._screenReaderAnnounce())}exit(){return this._ngZone.run(()=>{this._animationState="hidden",this._changeDetectorRef.markForCheck(),this._elementRef.nativeElement.setAttribute("mat-exit",""),clearTimeout(this._announceTimeoutId)}),this._onExit}ngOnDestroy(){this._destroyed=!0,this._clearFromModals(),this._completeExit()}_completeExit(){queueMicrotask(()=>{this._onExit.next(),this._onExit.complete()})}_afterPortalAttached(){let t=this._elementRef.nativeElement,e=this.snackBarConfig.panelClass;e&&(Array.isArray(e)?e.forEach(s=>t.classList.add(s)):t.classList.add(e)),this._exposeToModals();let n=this._label.nativeElement,a="mdc-snackbar__label";n.classList.toggle(a,!n.querySelector(`.${a}`))}_exposeToModals(){let t=this._liveElementId,e=this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');for(let n=0;n<e.length;n++){let a=e[n],s=a.getAttribute("aria-owns");this._trackedModals.add(a),s?s.indexOf(t)===-1&&a.setAttribute("aria-owns",s+" "+t):a.setAttribute("aria-owns",t)}}_clearFromModals(){this._trackedModals.forEach(t=>{let e=t.getAttribute("aria-owns");if(e){let n=e.replace(this._liveElementId,"").trim();n.length>0?t.setAttribute("aria-owns",n):t.removeAttribute("aria-owns")}}),this._trackedModals.clear()}_assertNotAttached(){this._portalOutlet.hasAttached()}_screenReaderAnnounce(){this._announceTimeoutId||this._ngZone.runOutsideAngular(()=>{this._announceTimeoutId=setTimeout(()=>{let t=this._elementRef.nativeElement.querySelector("[aria-hidden]"),e=this._elementRef.nativeElement.querySelector("[aria-live]");if(t&&e){let n=null;this._platform.isBrowser&&document.activeElement instanceof HTMLElement&&t.contains(document.activeElement)&&(n=document.activeElement),t.removeAttribute("aria-hidden"),e.appendChild(t),n?.focus(),this._onAnnounce.next(),this._onAnnounce.complete()}},this._announceDelay)})}static{this.\u0275fac=function(e){return new(e||i)(c(U),c(Z),c(nt),c(at),c(p))}}static{this.\u0275cmp=S({type:i,selectors:[["mat-snack-bar-container"]],viewQuery:function(e,n){if(e&1&&(C(L,7),C(St,7)),e&2){let a;M(a=D())&&(n._portalOutlet=a.first),M(a=D())&&(n._label=a.first)}},hostAttrs:[1,"mdc-snackbar","mat-mdc-snack-bar-container"],hostVars:1,hostBindings:function(e,n){e&1&&et("@state.done",function(s){return n.onAnimationEnd(s)}),e&2&&J("@state",n._animationState)},standalone:!0,features:[W,I],decls:6,vars:3,consts:[["label",""],[1,"mdc-snackbar__surface","mat-mdc-snackbar-surface"],[1,"mat-mdc-snack-bar-label"],["aria-hidden","true"],["cdkPortalOutlet",""]],template:function(e,n){e&1&&(y(0,"div",1)(1,"div",2,0)(3,"div",3),B(4,Bt,0,0,"ng-template",4),_(),Y(5,"div"),_()()),e&2&&(f(5),K("aria-live",n._live)("role",n._role)("id",n._liveElementId))},dependencies:[L],styles:[".mat-mdc-snack-bar-container{display:flex;align-items:center;justify-content:center;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0,0,0,0);margin:8px}.mat-mdc-snack-bar-handset .mat-mdc-snack-bar-container{width:100vw}.mat-mdc-snackbar-surface{box-shadow:0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);display:flex;align-items:center;justify-content:flex-start;box-sizing:border-box;padding-left:0;padding-right:8px}[dir=rtl] .mat-mdc-snackbar-surface{padding-right:0;padding-left:8px}.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface{min-width:344px;max-width:672px}.mat-mdc-snack-bar-handset .mat-mdc-snackbar-surface{width:100%;min-width:0}.cdk-high-contrast-active .mat-mdc-snackbar-surface{outline:solid 1px}.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface{color:var(--mdc-snackbar-supporting-text-color, var(--mat-app-inverse-on-surface));border-radius:var(--mdc-snackbar-container-shape, var(--mat-app-corner-extra-small));background-color:var(--mdc-snackbar-container-color, var(--mat-app-inverse-surface))}.mdc-snackbar__label{width:100%;flex-grow:1;box-sizing:border-box;margin:0;padding:14px 8px 14px 16px}[dir=rtl] .mdc-snackbar__label{padding-left:8px;padding-right:16px}.mat-mdc-snack-bar-container .mdc-snackbar__label{font-family:var(--mdc-snackbar-supporting-text-font, var(--mat-app-body-medium-font));font-size:var(--mdc-snackbar-supporting-text-size, var(--mat-app-body-medium-size));font-weight:var(--mdc-snackbar-supporting-text-weight, var(--mat-app-body-medium-weight));line-height:var(--mdc-snackbar-supporting-text-line-height, var(--mat-app-body-medium-line-height))}.mat-mdc-snack-bar-actions{display:flex;flex-shrink:0;align-items:center;box-sizing:border-box}.mat-mdc-snack-bar-handset,.mat-mdc-snack-bar-container,.mat-mdc-snack-bar-label{flex:1 1 auto}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled){color:var(--mat-snack-bar-button-color, var(--mat-app-inverse-primary));--mat-text-button-state-layer-color:currentColor;--mat-text-button-ripple-color:currentColor}.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) .mat-ripple-element{opacity:.1}"],encapsulation:2,data:{animation:[Rt.snackBarState]}})}}return i})();function Tt(){return new p}var jt=new x("mat-snack-bar-default-options",{providedIn:"root",factory:Tt}),z=(()=>{class i{get _openedSnackBarRef(){let t=this._parentSnackBar;return t?t._openedSnackBarRef:this._snackBarRefAtThisLevel}set _openedSnackBarRef(t){this._parentSnackBar?this._parentSnackBar._openedSnackBarRef=t:this._snackBarRefAtThisLevel=t}constructor(t,e,n,a,s,r){this._overlay=t,this._live=e,this._injector=n,this._breakpointObserver=a,this._parentSnackBar=s,this._defaultConfig=r,this._snackBarRefAtThisLevel=null,this.simpleSnackBarComponent=bt,this.snackBarContainerComponent=It,this.handsetCssClass="mat-mdc-snack-bar-handset"}openFromComponent(t,e){return this._attach(t,e)}openFromTemplate(t,e){return this._attach(t,e)}open(t,e="",n){let a=h(h({},this._defaultConfig),n);return a.data={message:t,action:e},a.announcementMessage===t&&(a.announcementMessage=void 0),this.openFromComponent(this.simpleSnackBarComponent,a)}dismiss(){this._openedSnackBarRef&&this._openedSnackBarRef.dismiss()}ngOnDestroy(){this._snackBarRefAtThisLevel&&this._snackBarRefAtThisLevel.dismiss()}_attachSnackBarContainer(t,e){let n=e&&e.viewContainerRef&&e.viewContainerRef.injector,a=u.create({parent:n||this._injector,providers:[{provide:p,useValue:e}]}),s=new F(this.snackBarContainerComponent,e.viewContainerRef,a),r=t.attach(s);return r.instance.snackBarConfig=e,r.instance}_attach(t,e){let n=h(h(h({},new p),this._defaultConfig),e),a=this._createOverlay(n),s=this._attachSnackBarContainer(a,n),r=new v(s,a);if(t instanceof $){let l=new mt(t,null,{$implicit:n.data,snackBarRef:r});r.instance=s.attachTemplatePortal(l)}else{let l=this._createInjector(n,r),gt=new F(t,void 0,l),yt=s.attachComponentPortal(gt);r.instance=yt.instance}return this._breakpointObserver.observe(rt.HandsetPortrait).pipe(N(a.detachments())).subscribe(l=>{a.overlayElement.classList.toggle(this.handsetCssClass,l.matches)}),n.announcementMessage&&s._onAnnounce.subscribe(()=>{this._live.announce(n.announcementMessage,n.politeness)}),this._animateSnackBar(r,n),this._openedSnackBarRef=r,this._openedSnackBarRef}_animateSnackBar(t,e){t.afterDismissed().subscribe(()=>{this._openedSnackBarRef==t&&(this._openedSnackBarRef=null),e.announcementMessage&&this._live.clear()}),this._openedSnackBarRef?(this._openedSnackBarRef.afterDismissed().subscribe(()=>{t.containerInstance.enter()}),this._openedSnackBarRef.dismiss()):t.containerInstance.enter(),e.duration&&e.duration>0&&t.afterOpened().subscribe(()=>t._dismissAfter(e.duration))}_createOverlay(t){let e=new ut;e.direction=t.direction;let n=this._overlay.position().global(),a=t.direction==="rtl",s=t.horizontalPosition==="left"||t.horizontalPosition==="start"&&!a||t.horizontalPosition==="end"&&a,r=!s&&t.horizontalPosition!=="center";return s?n.left("0"):r?n.right("0"):n.centerHorizontally(),t.verticalPosition==="top"?n.top("0"):n.bottom("0"),e.positionStrategy=n,this._overlay.create(e)}_createInjector(t,e){let n=t&&t.viewContainerRef&&t.viewContainerRef.injector;return u.create({parent:n||this._injector,providers:[{provide:v,useValue:e},{provide:vt,useValue:t.data}]})}static{this.\u0275fac=function(e){return new(e||i)(m(ft),m(ot),m(u),m(st),m(i,12),m(jt))}}static{this.\u0275prov=b({token:i,factory:i.\u0275fac,providedIn:"root"})}}return i})();var se=(()=>{class i{static{this.\u0275fac=function(e){return new(e||i)}}static{this.\u0275mod=q({type:i})}static{this.\u0275inj=V({providers:[z],imports:[_t,pt,lt,T,bt,T]})}}return i})();var kt=class i{_snackBar=k(z);showError(o,t){this._snackBar.open(o,t)}showInfo(o,t){this._snackBar.open(o,t)}static \u0275fac=function(t){return new(t||i)};static \u0275prov=b({token:i,factory:i.\u0275fac,providedIn:"root"})};export{jt as a,se as b,kt as c};
