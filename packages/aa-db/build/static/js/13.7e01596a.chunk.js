(this["webpackJsonpaa-db"]=this["webpackJsonpaa-db"]||[]).push([[13],{140:function(e,t,a){"use strict";var r=a(12),n=a(13),s=a(22),i=a(21),c=a(0),l=a.n(c),o=function(e){Object(s.a)(a,e);var t=Object(i.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(n.a)(a,[{key:"render",value:function(){var e;return l.a.createElement("img",{alt:"",src:this.props.location,style:{height:null!==(e=this.props.height)&&void 0!==e?e:"2em"}})}}]),a}(l.a.Component);t.a=o},147:function(e,t,a){"use strict";var r=a(12),n=a(13),s=a(22),i=a(21),c=a(0),l=a.n(c),o=new Map([[1,"./assets/star1.png"],[2,"./assets/star2.png"],[3,"./assets/star3.png"],[4,"./assets/star4.png"],[5,"./assets/star5.png"]]),u=function(e){Object(s.a)(a,e);var t=Object(i.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(n.a)(a,[{key:"render",value:function(){var e;return l.a.createElement("span",null,o.has(this.props.rarity)?l.a.createElement("img",{alt:"".concat(this.props.rarity," star(s)"),src:o.get(this.props.rarity),style:{height:null!==(e=this.props.height)&&void 0!==e?e:18}}):null)}}]),a}(l.a.Component);t.a=u},149:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));var r=a(152);var n=a(161);function s(e){return function(e){if(Array.isArray(e))return Object(r.a)(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||Object(n.a)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},152:function(e,t,a){"use strict";function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,r=new Array(t);a<t;a++)r[a]=e[a];return r}a.d(t,"a",(function(){return r}))},157:function(e,t,a){"use strict";var r=a(1),n=a(3),s=a(4),i=a.n(s),c=a(0),l=a.n(c),o=a(5),u=l.a.forwardRef((function(e,t){var a=e.bsPrefix,s=e.className,c=e.striped,u=e.bordered,p=e.borderless,h=e.hover,m=e.size,f=e.variant,d=e.responsive,g=Object(n.a)(e,["bsPrefix","className","striped","bordered","borderless","hover","size","variant","responsive"]),v=Object(o.b)(a,"table"),b=i()(s,v,f&&v+"-"+f,m&&v+"-"+m,c&&v+"-striped",u&&v+"-bordered",p&&v+"-borderless",h&&v+"-hover"),y=l.a.createElement("table",Object(r.a)({},g,{className:b,ref:t}));if(d){var E=v+"-responsive";return"string"===typeof d&&(E=E+"-"+d),l.a.createElement("div",{className:E},y)}return y}));t.a=u},161:function(e,t,a){"use strict";a.d(t,"a",(function(){return n}));var r=a(152);function n(e,t){if(e){if("string"===typeof e)return Object(r.a)(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(a):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?Object(r.a)(e,t):void 0}}},172:function(e,t,a){"use strict";var r=a(1),n=a(3),s=a(4),i=a.n(s),c=a(0),l=a.n(c),o=a(5),u=["xl","lg","md","sm","xs"],p=l.a.forwardRef((function(e,t){var a=e.bsPrefix,s=e.className,c=e.noGutters,p=e.as,h=void 0===p?"div":p,m=Object(n.a)(e,["bsPrefix","className","noGutters","as"]),f=Object(o.b)(a,"row"),d=f+"-cols",g=[];return u.forEach((function(e){var t,a=m[e];delete m[e];var r="xs"!==e?"-"+e:"";null!=(t=null!=a&&"object"===typeof a?a.cols:a)&&g.push(""+d+r+"-"+t)})),l.a.createElement(h,Object(r.a)({ref:t},m,{className:i.a.apply(void 0,[s,f,c&&"no-gutters"].concat(g))}))}));p.displayName="Row",p.defaultProps={noGutters:!1},t.a=p},247:function(e,t,a){},269:function(e,t,a){"use strict";a.r(t);var r=a(149),n=a(12),s=a(13),i=a(22),c=a(21),l=a(11),o=a(0),u=a.n(o),p=a(1),h=a(3),m=a(4),f=a.n(m),d=a(5),g=a(8),v=a(43),b=u.a.forwardRef((function(e,t){var a=e.active,r=e.disabled,n=e.className,s=e.style,i=e.activeLabel,c=e.children,l=Object(h.a)(e,["active","disabled","className","style","activeLabel","children"]),o=a||r?"span":v.a;return u.a.createElement("li",{ref:t,style:s,className:f()(n,"page-item",{active:a,disabled:r})},u.a.createElement(o,Object(p.a)({className:"page-link",disabled:r},l),c,a&&i&&u.a.createElement("span",{className:"sr-only"},i)))}));b.defaultProps={active:!1,disabled:!1,activeLabel:"(current)"},b.displayName="PageItem";var y=b;function E(e,t,a){var r,n;return void 0===a&&(a=e),n=r=function(e){function r(){return e.apply(this,arguments)||this}return Object(g.a)(r,e),r.prototype.render=function(){var e=this.props,r=e.children,n=Object(h.a)(e,["children"]);return delete n.active,u.a.createElement(b,n,u.a.createElement("span",{"aria-hidden":"true"},r||t),u.a.createElement("span",{className:"sr-only"},a))},r}(u.a.Component),r.displayName=e,n}var j=E("First","\xab"),O=E("Prev","\u2039","Previous"),N=E("Ellipsis","\u2026","More"),P=E("Next","\u203a"),x=E("Last","\xbb"),k=u.a.forwardRef((function(e,t){var a=e.bsPrefix,r=e.className,n=e.children,s=e.size,i=Object(h.a)(e,["bsPrefix","className","children","size"]),c=Object(d.b)(a,"pagination");return u.a.createElement("ul",Object(p.a)({ref:t},i,{className:f()(r,c,s&&c+"-"+s)}),n)}));k.First=j,k.Prev=O,k.Ellipsis=N,k.Item=y,k.Next=P,k.Last=x;var w=k,I=a(172),S=a(89),C=a(135),R=a(157),A=a(16),L=a(49),F=a(60),M=a(140),z=a(10),G=a(147),T=(a(247),a(7)),B=function(e){Object(i.a)(a,e);var t=Object(c.a)(a);function a(e){var r;return Object(n.a)(this,a),(r=t.call(this,e)).state={loading:!0,craftEssences:[],activeRarityFilters:[],perPage:200,page:0},r}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var e=this;try{T.a.setRegion(this.props.region),L.a.craftEssenceList().then((function(t){e.setState({loading:!1,craftEssences:t})}))}catch(t){this.setState({error:t})}}},{key:"craftEssences",value:function(){var e=this,t=this.state.craftEssences.slice().reverse();if(this.state.activeRarityFilters.length>0&&(t=t.filter((function(t){return-1!==e.state.activeRarityFilters.indexOf(t.rarity)}))),this.state.search){var a=this.state.search.split(" ").filter((function(e){return e})).map((function(e){return e.toLowerCase()}));t=t.filter((function(e){return a.every((function(t){return e.name.toLowerCase().includes(t)}))}))}return t}},{key:"pageItem",value:function(e,t,a,r,n){var s=this;return u.a.createElement("li",{key:a,className:"page-item"+(r?" active":"")+(n?" disabled":"")},n?u.a.createElement("span",{className:"page-link"},e):u.a.createElement("button",{className:"page-link",onClick:function(){return s.setPage(t)}},e))}},{key:"paginator",value:function(e){for(var t=this,a=[],n=Math.ceil(e/this.state.perPage)-1,s=[],i=[],c=0;c<4;c++){var l=this.state.page-c-1;l>=0&&s.unshift(l);var o=this.state.page+c+1;o<=n&&i.push(o)}for(;s.length+i.length+1>5;)i.length>s.length?i.pop():s.shift();var p=s.concat([this.state.page],i);return a.push(this.pageItem("<",this.state.page-1,"prev",!1,this.state.page<=0)),p[0]>0&&(a.push(this.pageItem("1",0,"first",!1,!1)),p[0]>1&&a.push(this.pageItem("\u2026",0,"firstEllipsis",!1,!0))),a.push.apply(a,Object(r.a)(p.map((function(e){return t.pageItem((e+1).toString(),e,e,e===t.state.page,!1)})))),p[p.length-1]<n&&(a.push(this.pageItem("\u2026",n,"lastEllipsis",!1,!0)),p[p.length-1]<n&&a.push(this.pageItem((n+1).toString(),n,"last",!1,!1))),a.push(this.pageItem(">",this.state.page+1,"next",!1,this.state.page>=n)),u.a.createElement("div",{style:{marginBottom:20}},u.a.createElement(w,null,a))}},{key:"setPage",value:function(e){this.setState({page:e})}},{key:"render",value:function(){var e,t=this;if(this.state.error)return u.a.createElement(F.a,{error:this.state.error});if(this.state.loading)return u.a.createElement(z.a,null);var a=this.craftEssences(),r=a.length>this.state.perPage,n=a.slice(this.state.perPage*this.state.page,this.state.perPage*(this.state.page+1));return u.a.createElement("div",{id:"craft-essences"},u.a.createElement(I.a,null,u.a.createElement(S.a,{md:12,lg:{offset:r?0:9,order:2,span:3}},u.a.createElement(C.a,{inline:!0,style:{justifyContent:"center",marginBottom:20}},u.a.createElement(C.a.Control,{style:{marginLeft:"auto"},placeholder:"Search",value:null!==(e=this.state.search)&&void 0!==e?e:"",onChange:function(e){t.setState({search:e.target.value,page:0})}}))),a.length>this.state.perPage?u.a.createElement(S.a,{md:12,lg:{order:1,span:9}},this.paginator(a.length)):void 0),u.a.createElement(R.a,{striped:!0,bordered:!0,hover:!0,responsive:!0},u.a.createElement("thead",null,u.a.createElement("tr",null,u.a.createElement("th",{style:{textAlign:"center",width:"1px"}},"#"),u.a.createElement("th",{style:{textAlign:"center",width:"1px"}},"Thumbnail"),u.a.createElement("th",null,"Name"),u.a.createElement("th",null,"Rarity"))),u.a.createElement("tbody",null,n.map((function(e,a){var r="/".concat(t.props.region,"/craft-essence/").concat(e.collectionNo);return u.a.createElement("tr",{key:a},u.a.createElement("td",{align:"center"},u.a.createElement(A.b,{to:r},e.collectionNo)),u.a.createElement("td",{align:"center"},u.a.createElement(A.b,{to:r},u.a.createElement(M.a,{type:l.e.SERVANT_EQUIP,rarity:e.rarity,location:e.face,height:50}))),u.a.createElement("td",null,u.a.createElement(A.b,{to:r},e.name)),u.a.createElement("td",null,u.a.createElement(G.a,{rarity:e.rarity})))})))),a.length>this.state.perPage?this.paginator(a.length):void 0)}}]),a}(u.a.Component);t.default=B}}]);
//# sourceMappingURL=13.7e01596a.chunk.js.map