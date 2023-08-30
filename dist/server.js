import{createComponent as e,Dynamic as t,mergeProps as r}from"solid-js/web";import{createSignal as o,onMount as n,createEffect as i,on as a,onCleanup as s}from"solid-js";var d="data-scs-",c="scs",m={content:{name:d+"content",camel:c+"Content"},wrapperBorder:{name:d+"w-border",camel:c+"WBorder"},border:{name:d+"border",camel:c+"Border"},style:{name:d+"style",camel:c+"Style"},cloneContentElement:{name:d+"clone-content",camel:c+"CloneContent"}},h=class{container;constructor(e){this.container=e}getSize(e,t){if(e){let{width:r,height:o}={width:e.clientWidth,height:e.clientHeight},n=t?2*t:0;return{width:r-n,height:o-n}}return{width:0,height:0}}getPositionProperty(e){let t=getComputedStyle(e).position;return"static"===t||""===t?"relative":t}setCssStyle(e,t){let r=this.getElement(e),o=!!r;this.container&&(r||(r=this.container?.createElement("style"),r.setAttribute("type","text/css"),r.dataset[m.style.camel]=e),r.innerHTML=t.reduce(((e,t)=>{if(t)return e+t}),""),o||this.container?.head.appendChild(r))}createCss(e){let t="",r="";for(let r in e.properies)e.properies,Object.prototype.hasOwnProperty.call(e.properies,r)&&void 0!==e.properies[r]&&(t+=r+":"+e.properies[r]+";");return r=e.id?"#"+e.id:e.class?"."+e.class:e.selector||"",r+"{"+t+"}"}getElement(e,t){return this.container?.querySelector("["+t||m.style.name+"="+e.toString()+"]")}};var l={topLeft:[{corner:"topRight",side:"top"},{corner:"bottomLeft",side:"left"}],topRight:[{corner:"topLeft",side:"top"},{corner:"bottomRight",side:"right"}],bottomLeft:[{corner:"bottomRight",side:"bottom"},{corner:"topLeft",side:"left"}],bottomRight:[{corner:"bottomLeft",side:"bottom"},{corner:"topRight",side:"right"}]};function u({cornerRadius:e,cornerSmoothing:t,preserveSmoothing:r,roundingAndSmoothingBudget:o}){let n=(1+t)*e;if(!r){let r=o/e-1;t=Math.min(t,r),n=Math.min(n,o)}let i=90*(1-t),a=Math.sin(g(i/2))*e*Math.sqrt(2),s=(90-i)/2,d=45*t,c=e*Math.tan(g(s/2))*Math.cos(g(d)),m=c*Math.tan(g(d)),h=(n-a-c-m)/3,l=2*h;if(r&&n>o){let e=o-m-a-c,t=e-e/6;h=Math.min(h,t),l=e-h,n=Math.min(n,o)}return{a:l,b:h,c:c,d:m,p:n,arcSectionLength:a,cornerRadius:e}}function p({width:e,height:t,topLeftPathParams:r,topRightPathParams:o,bottomLeftPathParams:n,bottomRightPathParams:i}){return`\n    M ${e-o.p} 0\n    ${function({cornerRadius:e,a:t,b:r,c:o,d:n,p:i,arcSectionLength:a}){return e?b`
    c ${t} 0 ${t+r} 0 ${t+r+o} ${n}
    a ${e} ${e} 0 0 1 ${a} ${a}
    c ${n} ${o}
        ${n} ${r+o}
        ${n} ${t+r+o}`:b`l ${i} 0`}(o)}\n    L ${e} ${t-i.p}\n    ${function({cornerRadius:e,a:t,b:r,c:o,d:n,p:i,arcSectionLength:a}){return e?b`
    c 0 ${t}
      0 ${t+r}
      ${-n} ${t+r+o}
    a ${e} ${e} 0 0 1 -${a} ${a}
    c ${-o} ${n}
      ${-(r+o)} ${n}
      ${-(t+r+o)} ${n}`:b`l 0 ${i}`}(i)}\n    L ${n.p} ${t}\n    ${function({cornerRadius:e,a:t,b:r,c:o,d:n,p:i,arcSectionLength:a}){return e?b`
    c ${-t} 0
      ${-(t+r)} 0
      ${-(t+r+o)} ${-n}
    a ${e} ${e} 0 0 1 -${a} -${a}
    c ${-n} ${-o}
      ${-n} ${-(r+o)}
      ${-n} ${-(t+r+o)}`:b`l ${-i} 0`}(n)}\n    L 0 ${r.p}\n    ${function({cornerRadius:e,a:t,b:r,c:o,d:n,p:i,arcSectionLength:a}){return e?b`
    c 0 ${-t}
      0 ${-(t+r)}
      ${n} ${-(t+r+o)}
    a ${e} ${e} 0 0 1 ${a} -${a}
    c ${o} ${-n}
      ${r+o} ${-n}
      ${t+r+o} ${-n}`:b`l 0 ${-i}`}(r)}\n    Z\n  `.replace(/[\t\s\n]+/g," ").trim()}function g(e){return e*Math.PI/180}function b(e,...t){return e.reduce(((e,r,o)=>{let n=t[o];return"number"==typeof n?e+r+n.toFixed(4):e+r+(n??"")}),"")}function f({cornerRadius:e=0,topLeftCornerRadius:t,topRightCornerRadius:r,bottomRightCornerRadius:o,bottomLeftCornerRadius:n,cornerSmoothing:i,width:a,height:s,preserveSmoothing:d=!1}){if(n=n??e,o=o??e,(t=t??e)===(r=r??e)&&r===o&&o===n&&n===t){let e=Math.min(a,s)/2,r=u({cornerRadius:Math.min(t,e),cornerSmoothing:i,preserveSmoothing:d,roundingAndSmoothingBudget:e});return p({width:a,height:s,topLeftPathParams:r,topRightPathParams:r,bottomLeftPathParams:r,bottomRightPathParams:r})}let{topLeft:c,topRight:m,bottomLeft:h,bottomRight:g}=function({topLeftCornerRadius:e,topRightCornerRadius:t,bottomRightCornerRadius:r,bottomLeftCornerRadius:o,width:n,height:i}){let a={topLeft:-1,topRight:-1,bottomLeft:-1,bottomRight:-1},s={topLeft:e,topRight:t,bottomLeft:o,bottomRight:r};return Object.entries(s).sort((([,e],[,t])=>t-e)).forEach((([e,t])=>{let r=e,o=l[r],d=Math.min(...o.map((e=>{let r=s[e.corner];if(0===t&&0===r)return 0;let o=a[e.corner],d="top"===e.side||"bottom"===e.side?n:i;return o>=0?d-a[e.corner]:t/(t+r)*d})));a[r]=d,s[r]=Math.min(t,d)})),{topLeft:{radius:s.topLeft,roundingAndSmoothingBudget:a.topLeft},topRight:{radius:s.topRight,roundingAndSmoothingBudget:a.topRight},bottomLeft:{radius:s.bottomLeft,roundingAndSmoothingBudget:a.bottomLeft},bottomRight:{radius:s.bottomRight,roundingAndSmoothingBudget:a.bottomRight}}}({topLeftCornerRadius:t,topRightCornerRadius:r,bottomRightCornerRadius:o,bottomLeftCornerRadius:n,width:a,height:s});return p({width:a,height:s,topLeftPathParams:u({cornerSmoothing:i,preserveSmoothing:d,cornerRadius:c.radius,roundingAndSmoothingBudget:c.roundingAndSmoothingBudget}),topRightPathParams:u({cornerSmoothing:i,preserveSmoothing:d,cornerRadius:m.radius,roundingAndSmoothingBudget:m.roundingAndSmoothingBudget}),bottomRightPathParams:u({cornerSmoothing:i,preserveSmoothing:d,cornerRadius:g.radius,roundingAndSmoothingBudget:g.roundingAndSmoothingBudget}),bottomLeftPathParams:u({cornerSmoothing:i,preserveSmoothing:d,cornerRadius:h.radius,roundingAndSmoothingBudget:h.roundingAndSmoothingBudget})})}var $=Math.pow,R=new RegExp("^[+-]?(?=\\.\\d|\\d)(?:0|[1-9]\\d*)?(?:\\.\\d+)?(?:(?<=\\d)(?:[eE][+-]?\\d+))?"),L=e=>{let t={tokens:[],errors:[]};if(!e||""===e.trim())return t;let r=0,o=0,n=0,i=()=>r>=e.length,a=e=>{t.tokens.push({tokenType:e,line:o,col:n})},s=()=>{let s=e[r];if("\n"===s.charAt(0)||"\r"===s.charAt(0))return r++,n=0,void o++;if(/\s/.test(s)||","===s)return r++,void n++;if(!i()&&R.test(e.substring(r))){let i=e.substring(r).match(R);if(i&&i.length>0){let e=i[0];return(e=>{t.tokens.push({tokenType:"num",value:e,line:o,col:n})})(e),r+=e.length,void(n+=e.length)}}switch(s){case"M":a("M");break;case"m":a("m");break;case"Z":a("Z");break;case"z":a("z");break;case"L":a("L");break;case"l":a("l");break;case"H":a("H");break;case"h":a("h");break;case"V":a("V");break;case"v":a("v");break;case"C":a("C");break;case"c":a("c");break;case"S":a("S");break;case"s":a("s");break;case"Q":a("Q");break;case"q":a("q");break;case"T":a("T");break;case"t":a("t");break;case"A":a("A");break;case"a":a("a");break;default:(e=>{t.errors.push({line:o,col:n,msg:e})})(`Unexpected character ${s}`)}r++,n++};for(;!i();)s();return t},S=(e,t=2)=>{if(Number.isInteger(e))return e.toString();let r=((e,t=1/0)=>{if(t===1/0)return e;t<0&&(t=0);let r=$(10,t);return Math.round(e*r)/r})(e,t).toString(),o=r.split("."),n=o[0],i=o[1];return"0"===n?`.${i}`:"-0"===n?`-.${i}`:r},k=(e,t)=>{if(!e||e.length<=0)return"";let r=S(e[0],t);for(let o=1;o<e.length;o++){let n=e[o],i=S(n,t);r+=n<0?i:` ${i}`}return r},C=e=>(e=>{let t={commands:[],errors:e.errors||[]};if(e.errors.length>0||0===e.tokens.length)return t;let{tokens:r,errors:o}=e,n=(e,t)=>{o.push({line:e?.line,col:e?.col,msg:t})};if("M"!==r[0].tokenType&&"m"!==r[0].tokenType)return n(r[0],"A path data segment must begin with a 'moveto' command 'M' or 'm'."),t;let i=0,a=e=>{var t,o;if(!e||"a"!==e.toLowerCase())return!0;let n=((null==(t=r[i+4])?void 0:t.value)||"").toString(),a=((null==(o=r[i+5])?void 0:o.value)||"").toString();return!("0"!==n&&"1"!==n||"0"!==a&&"1"!==a)},s=(e,o,s)=>{var d;let c=r[i].tokenType,m=[];if(e>0)for(let t=1;t<=e;t++){if(!r[i+t]||"num"!==r[i+t].tokenType)return n(r[i],`Expected number(s) after command ${c}.`),void(i+=e);m.push(Number(r[i+t].value))}if(!a(c))return n(r[i],"Arc flags must be 0 or 1."),void(i+=e+1);if(!a(c))return n(r[i],"Arc flags must be 0 or 1."),void(i+=e+1);if(t.commands.push({command:r[i].tokenType,params:m}),i+=e+1,e<=0)return;let h=[];for(;"num"===(null==(d=r[i])?void 0:d.tokenType);)h.push(r[i]),i++;if(h.length%e!=0)return void n(h[h.length-1],"Expected a number.");let l=s?o.toLowerCase():o.toUpperCase();for(let r=0;r<h.length;r+=e){let o=[];for(let t=0;t<e;t++)o.push(Number(h[r+t].value));t.commands.push({command:l,params:o})}},d=()=>{let e=r[i],t=e.tokenType.toLowerCase()===e.tokenType;switch(e.tokenType){case"M":case"m":case"L":case"l":s(2,"L",t);break;case"Z":case"z":s(0,"L",t);break;case"H":case"h":case"V":case"v":s(1,e.tokenType,t);break;case"C":case"c":s(6,e.tokenType,t);break;case"S":case"s":case"Q":case"q":s(4,e.tokenType,t);break;case"T":case"t":s(2,e.tokenType,t);break;case"A":case"a":s(7,e.tokenType,t);break;default:n(r[i],"Wrong path command."),i++}};for(s(2,"L","m"===r[0].tokenType);!(i>=r.length);)d();return t})(L(e)),v=(e,t=2)=>{if(!e)return e;let r=C(e);return r.errors.length>0?e:((e,t=2)=>{let r="",o=null;for(let n of e.commands){if("L"===n.command){if(0===n.params[0]){r+=`V${S(n.params[1],t)}`,o="V";continue}if(0===n.params[1]){r+=`H${S(n.params[0],t)}`,o="H";continue}}if("l"===n.command){if(0===n.params[0]){r+=`v${S(n.params[1],t)}`,o="v";continue}if(0===n.params[1]){r+=`h${S(n.params[0],t)}`,o="h";continue}}"c"!==n.command||o?.toLowerCase()==="C".toLowerCase()||o?.toLowerCase()==="S".toLowerCase()||0!==n.params[0]||0!==n.params[1]?(o===n.command||"M"===o&&"L"===n.command||"m"===o&&"l"===n.command?n.params.length>0&&n.params[0]>=0&&(r+=" "):r+=n.command,r+=k(n.params,t),o=n.command):(r+=`s${k([n.params[2],n.params[3],n.params[4],n.params[5]],t)}`,o="s")}return r.trim()})(r,t)},w={cornerSmoothing:1,cornerRadius:10},y=(e,t)=>{let r=f({...w,...e});return v(r)||""},P=(e,t)=>{let{topLeftCornerRadius:r,topRightCornerRadius:o,bottomRightCornerRadius:n,bottomLeftCornerRadius:i}=t,a={topLeftCornerRadius:r,topRightCornerRadius:o,bottomRightCornerRadius:n,bottomLeftCornerRadius:i};for(let t in a)if(Object.prototype.hasOwnProperty.call(a,t)){let r=a[t]-e;a[t]=r>=0?r:null}return a},M=e=>{let[t,r]=o({}),d=null,c=null,l={width:0,height:0},u=null,p=null,g=(t,r,o)=>{let n={};return o&&r&&(n.position="absolute",n.top=0,n.height=r.height-2*o.size+"px",n.width=r.width-2*o.size+"px",n.transform="translate("+o?.size+"px,"+o?.size+"px)"),e.options?.backgroundColor&&(n["background-color"]=e.options?.backgroundColor),p?.createCss({selector:"["+m.content.name+'="'+e.randomId+'"]',properies:{"clip-path":"path('"+t+"')",overflow:"hidden",...n}})},b=()=>p?.createCss({selector:"["+m.wrapperBorder.name+'="'+e.randomId+'"]',properies:{position:"relative","box-sizing":"border-box","border-width":"0 !important"}}),f=(t,r)=>p?.createCss({selector:"["+m.border.name+'="'+e.randomId+'"]',properies:{position:"absolute",inset:0,"background-color":r,"clip-path":"path('"+t+"')",overflow:"hidden"}}),$=()=>p?.createCss({selector:"["+m.cloneContentElement.name+'="'+e.randomId+'"]',properies:{opacity:0}}),R=r=>{if(u){let o=e.options?.border,n=p?.getSize(p?.getElement(e.randomId,o?m.cloneContentElement.name:m.content.name));if((r||n.height!==l.height||n.width!==l.width)&&0!==n.height&&0!==n.width)if(l=n,o){let r=y({...t(),height:n.height-2*o.size,width:n.width-2*o.size,cornerRadius:Number(t().cornerRadius)-o.size,...P(o.size,t())}),i=Number(t().cornerRadius);o?.fitBorderSize&&(i-=((e,t)=>e+e/5+t)(o.size,o?.fitBorderSize));let a=y({...n,...t(),cornerRadius:i});p?.setCssStyle(e.randomId,[$(),g(r,n,o),b(),f(a,o.color)])}else{let r=y({...n,...t()});p?.setCssStyle(e.randomId,[g(r)])}}},L=(e,t,r)=>{C(),d=new ResizeObserver((()=>{t?t(R):R(e),r&&r()}))},S=t=>{u&&(e.options?.reSize?(e.options?.debounce?L(t,(r=>{c&&clearTimeout(c),c=setTimeout((()=>{r(t)}),e.options?.debounce)})):L(t),k()):R(t))},k=()=>{let t=p?.getElement(e.randomId,e.options?.border?m.cloneContentElement.name:m.content.name);t&&d?.observe(t)},C=()=>{d&&d.disconnect()};return i((()=>{r({...e.options,preserveSmoothing:e.options?.preserveSmoothing||!0})})),i(a(t,(()=>{e.options?.reSize?S(!0):(C(),R(!0))}),{defer:!0})),n((()=>{p=new h(document),u=p.getElement(e.randomId,m.content.name),p.setCssStyle(e.randomId,[b()]),L(!0,null,(()=>{e.options?.reSize?S():C()})),k()})),s((()=>{(()=>{let t=p?.getElement(e.randomId);t&&t.remove(),C()})()})),[]},A=(e=>{let t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",r="";for(let o=0;o<(e||5);o++)r+=t.charAt(Math.floor(52*Math.random()));return r})(),T=i=>{let[a,s]=o(!1);n((()=>{a()||s(!0)}));let d=o=>e(t,r({get class(){return o?.class},get classList(){return o?.classList},get component(){return o?.wrapper||"div"}},(()=>({[o?.clone?m.cloneContentElement.name:m.content.name]:A})),{get style(){return a()?{}:o?.clone?{position:"absolute",opacity:0}:{"border-radius":o.options?.cornerRadius+"px",border:o?.options?.border?.size+"px solid "+o?.options?.border?.color}},get children(){return o.children}}));return[e(M,{get options(){return i?.options},randomId:A}),i.options?.border?e(t,r({component:"div"},(()=>({[m.wrapperBorder.name]:A})),{get children(){return[e(t,r({component:"span"},(()=>({[m.border.name]:a()?A:""})))),e(d,r(i,{clone:!0})),e(d,i)]}})):e(d,i)]};export{T as default};