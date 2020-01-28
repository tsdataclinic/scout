(this["webpackJsonpnew-york-open-data-explorer"]=this["webpackJsonpnew-york-open-data-explorer"]||[]).push([[0],{41:function(e,t,a){e.exports=a(96)},48:function(e,t,a){},58:function(e,t,a){},62:function(e,t,a){},66:function(e,t,a){},86:function(e,t,a){},87:function(e,t,a){},88:function(e,t,a){},89:function(e,t,a){},90:function(e,t,a){},94:function(e,t,a){},96:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a.n(n),r=a(32),o=a.n(r),l=(a(46),a(47),a(48),a(8)),i=a(11),s=a(24),u=a(1),d=(a(58),a(4)),m=a(2),f=a(35),E=a(9),p=a(18),v=a.n(p),b="https://api.us.socrata.com/api/catalog/v1?domains=data.cityofnewyork.us&search_context=data.cityofnewyork.us",h=["BIN","BBL","NTA","Community Board","Census Tract","DBN","Council District","School Name","City Council Districts","DFTA ID"];function O(e){var t,a=arguments;return v.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return t=a.length>1&&void 0!==a[1]?a[1]:100,n.abrupt("return",fetch("".concat(b,"&offset=").concat(e*t,"&limit=").concat(t)).then((function(e){return e.json()})));case 2:case"end":return n.stop()}}))}function j(e){return new Set([].concat(Object(d.a)(e.resource.columns_name),Object(d.a)(e.resource.columns_field_name)))}function g(e,t){var a=j(t),n=new Set(Object(d.a)(e).filter((function(e){return a.has(e)&&h.includes(e)})));return Array.from(n)}var C=new f.a("SocrataCache");C.version(1).stores({SocrataCache:"id"});var y=Object(n.createContext)(),N={datasets:[],tagList:[],categories:[],departments:[],stateLoaded:!1},T=function(e,t){var a=t.type,n=t.payload;switch(a){case"UPDATE_OPEN_DATASET_MANIFEST":return Object(m.a)({},e,{datasets:n});case"UPDATE_TAGS":return Object(m.a)({},e,{tagList:n});case"UPDATE_CATEGORIES":return Object(m.a)({},e,{categories:n});case"UPDATE_DEPARTMENTS":return Object(m.a)({},e,{departments:n});case"HYDRATE_STATE":return Object(m.a)({},e,{},n);case"SET_LOADED":return Object(m.a)({},e,{stateLoaded:!0});default:return e}},_=function(){return Object(n.useContext)(y)};function A(e){var t=_(),a=Object(u.a)(t,1)[0].datasets;return Object(n.useMemo)((function(){return e?function(e,t){var a=j(e);return t.map((function(e){return{dataset:e,joinableColumns:g(a,e)}})).filter((function(t){return t.joinableColumns.length>0&&t.dataset.resource.id!==e.resource.id}))}(e,a):[]}),[e,a])}function S(e){var t=e.tags,a=e.term,c=e.categories,r=e.departments,o=e.ids,l=_(),i=Object(u.a)(l,1)[0].datasets;return Object(n.useMemo)((function(){var e=Object(d.a)(i);return o?e.filter((function(e){return o.includes(e.resource.id)})):(t&&t.length>0&&(e=e.filter((function(e){return e.classification.domain_tags.filter((function(e){return t.includes(e)})).length>0}))),c&&c.length>0&&(e=e.filter((function(e){return e.classification.categories.filter((function(e){return c.includes(e)})).length>0}))),r&&r>0&&(e=e.filter((function(e){var t;return r.includes(null===(t=e.classification.domain_metadata.find((function(e){return"Dataset-Information_Agency"===e.key})))||void 0===t?void 0:t.value)}))),a&&a.length>0&&(e=e.filter((function(e){return e.resource.name.toLowerCase().includes(a.toLowerCase())}))),e)}),[i,o,t,c,r,a])}function D(e){var t=Object(n.useState)([]),a=Object(u.a)(t,2),c=a[0],r=a[1];return Object(n.useEffect)((function(){var t=[];e.forEach((function(e){e.joinableColumns.forEach((function(a){var n,c;t.push((n=e.dataset,c=a,fetch("https://data.cityofnewyork.us/resource/".concat(n.resource.id,".json?$select=distinct ").concat(c.replace(/ /g,"_"))).then((function(e){return e.json()})).then((function(e){return e.errorCode?[]:e.map((function(e){return Object.values(e)[0]}))}))).then((function(t){return{dataset:e.dataset.resource.id,col:a,distinct:t}})))}))})),t=t.map((function(e){return e.catch((function(){}))})),Promise.all(t).then((function(e){return r(e)}))}),[e]),c}var w=Object(n.createContext)(),L={datasets:[],name:null},k=function(e,t){var a=t.type,n=t.payload;switch(a){case"ADD_TO_COLLECTION":return Object(m.a)({},e,{datasets:[].concat(Object(d.a)(e.datasets),[n])});case"REMOVE_FROM_COLLECTION":return Object(m.a)({},e,{datasets:e.datasets.filter((function(e){return e!==n}))});case"SET_NAME":return Object(m.a)({},e,{name:n});case"CLEAR_COLLECTION":return Object(m.a)({},e,{datasets:[]});default:return e}};function x(){var e=Object(n.useContext)(w),t=Object(u.a)(e,2),a=t[0],c=t[1];return[a,{clearCollection:function(){console.log("clearning"),c({type:"CLEAR_COLLECTION"})},addToCollection:function(e){return c({type:"ADD_TO_COLLECTION",payload:e})},removeFromCollection:function(e){return c({type:"REMOVE_FROM_COLLECTION",payload:e})},setName:function(e){return c({type:"SET_NAME",payload:e})}}]}a(62);var M=a(36),I=a.n(M);function R(e){var t=e.html,a=e.className,n=I.a.sanitize(t);return c.a.createElement("div",{className:a,dangerouslySetInnerHTML:{__html:n}})}function P(e){var t,a=e.dataset,n=e.onAddToCollection,r=e.onRemoveFromCollection,o=e.inCollection;return c.a.createElement("div",{className:"dataset",key:a.resource.id},c.a.createElement("div",{className:"dataset-title"},c.a.createElement(l.Link,{to:"/dataset/".concat(a.resource.id)},c.a.createElement("h2",null,a.resource.name)),c.a.createElement("p",null,a.resource.attribution)),n&&c.a.createElement("button",{className:"collection-button",type:"button",onClick:function(){return o?r(a.resource.id):n(a.resource.id)}},o?"Remove from collection":"Add to collection"),c.a.createElement("div",{className:"dataset-last-update"},c.a.createElement("p",{className:"header"},"Last Updated"),c.a.createElement("p",null,(t=a.resource.updatedAt,new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})))),c.a.createElement(R,{className:"dataset-description",html:a.resource.description}),c.a.createElement("div",{className:"dataset-meta"},c.a.createElement("div",{className:"update-frequency"},c.a.createElement("span",null,"Update frequency:"),"weekly"),c.a.createElement("div",{className:"dataset-tags"},c.a.createElement("span",null,"Tags:"),a.classification.domain_tags.join(", "))))}var U=a(37),B=a.n(U);function F(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:20,a=Object(n.useMemo)((function(){return Math.ceil(e.length/t)}),[e,t]),r=Object(n.useState)(0),o=Object(u.a)(r,2),l=o[0],i=o[1];Object(n.useEffect)((function(){i(0)}),[e]);var s=c.a.createElement("nav",null,c.a.createElement(B.a,{previousLabel:"previous",nextLabel:"next",breakLabel:"...",breakClassName:"break-me",pageCount:a,onPageChange:function(e){var t=e.selected;i(t)},containerClassName:"pagination",subContainerClassName:"pages pagination",activeClassName:"active",previousClassName:"page-item",nextClassName:"page-item",pageClassName:"page-item"})),d=Object(n.useMemo)((function(){return e.slice(l*t,(l+1)*t)}),[t,l,e]);return[d,{pageButtons:s}]}a(66);function J(e){var t=e.items,a=e.selected,r=e.onChange,o=e.title,l=Object(n.useState)(""),i=Object(u.a)(l,2),s=i[0],m=i[1],f=Object(n.useMemo)((function(){return Object.keys(t)}),[t]),E=F(Object(n.useMemo)((function(){return f?f.filter((function(e){return e.includes(s)})):[]}),[f,s]),10),p=Object(u.a)(E,2),v=p[0],b=p[1].pageButtons;return c.a.createElement("div",{className:"mutli-selector"},c.a.createElement("h2",null,o),c.a.createElement("div",{className:"search"},c.a.createElement("input",{placeholder:"filter",value:s,onChange:function(e){return m(e.target.value)}})),c.a.createElement("ul",{className:"multi-list"},v.map((function(e){return c.a.createElement("li",{key:e,onClick:function(){return function(e){var t=a.includes(e)?a.filter((function(t){return t!==e})):[].concat(Object(d.a)(a),[e]);r(t)}(e)},className:"multi-buttons ".concat(a&&a.includes(e)?"selected":"")},c.a.createElement("input",{type:"checkbox",checked:a&&a.includes(e),className:"checkbox"}),c.a.createElement("span",{className:"item-name"},e),c.a.createElement("span",{className:"pill"},t[e]))}))),b,a&&a.length>0&&c.a.createElement("button",{type:"button",onClick:function(){r([])}},"clear"))}function G(){var e=function(){var e=_();return Object(u.a)(e,1)[0].categories}(),t=function(){var e=_();return Object(u.a)(e,1)[0].tagList}(),a=function(){var e=_();return Object(u.a)(e,1)[0].departments}(),r=Object(n.useState)([]),o=Object(u.a)(r,2),l=o[0],i=o[1],s=Object(n.useState)([]),d=Object(u.a)(s,2),m=d[0],f=d[1],E=Object(n.useState)([]),p=Object(u.a)(E,2),v=p[0],b=p[1],h=Object(n.useState)(""),O=Object(u.a)(h,2),j=O[0],g=O[1],C=x(),y=Object(u.a)(C,2),N=y[0],T=y[1],A=T.addToCollection,D=T.removeFromCollection,w=S({tags:l,categories:m,term:j,departments:v}),L=F(w,5),k=Object(u.a)(L,2),M=k[0],I=k[1].pageButtons;return c.a.createElement("div",{className:"home-page"},c.a.createElement("div",{className:"filters"},c.a.createElement("div",{className:"categories"},c.a.createElement(J,{items:e,onChange:f,selected:m,title:"Categories"})),c.a.createElement("div",{className:"tags"},c.a.createElement(J,{items:t,selected:l,onChange:i,title:"Tags"})),c.a.createElement("div",{className:"departments"},c.a.createElement(J,{items:a,selected:v,onChange:b,title:"Departments"}))),c.a.createElement("div",{className:"datasets"},c.a.createElement("div",{className:"search"},c.a.createElement("input",{type:"text",onChange:function(e){return g(e.target.value)},value:j,placeholder:"Search for dataset"})),c.a.createElement("div",{className:"count-and-sort"},c.a.createElement("p",null,c.a.createElement("span",{className:"bold"},w.length)," datasets"),c.a.createElement("p",null,"Sort by: ",c.a.createElement("span",{className:"bold"},"Recently updated"))),c.a.createElement("ul",{className:"dataset-list"},M.map((function(e){var t;return c.a.createElement(P,{key:null===e||void 0===e?void 0:null===(t=e.resource)||void 0===t?void 0:t.id,dataset:e,inCollection:N.datasets.includes(e.resource.id),onAddToCollection:A,onRemoveFromCollection:D})}))),c.a.createElement("div",null,I)))}a(38),a(68);a(86);a(87);a(88);function q(e){var t,a,n,r=function(e){var t=_();return Object(u.a)(t,1)[0].datasets.find((function(t){return t.resource.id===e}))}(e.match.params.datasetID),o=F(A(r)),l=Object(u.a)(o,2),i=l[0],s=(l[1].pageButtons,D(i),null===r||void 0===r?void 0:r.resource),d=(null===s||void 0===s||s.page_views,null===r||void 0===r?void 0:r.classification),m=null===d||void 0===d?void 0:d.domain_metadata,f=(null===m||void 0===m||(null===(t=m.find((function(e){var t=e.key,a=e.value;return"Update_Automation"===t&&"No"===a})))||void 0===t||t.value),null===m||void 0===m||(null===(a=m.find((function(e){return"Update_Update-Frequency"===e.key})))||void 0===a||a.value),null===m||void 0===m?void 0:null===(n=m.find((function(e){return"Dataset-Information_Agency"===e.key})))||void 0===n?void 0:n.value);return console.log(r),r?c.a.createElement("div",{className:"dataset-page"},c.a.createElement("div",{className:"dataset-details"},c.a.createElement("h2",null,s.name),c.a.createElement("p",null,f),c.a.createElement("p",null,s.description),c.a.createElement("h3",null,"Metadata"),c.a.createElement("h3",null,"Updated")),c.a.createElement("div",{className:"dataset-recomendataions"},c.a.createElement("h2",null,"Recomendations"),c.a.createElement("h3",null,"Potential Join Columns"),c.a.createElement("p",null,"Find datasets that share a column with the current dataset. These columns might be interesting datasets to join with the current dataset to add additional details or bring in context"))):c.a.createElement("h1",null,"Loading...")}a(89);function H(){var e=x(),t=Object(u.a)(e,2),a=t[0],n=t[1].clearCollection;return a.datasets&&a.datasets.length>0?c.a.createElement("div",{className:"collection-bar"},c.a.createElement("span",null,a.datasets.length," datasets selected"),c.a.createElement(l.Link,{to:"/collection/new"},c.a.createElement("button",{type:"submit"},"Create Collection")),c.a.createElement("button",{type:"button",onClick:n},"Clear")):null}var Y=a(39),z=(a(90),a(102)),V=a(103),W=a(104),$=a(105),K=a(106),Q=a(107);function X(e){var t=e.match.params,a=t.name,n=t.datasetIDs,r=window.location.href,o=S({ids:n.split(",")}),l=Object(Y.useCopyClipboard)("".concat(r)),i=Object(u.a)(l,2),s=i[0],d=i[1];return c.a.createElement("div",{className:"collections-page"},c.a.createElement("h1",null,a),o.map((function(e){return c.a.createElement(P,{dataset:e})})),c.a.createElement("div",{className:"share"},"Share this collection:",c.a.createElement("p",null,c.a.createElement(z.a,{url:r},c.a.createElement(V.a,null))," ",c.a.createElement(W.a,{url:r},c.a.createElement($.a,null)),c.a.createElement(K.a,{url:r},c.a.createElement(Q.a,null))),c.a.createElement("p",null,"Share link ",r," ",c.a.createElement("button",{type:"button",onClick:d}," ",s?"Copied":"Copy"," "))))}a(94);function Z(e){var t=e.history,a=x(),n=Object(u.a)(a,2),r=n[0],o=n[1].setName,l=S({ids:r.datasets});return c.a.createElement("div",{className:"create-collection-modal"},c.a.createElement("h3",null,"Create collection with the following datasets"),c.a.createElement("ul",null,l.map((function(e){return c.a.createElement("li",null,e.resource.name)}))),c.a.createElement("input",{type:"text",placeholder:"Name",value:r.name,onChange:function(e){return o(e.target.value)}}),c.a.createElement("button",{type:"submit",onClick:function(){return function(e){var a="/collection/".concat(e.name,"/").concat(e.datasets.join(","));t.push(a)}(r)}},"Create"))}a(95);var ee=function(){return c.a.createElement("div",{className:"App"},c.a.createElement("header",null,c.a.createElement("h1",null,"Data Clinic")),c.a.createElement(s.ModalContainer,null),c.a.createElement("div",{className:"content"},c.a.createElement(l.BrowserRouter,{basename:"/NewYorkOpenDataExplorer"},c.a.createElement(i.g,null,c.a.createElement(i.d,{path:"/",exact:!0,component:G}),c.a.createElement(i.d,{path:"/dataset/:datasetID",exact:!0,component:q}),c.a.createElement(i.d,{path:"/collection/:name/:datasetIDs",exact:!0,component:X}),c.a.createElement(s.ModalRoute,{path:"/collection/new",parentPath:"/",component:Z}),c.a.createElement(i.c,{from:"/",to:"/"})),c.a.createElement(H,null))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(c.a.createElement((function(e){var t=e.children,a=Object(n.useReducer)(T,N),r=Object(u.a)(a,2),o=r[0],l=r[1];Object(n.useEffect)((function(){C.SocrataCache.get(1).then((function(e){if(e){var t=JSON.parse(e.data);l({type:"HYDRATE_STATE",payload:Object(m.a)({},N,{},t,{cache_loaded:!0})})}else(function(){var e,t,a;return v.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,v.a.awrap(O(0,1));case 2:return e=n.sent,t=e.resultSetSize,a=Math.ceil(t/100),n.abrupt("return",Promise.all(Object(d.a)(Array(a)).map((function(e,t){return O(t).then((function(e){return e.results}))}))).then((function(e){return e.reduce((function(e,t){return[].concat(Object(d.a)(t),Object(d.a)(e))}),[])})));case 6:case"end":return n.stop()}}))})().then((function(e){var t=function(e){return e.reduce((function(e,t){return[].concat(Object(d.a)(e),Object(d.a)(t.classification.domain_tags?t.classification.domain_tags:[]))}),[]).reduce((function(e,t){return t in e?Object(m.a)({},e,Object(E.a)({},t,e[t]+1)):Object(m.a)({},e,Object(E.a)({},t,1))}),{})}(e),a=function(e){return e.reduce((function(e,t){return[].concat(Object(d.a)(e),Object(d.a)(t.classification.categories?t.classification.categories:[]))}),[]).reduce((function(e,t){return t in e?Object(m.a)({},e,Object(E.a)({},t,e[t]+1)):Object(m.a)({},e,Object(E.a)({},t,1))}),{})}(e),n=function(e){return e.map((function(e){return e.classification.domain_metadata.find((function(e){return"Dataset-Information_Agency"===e.key}))})).filter((function(e){return e})).map((function(e){return e.value})).reduce((function(e,t){return t in e?Object(m.a)({},e,Object(E.a)({},t,e[t]+1)):Object(m.a)({},e,Object(E.a)({},t,1))}),{})}(e);l({type:"UPDATE_OPEN_DATASET_MANIFEST",payload:e}),l({type:"UPDATE_TAGS",payload:t}),l({type:"UPDATE_CATEGORIES",payload:a}),l({type:"UPDATE_DEPARTMENTS",payload:n}),l({type:"SET_LOADED"})}))}))}),[]);var i=o.datasets,s=o.tagList,f=o.categories,p=o.departments,b=o.stateLoaded;return Object(n.useEffect)((function(){b&&C.SocrataCache.put({data:JSON.stringify({datasets:i,tagList:s,categories:f,departments:p}),id:1})}),[i,s,f,p,b]),c.a.createElement(y.Provider,{value:[o,l]},t)}),null,c.a.createElement((function(e){var t=e.children,a=Object(n.useReducer)(k,L),r=Object(u.a)(a,2),o=r[0],l=r[1];return c.a.createElement(w.Provider,{value:[o,l]},t)}),null,c.a.createElement(ee,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[41,1,2]]]);
//# sourceMappingURL=main.5e17d9bb.chunk.js.map