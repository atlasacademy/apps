(this["webpackJsonpaa-db"]=this["webpackJsonpaa-db"]||[]).push([[15],{145:function(t,e,a){"use strict";var r=a(13),n=a(14),s=a(23),i=a(22),l=a(0),c=a.n(l),o=function(t){Object(s.a)(a,t);var e=Object(i.a)(a);function a(){return Object(r.a)(this,a),e.apply(this,arguments)}return Object(n.a)(a,[{key:"render",value:function(){var t;return c.a.createElement("img",{alt:"",src:this.props.location,style:{height:null!==(t=this.props.height)&&void 0!==t?t:"2em"}})}}]),a}(c.a.Component);e.a=o},148:function(t,e,a){"use strict";function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var a=0,r=new Array(e);a<e;a++)r[a]=t[a];return r}a.d(e,"a",(function(){return r}))},149:function(t,e,a){"use strict";a.d(e,"a",(function(){return s}));var r=a(148);var n=a(154);function s(t){return function(t){if(Array.isArray(t))return Object(r.a)(t)}(t)||function(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||Object(n.a)(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},154:function(t,e,a){"use strict";a.d(e,"a",(function(){return n}));var r=a(148);function n(t,e){if(t){if("string"===typeof t)return Object(r.a)(t,e);var a=Object.prototype.toString.call(t).slice(8,-1);return"Object"===a&&t.constructor&&(a=t.constructor.name),"Map"===a||"Set"===a?Array.from(a):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?Object(r.a)(t,e):void 0}}},156:function(t,e,a){"use strict";var r=a(13),n=a(14),s=a(23),i=a(22),l=a(0),c=a.n(l),o=new Map([[1,"./assets/star1.png"],[2,"./assets/star2.png"],[3,"./assets/star3.png"],[4,"./assets/star4.png"],[5,"./assets/star5.png"]]),u=function(t){Object(s.a)(a,t);var e=Object(i.a)(a);function a(){return Object(r.a)(this,a),e.apply(this,arguments)}return Object(n.a)(a,[{key:"render",value:function(){var t;return c.a.createElement("span",null,o.has(this.props.rarity)?c.a.createElement("img",{alt:"".concat(this.props.rarity," star(s)"),src:o.get(this.props.rarity),style:{height:null!==(t=this.props.height)&&void 0!==t?t:18}}):null)}}]),a}(c.a.Component);e.a=u},176:function(t,e,a){"use strict";var r=a(13),n=a(14),s=a(23),i=a(22),l=a(11),c=a(0),o=a.n(c),u=new Map([[0,0],[1,1],[2,1],[3,2],[4,3],[5,3]]),h=new Map([[l.d.SABER,1],[l.d.ARCHER,2],[l.d.LANCER,3],[l.d.RIDER,4],[l.d.CASTER,5],[l.d.ASSASSIN,6],[l.d.BERSERKER,7],[l.d.SHIELDER,8],[l.d.RULER,9],[l.d.ALTER_EGO,10],[l.d.AVENGER,11],[l.d.MOON_CANCER,23],[l.d.FOREIGNER,25],[l.d.GRAND_CASTER,5],[l.d.BEAST_I,20],[l.d.BEAST_II,20],[l.d.BEAST_IIIL,20],[l.d.BEAST_IIIR,20],[l.d.BEAST_UNKNOWN,20],[l.d.ALL,1001],[l.d.EXTRA,1002]]),p=function(t){Object(s.a)(a,t);var e=Object(i.a)(a);function a(){return Object(r.a)(this,a),e.apply(this,arguments)}return Object(n.a)(a,[{key:"render",value:function(){var t;return o.a.createElement("img",{alt:"",src:this.location(),style:{height:null!==(t=this.props.height)&&void 0!==t?t:24}})}},{key:"location",value:function(){var t,e=h.has(this.props.className)?h.get(this.props.className):12,a=null!==(t=this.props.rarity)&&void 0!==t?t:5,r=u.has(a)?u.get(a):3;return"https://assets.atlasacademy.io/GameData/NA/ClassIcons/class".concat(r,"_").concat(e,".png")}}]),a}(o.a.Component);e.a=p},245:function(t,e,a){},246:function(t,e,a){"use strict";var r=a(1),n=a(3),s=a(4),i=a.n(s),l=a(0),c=a.n(l),o=a(5),u=a(44),h=c.a.forwardRef((function(t,e){var a=t.active,s=t.disabled,l=t.className,o=t.style,h=t.activeLabel,p=t.children,d=Object(n.a)(t,["active","disabled","className","style","activeLabel","children"]),m=a||s?"span":u.a;return c.a.createElement("li",{ref:e,style:o,className:i()(l,"page-item",{active:a,disabled:s})},c.a.createElement(m,Object(r.a)({className:"page-link",disabled:s},d),p,a&&h&&c.a.createElement("span",{className:"sr-only"},h)))}));h.defaultProps={active:!1,disabled:!1,activeLabel:"(current)"},h.displayName="PageItem";var p=h;function d(t,e,a){function r(t){var r=t.children,s=Object(n.a)(t,["children"]);return c.a.createElement(h,s,c.a.createElement("span",{"aria-hidden":"true"},r||e),c.a.createElement("span",{className:"sr-only"},a))}return void 0===a&&(a=t),r.displayName=t,r}var m=d("First","\xab"),v=d("Prev","\u2039","Previous"),f=d("Ellipsis","\u2026","More"),g=d("Next","\u203a"),E=d("Last","\xbb"),y=c.a.forwardRef((function(t,e){var a=t.bsPrefix,s=t.className,l=t.children,u=t.size,h=Object(n.a)(t,["bsPrefix","className","children","size"]),p=Object(o.a)(a,"pagination");return c.a.createElement("ul",Object(r.a)({ref:e},h,{className:i()(s,p,u&&p+"-"+u)}),l)}));y.First=m,y.Prev=v,y.Ellipsis=f,y.Item=p,y.Next=g,y.Last=E;e.a=y},256:function(t,e,a){"use strict";a.r(e);var r=a(149),n=a(13),s=a(14),i=a(23),l=a(22),c=a(11),o=a(191),u=a.n(o),h=a(192),p=a.n(h),d=a(0),m=a.n(d),v=a(246),f=a(140),g=a(190),E=a(15),y=a(51),b=a(176),R=a(61),A=a(145),S=a(9),N=a(156),C=a(6),O=(a(245),[c.d.SABER,c.d.ARCHER,c.d.LANCER,c.d.RIDER,c.d.CASTER,c.d.ASSASSIN,c.d.BERSERKER,c.d.EXTRA]),j=function(t){Object(i.a)(a,t);var e=Object(l.a)(a);function a(t){var r;return Object(n.a)(this,a),(r=e.call(this,t)).state={loading:!0,servants:[],activeClassFilters:[],activeRarityFilters:[],perPage:100,page:0},r}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var t=this;try{C.a.setRegion(this.props.region),y.a.servantList().then((function(e){t.setState({loading:!1,servants:e})})),document.title="[".concat(this.props.region,"] Servants - Atlas Academy DB")}catch(e){this.setState({error:e})}}},{key:"isClassFilterActive",value:function(t){return-1!==this.state.activeClassFilters.indexOf(t)}},{key:"isExtra",value:function(t){return!(t===c.d.SABER||t===c.d.ARCHER||t===c.d.LANCER||t===c.d.RIDER||t===c.d.CASTER||t===c.d.ASSASSIN||t===c.d.BERSERKER)}},{key:"pageItem",value:function(t,e,a,r,n){var s=this;return m.a.createElement("li",{key:a,className:"page-item"+(r?" active":"")+(n?" disabled":"")},n?m.a.createElement("span",{className:"page-link"},t):m.a.createElement("button",{className:"page-link",onClick:function(){return s.setPage(e)}},t))}},{key:"paginator",value:function(t){for(var e=this,a=[],n=Math.ceil(t/this.state.perPage)-1,s=[],i=[],l=0;l<4;l++){var c=this.state.page-l-1;c>=0&&s.unshift(c);var o=this.state.page+l+1;o<=n&&i.push(o)}for(;s.length+i.length+1>5;)i.length>s.length?i.pop():s.shift();var u=s.concat([this.state.page],i);return a.push(this.pageItem("<",this.state.page-1,"prev",!1,this.state.page<=0)),u[0]>0&&(a.push(this.pageItem("1",0,"first",!1,!1)),u[0]>1&&a.push(this.pageItem("\u2026",0,"firstEllipsis",!1,!0))),a.push.apply(a,Object(r.a)(u.map((function(t){return e.pageItem((t+1).toString(),t,t,t===e.state.page,!1)})))),u[u.length-1]<n&&(a.push(this.pageItem("\u2026",n,"lastEllipsis",!1,!0)),u[u.length-1]<n&&a.push(this.pageItem((n+1).toString(),n,"last",!1,!1))),a.push(this.pageItem(">",this.state.page+1,"next",!1,this.state.page>=n)),m.a.createElement("div",{style:{marginBottom:20}},m.a.createElement(v.a,null,a))}},{key:"setPage",value:function(t){this.setState({page:t})}},{key:"toggleClassFilter",value:function(t){var e=!1,a=this.state.activeClassFilters.filter((function(a){return a!==c.d.ALL&&(a!==t||(e=!0,!1))}));e||a.push(t),this.setState({activeClassFilters:a})}},{key:"toggleRarityFilter",value:function(t){-1!==this.state.activeRarityFilters.indexOf(t)?this.setState({activeClassFilters:this.state.activeClassFilters.filter((function(t){return t!==c.d.ALL})),activeRarityFilters:this.state.activeRarityFilters.filter((function(e){return e!==t}))}):this.setState({activeClassFilters:this.state.activeClassFilters.filter((function(t){return t!==c.d.ALL})),activeRarityFilters:[].concat(Object(r.a)(this.state.activeRarityFilters),[t])})}},{key:"servants",value:function(){var t=this,e=this.state.servants.slice().reverse();if(this.state.activeRarityFilters.length>0&&(e=e.filter((function(e){return-1!==t.state.activeRarityFilters.indexOf(e.rarity)}))),this.state.activeClassFilters.length>0&&(e=e.filter((function(e){for(var a in t.state.activeClassFilters){var r=t.state.activeClassFilters[a];if(r===c.d.EXTRA&&t.isExtra(e.className))return!0;if(e.className===r)return!0}return!1}))),this.state.search){var a=u.a.remove(this.state.search.toLowerCase()).split(" ").filter((function(t){return t})).join("*");e=e.filter((function(t){var e=u.a.remove(t.name.toLowerCase());return p()(e,"*".concat(a,"*"))}))}return e}},{key:"render",value:function(){var t,e=this;if(this.state.error)return m.a.createElement(R.a,{error:this.state.error});if(this.state.loading)return m.a.createElement(S.a,null);var a=this.servants(),r=a.length>this.state.perPage,n=a.slice(this.state.perPage*this.state.page,this.state.perPage*(this.state.page+1));return m.a.createElement("div",{id:"servants"},m.a.createElement(f.a,{inline:!0,style:{justifyContent:"center"}},O.map((function(t){var a=e.isClassFilterActive(t);return m.a.createElement("span",{key:t,className:"filter",style:{opacity:a?1:.5},onClick:function(a){e.toggleClassFilter(t)}},m.a.createElement(b.a,{height:50,rarity:a?5:3,className:t}))})),m.a.createElement(f.a.Control,{style:{marginLeft:"auto"},placeholder:"Search",value:null!==(t=this.state.search)&&void 0!==t?t:"",onChange:function(t){e.setState({search:t.target.value})}})),m.a.createElement("br",null),r?m.a.createElement("div",null,this.paginator(a.length)):void 0,m.a.createElement("hr",null),m.a.createElement(g.a,{striped:!0,bordered:!0,hover:!0,responsive:!0},m.a.createElement("thead",null,m.a.createElement("tr",null,m.a.createElement("th",{style:{textAlign:"center",width:"1px"}},"#"),m.a.createElement("th",{style:{textAlign:"center",width:"1px"}},"Class"),m.a.createElement("th",{style:{textAlign:"center",width:"1px"}},"Thumbnail"),m.a.createElement("th",null,"Name"),m.a.createElement("th",null,"Rarity"))),m.a.createElement("tbody",null,n.map((function(t,a){var r="/".concat(e.props.region,"/servant/").concat(t.collectionNo);return m.a.createElement("tr",{key:a},m.a.createElement("td",{align:"center"},m.a.createElement(E.b,{to:r},t.collectionNo)),m.a.createElement("td",{align:"center"},m.a.createElement(b.a,{className:t.className,rarity:t.rarity,height:50})),m.a.createElement("td",{align:"center"},m.a.createElement(E.b,{to:r},m.a.createElement(A.a,{type:t.type,rarity:t.rarity,location:t.face,height:50}))),m.a.createElement("td",null,m.a.createElement(E.b,{to:r},t.name)),m.a.createElement("td",null,m.a.createElement(N.a,{rarity:t.rarity})))})))),r?this.paginator(a.length):void 0)}}]),a}(m.a.Component);e.default=j}}]);
//# sourceMappingURL=15.4514b648.chunk.js.map