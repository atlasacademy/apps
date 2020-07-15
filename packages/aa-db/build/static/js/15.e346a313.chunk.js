(this["webpackJsonpaa-db"]=this["webpackJsonpaa-db"]||[]).push([[15],{121:function(e,t,n){"use strict";var a=n(11),r=n(12),c=n(19),u=n(18),s=n(0),i=n.n(s),o=new Map([[1,"./assets/star1.png"],[2,"./assets/star2.png"],[3,"./assets/star3.png"],[4,"./assets/star4.png"],[5,"./assets/star5.png"]]),l=function(e){Object(c.a)(n,e);var t=Object(u.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(r.a)(n,[{key:"render",value:function(){var e;return i.a.createElement("span",null,o.has(this.props.rarity)?i.a.createElement("img",{alt:"".concat(this.props.rarity," star(s)"),src:o.get(this.props.rarity),style:{height:null!==(e=this.props.height)&&void 0!==e?e:18}}):null)}}]),n}(i.a.Component);t.a=l},129:function(e,t,n){"use strict";var a=n(11),r=n(12),c=n(19),u=n(18),s=n(0),i=n.n(s),o=function(e){Object(c.a)(n,e);var t=Object(u.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(r.a)(n,[{key:"render",value:function(){return i.a.createElement("img",{alt:"",src:this.props.location,style:this.props.height?{height:this.props.height}:void 0})}}]),n}(i.a.Component);t.a=o},174:function(e,t,n){},184:function(e,t,n){"use strict";n.r(t);var a=n(11),r=n(12),c=n(19),u=n(18),s=n(0),i=n.n(s),o=n(95),l=n(182),f=n(16),p=n(98),h=n(54),v=n(129),g=n(9),d=n(121),b=(n(174),function(e){Object(c.a)(n,e);var t=Object(u.a)(n);function n(e){var r;return Object(a.a)(this,n),(r=t.call(this,e)).state={loading:!0,craftEssences:[],activeRarityFilters:[]},r}return Object(r.a)(n,[{key:"componentDidMount",value:function(){var e=this;try{p.a.craftEssenceList(this.props.region).then((function(t){e.setState({loading:!1,craftEssences:t})}))}catch(t){this.setState({error:t})}}},{key:"craftEssences",value:function(){var e=this,t=this.state.craftEssences.slice().reverse();if(this.state.activeRarityFilters.length>0&&(t=t.filter((function(t){return-1!==e.state.activeRarityFilters.indexOf(t.rarity)}))),this.state.search){var n=this.state.search.split(" ").filter((function(e){return e})).map((function(e){return e.toLowerCase()}));t=t.filter((function(e){return n.every((function(t){return e.name.toLowerCase().includes(t)}))}))}return t}},{key:"render",value:function(){var e,t=this;return this.state.error?i.a.createElement(h.a,{error:this.state.error}):this.state.loading?i.a.createElement(g.a,null):i.a.createElement("div",{id:"craft-essences"},i.a.createElement(o.a,{inline:!0,style:{justifyContent:"center"}},i.a.createElement(o.a.Control,{style:{marginLeft:"auto"},placeholder:"Search",value:null!==(e=this.state.search)&&void 0!==e?e:"",onChange:function(e){t.setState({search:e.target.value})}})),i.a.createElement("hr",null),i.a.createElement(l.a,{striped:!0,bordered:!0,hover:!0},i.a.createElement("thead",null,i.a.createElement("tr",null,i.a.createElement("th",{style:{textAlign:"center",width:"1px"}},"#"),i.a.createElement("th",{style:{textAlign:"center",width:"1px"}},"Thumbnail"),i.a.createElement("th",null,"Name"),i.a.createElement("th",null,"Rarity"))),i.a.createElement("tbody",null,this.craftEssences().map((function(e,n){var a="/".concat(t.props.region,"/craft-essence/").concat(e.collectionNo);return i.a.createElement("tr",{key:n},i.a.createElement("td",{align:"center"},i.a.createElement(f.b,{to:a},e.collectionNo)),i.a.createElement("td",{align:"center"},i.a.createElement(f.b,{to:a},i.a.createElement(v.a,{type:e.type,rarity:e.rarity,location:e.face,height:50}))),i.a.createElement("td",null,i.a.createElement(f.b,{to:a},e.name)),i.a.createElement("td",null,i.a.createElement(d.a,{rarity:e.rarity})))})))))}}]),n}(i.a.Component));t.default=b},98:function(e,t,n){"use strict";var a=n(110),r=n(11),c=n(12),u=n(100),s=n.n(u),i=n(101),o=n(125),l=n.n(o),f=n(24),p=n(31),h=n(29),v=function(){function e(){Object(r.a)(this,e),this.cache=new Map,this.pending=new Map,this.pendingCatches=new Map}return Object(c.a)(e,[{key:"get",value:function(e,t,n){var a=this,r=this.cache.get(e);if(void 0!==r)return new Promise((function(e){e(r)}));var c=this.pending.get(e);return void 0!==c?new Promise((function(t,n){var r;c.push(t),(null!==(r=a.pendingCatches.get(e))&&void 0!==r?r:[]).push(n)})):(this.pending.set(e,[]),this.pendingCatches.set(e,[]),new Promise((function(r,c){t.call(null).then((function(t){var c;(null!==(c=a.pending.get(e))&&void 0!==c?c:[]).forEach((function(e){e.call(null,t)})),a.cache.set(e,t),a.pending.delete(e),a.pendingCatches.delete(e),null!==n&&window.setTimeout((function(){a.cache.delete(e)}),n),r(t)})).catch((function(t){var n;(null!==(n=a.pendingCatches.get(e))&&void 0!==n?n:[]).forEach((function(e){e.call(null,t)})),a.pending.delete(e),a.pendingCatches.delete(e),c(t)}))})))}}]),e}(),g="https://api.atlasacademy.io",d=function(){var e=Object(i.a)(s.a.mark((function e(t){var n;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.a.get(t);case 2:return n=e.sent,e.abrupt("return",n.data);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),b={buff:new v,craftEssence:new v,craftEssenceList:new v,func:new v,mysticCode:new v,mysticCodeList:new v,noblePhantasm:new v,quest:new v,servant:new v,servantList:new v,skill:new v,traitMap:new v},m=function(){function e(){Object(r.a)(this,e)}return Object(c.a)(e,null,[{key:"buff",value:function(e,t){var n=f.a.language(),a="".concat(e,"-").concat(n,"-").concat(t);return b.buff.get(a,(function(){var a="?reverse=true"+(n===p.a.ENGLISH?"&lang=en":"");return d("".concat(g,"/nice/").concat(e,"/buff/").concat(t).concat(a))}),2e4)}},{key:"craftEssence",value:function(e,t){var n=f.a.language(),a="".concat(e,"-").concat(n,"-").concat(t);return b.craftEssence.get(a,(function(){var a="?lore=true"+(n===p.a.ENGLISH?"&lang=en":"");return d("".concat(g,"/nice/").concat(e,"/equip/").concat(t).concat(a))}),2e4)}},{key:"craftEssenceList",value:function(){var t=Object(i.a)(s.a.mark((function t(n){var r,c,u;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n!==h.a.NA){t.next=4;break}return t.abrupt("return",e.getCacheableCraftEssenceList(h.a.NA));case 4:if(n!==h.a.JP||f.a.language()!==p.a.DEFAULT){t.next=6;break}return t.abrupt("return",e.getCacheableCraftEssenceList(h.a.JP));case 6:return t.next=8,e.getCacheableCraftEssenceList(h.a.JP);case 8:return r=t.sent,t.next=11,e.getCacheableCraftEssenceList(h.a.NA);case 11:return c=t.sent,u=new Map(c.map((function(e){return[e.id,e.name]}))),t.abrupt("return",r.map((function(e){var t;return Object(a.a)(Object(a.a)({},e),{},{name:null!==(t=u.get(e.id))&&void 0!==t?t:e.name})})));case 14:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},{key:"func",value:function(e,t){var n=f.a.language(),a="".concat(e,"-").concat(n,"-").concat(t);return b.func.get(a,(function(){var a="?reverse=true"+(n===p.a.ENGLISH?"&lang=en":"");return d("".concat(g,"/nice/").concat(e,"/function/").concat(t).concat(a))}),2e4)}},{key:"mysticCode",value:function(e,t){var n="".concat(e,"-").concat(t);return b.mysticCode.get(n,(function(){return d("".concat(g,"/nice/").concat(e,"/MC/").concat(t))}),2e4)}},{key:"mysticCodeList",value:function(){var t=Object(i.a)(s.a.mark((function t(n){var r,c,u;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n!==h.a.NA){t.next=4;break}return t.abrupt("return",e.getCacheableMysticCodeList(h.a.NA));case 4:if(n!==h.a.JP||f.a.language()!==p.a.DEFAULT){t.next=6;break}return t.abrupt("return",e.getCacheableMysticCodeList(h.a.JP));case 6:return t.next=8,e.getCacheableMysticCodeList(h.a.JP);case 8:return r=t.sent,t.next=11,e.getCacheableMysticCodeList(h.a.NA);case 11:return c=t.sent,u=new Map(c.map((function(e){return[e.id,e.name]}))),t.abrupt("return",r.map((function(e){var t;return Object(a.a)(Object(a.a)({},e),{},{name:null!==(t=u.get(e.id))&&void 0!==t?t:e.name})})));case 14:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},{key:"noblePhantasm",value:function(e,t){var n=f.a.language(),a="".concat(e,"-").concat(n,"-").concat(t);return b.noblePhantasm.get(a,(function(){var a="?reverse=true"+(n===p.a.ENGLISH?"&lang=en":"");return d("".concat(g,"/nice/").concat(e,"/NP/").concat(t).concat(a))}),2e4)}},{key:"quest",value:function(e,t,n){var a="".concat(e,"-").concat(t,"-").concat(n);return b.quest.get(a,(function(){return d("".concat(g,"/nice/").concat(e,"/quest/").concat(t,"/").concat(n))}),2e4)}},{key:"servant",value:function(e,t){var n=f.a.language(),a="".concat(e,"-").concat(n,"-").concat(t);return b.servant.get(a,(function(){var a="?lore=true"+(n===p.a.ENGLISH?"&lang=en":"");return d("".concat(g,"/nice/").concat(e,"/servant/").concat(t).concat(a))}),2e4)}},{key:"servantList",value:function(){var t=Object(i.a)(s.a.mark((function t(n){var r,c,u;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n!==h.a.NA){t.next=4;break}return t.abrupt("return",e.getCacheableServantList(h.a.NA));case 4:if(n!==h.a.JP||f.a.language()!==p.a.DEFAULT){t.next=6;break}return t.abrupt("return",e.getCacheableServantList(h.a.JP));case 6:return t.next=8,e.getCacheableServantList(h.a.JP);case 8:return r=t.sent,t.next=11,e.getCacheableServantList(h.a.NA);case 11:return c=t.sent,u=new Map(c.map((function(e){return[e.id,e.name]}))),t.abrupt("return",r.map((function(e){var t;return Object(a.a)(Object(a.a)({},e),{},{name:null!==(t=u.get(e.id))&&void 0!==t?t:e.name})})));case 14:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},{key:"skill",value:function(e,t){var n=f.a.language(),a="".concat(e,"-").concat(n,"-").concat(t);return b.skill.get(a,(function(){var a="?reverse=true"+(n===p.a.ENGLISH?"&lang=en":"");return d("".concat(g,"/nice/").concat(e,"/skill/").concat(t).concat(a))}),2e4)}},{key:"traitMap",value:function(e){return b.traitMap.get(e,(function(){return d("".concat(g,"/export/").concat(e,"/nice_trait.json"))}),null)}},{key:"searchBuffs",value:function(e,t,n){var a="?reverse=true";return f.a.language()===p.a.ENGLISH&&(a+="&lang=en"),t&&(a+="&name="+encodeURI(t)),n&&(a+="&type="+n),d("".concat(g,"/nice/").concat(e,"/buff/search").concat(a))}},{key:"searchFuncs",value:function(e,t,n,a,r){var c="?reverse=true";return f.a.language()===p.a.ENGLISH&&(c+="&lang=en"),t&&(c+="&popupText="+encodeURI(t)),n&&(c+="&type="+n),a&&(c+="&targetType="+a),r&&(c+="&targetTeam="+r),d("".concat(g,"/nice/").concat(e,"/function/search").concat(c))}},{key:"getCacheableCraftEssenceList",value:function(){var e=Object(i.a)(s.a.mark((function e(t){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",b.craftEssenceList.get(t,(function(){return d("".concat(g,"/export/").concat(t,"/basic_equip.json"))}),null));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"getCacheableMysticCodeList",value:function(){var e=Object(i.a)(s.a.mark((function e(t){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",b.mysticCodeList.get(t,(function(){return d("".concat(g,"/export/").concat(t,"/nice_mystic_code.json"))}),null));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"getCacheableServantList",value:function(){var e=Object(i.a)(s.a.mark((function e(t){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",b.servantList.get(t,(function(){return d("".concat(g,"/export/").concat(t,"/basic_servant.json"))}),null));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}]),e}();t.a=m}}]);
//# sourceMappingURL=15.e346a313.chunk.js.map