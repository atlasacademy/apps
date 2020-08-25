(this["webpackJsonpaa-db"]=this["webpackJsonpaa-db"]||[]).push([[0],{147:function(e,n,t){"use strict";t.d(n,"d",(function(){return a})),t.d(n,"e",(function(){return u})),t.d(n,"g",(function(){return r})),t.d(n,"a",(function(){return S})),t.d(n,"b",(function(){return m})),t.d(n,"c",(function(){return H})),t.d(n,"f",(function(){return Y}));var a,u,r,i=function(){var e=function(n,t){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])})(n,t)};return function(n,t){function a(){this.constructor=n}e(n,t),n.prototype=null===t?Object.create(t):(a.prototype=t.prototype,new a)}}();!function(e){e.PARTICLE="particle",e.REFERENCE="reference",e.TEXT="text",e.VALUE="value"}(a||(a={})),function(e){e.BUFF="buff",e.CARD="card",e.SKILL="skill",e.TRAIT="trait"}(u||(u={})),function(e){e.NUMBER="number",e.PERCENT="percent",e.UNKNOWN="unknown"}(r||(r={}));var l=function(e,n){this.type=e,this.value=n},f=function(e){function n(n){return e.call(this,a.PARTICLE,n)||this}return i(n,e),n}(l),p=function(e){function n(n,t){var u=e.call(this,a.REFERENCE,t)||this;return u.referenceType=n,u}return i(n,e),n}(l),o=function(e){function n(n){return e.call(this,a.TEXT,n)||this}return i(n,e),n}(l),T=function(e){function n(n,t){var u=e.call(this,a.VALUE,t)||this;return u.valueType=n,u}return i(n,e),n}(l),A=function(){function e(e){this._partials=e}return e.prototype.partials=function(){return this._partials},e.prototype.references=function(){return this._partials.filter((function(e){return e.type===a.REFERENCE}))},e}(),s=function(){var e=function(n,t){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])})(n,t)};return function(n,t){function a(){this.constructor=n}e(n,t),n.prototype=null===t?Object.create(t):(a.prototype=t.prototype,new a)}}(),c=function(e){function n(n){return e.call(this,u.BUFF,n)||this}return s(n,e),n}(p);function E(e){var n=e.match(/[A-Z]*[a-z0-9]*/g);return n&&n.length?n.filter((function(e){return e.length>0})).map((function(e){return e.charAt(0).toUpperCase()+e.slice(1)})).join(" "):e}var d=function(){var e=function(n,t){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])})(n,t)};return function(n,t){function a(){this.constructor=n}e(n,t),n.prototype=null===t?Object.create(t):(a.prototype=t.prototype,new a)}}(),D=function(e){function n(n){return e.call(this,u.TRAIT,n)||this}return d(n,e),n}(p),N=t(11),_=[{up:N.b.BuffType.ADD_MAXHP,down:N.b.BuffType.SUB_MAXHP,description:"Max HP"},{up:N.b.BuffType.UP_ATK,down:N.b.BuffType.DOWN_ATK,description:"ATK"},{up:N.b.BuffType.UP_CHAGETD,down:void 0,description:"Overcharge"},{up:N.b.BuffType.UP_COMMANDALL,down:N.b.BuffType.DOWN_COMMANDALL,description:"Card"},{up:N.b.BuffType.UP_COMMANDATK,down:N.b.BuffType.DOWN_COMMANDATK,description:"ATK"},{up:N.b.BuffType.UP_CRITICALDAMAGE,down:N.b.BuffType.DOWN_CRITICALDAMAGE,description:"Critical Damage"},{up:N.b.BuffType.UP_CRITICALPOINT,down:N.b.BuffType.DOWN_CRITICALPOINT,description:"Star Drop Rate"},{up:N.b.BuffType.UP_CRITICALRATE,down:N.b.BuffType.DOWN_CRITICALRATE,description:"Critical Rate"},{up:N.b.BuffType.UP_CRITICAL_RATE_DAMAGE_TAKEN,down:N.b.BuffType.DOWN_CRITICAL_RATE_DAMAGE_TAKEN,description:"Critical Rate Taken"},{up:N.b.BuffType.UP_DAMAGE,down:N.b.BuffType.DOWN_DAMAGE,description:"SP.DMG"},{up:N.b.BuffType.UP_DAMAGEDROPNP,down:N.b.BuffType.DOWN_DAMAGEDROPNP,description:"NP Gain When Damaged"},{up:N.b.BuffType.UP_DEFENCE,down:N.b.BuffType.DOWN_DEFENCE,description:"DEF"},{up:N.b.BuffType.UP_DEFENCECOMMANDALL,down:N.b.BuffType.DOWN_DEFENCECOMMANDALL,description:"Resistance"},{up:N.b.BuffType.UP_DROPNP,down:N.b.BuffType.DOWN_DROPNP,description:"NP Gain"},{up:N.b.BuffType.UP_FUNC_HP_REDUCE,down:N.b.BuffType.DOWN_FUNC_HP_REDUCE,description:"DoT Effectiveness"},{up:N.b.BuffType.UP_GRANT_INSTANTDEATH,down:N.b.BuffType.DOWN_GRANT_INSTANTDEATH,description:"Death Chance"},{up:N.b.BuffType.UP_GRANTSTATE,down:N.b.BuffType.DOWN_GRANTSTATE,description:"Buff Chance"},{up:void 0,down:N.b.BuffType.UP_NONRESIST_INSTANTDEATH,description:"Death Resist"},{up:N.b.BuffType.UP_NPDAMAGE,down:N.b.BuffType.DOWN_NPDAMAGE,description:"NP Damage"},{up:N.b.BuffType.UP_SPECIALDEFENCE,down:N.b.BuffType.DOWN_SPECIALDEFENCE,description:"SP.DEF"},{up:N.b.BuffType.UP_STARWEIGHT,down:N.b.BuffType.DOWN_STARWEIGHT,description:"Star Weight"},{up:N.b.BuffType.UP_TOLERANCE,down:N.b.BuffType.DOWN_TOLERANCE,description:"Debuff Resist"},{up:N.b.BuffType.UP_TOLERANCE_SUBSTATE,down:N.b.BuffType.DOWN_TOLERANCE_SUBSTATE,description:"Buff Removal Resist"}],y=new Map([[3012,"Charm"],[3015,"Burn"],[3026,"Curse"],[3066,"Sleep"]]),v=new Map([[N.b.BuffType.AVOID_INSTANTDEATH,"Immune to Death"],[N.b.BuffType.AVOID_STATE,"Immunity"],[N.b.BuffType.ADD_DAMAGE,"Damage Plus"],[N.b.BuffType.ADD_INDIVIDUALITY,"Add Trait"],[N.b.BuffType.AVOIDANCE,"Evade"],[N.b.BuffType.CHANGE_COMMAND_CARD_TYPE,"Change Command Card Types"],[N.b.BuffType.COMMANDCODEATTACK_FUNCTION,"Command Code Effect"],[N.b.BuffType.BREAK_AVOIDANCE,"Sure Hit"],[N.b.BuffType.DELAY_FUNCTION,"Trigger Skill after Duration"],[N.b.BuffType.DONOT_ACT,"Stun"],[N.b.BuffType.DONOT_NOBLE,"NP Seal"],[N.b.BuffType.DONOT_NOBLE_COND_MISMATCH,"NP Block if Condition Failed"],[N.b.BuffType.DONOT_RECOVERY,"Recovery Disabled"],[N.b.BuffType.DONOT_SELECT_COMMANDCARD,"Do Not Shuffle In Cards"],[N.b.BuffType.DONOT_SKILL,"Skill Seal"],[N.b.BuffType.FIELD_INDIVIDUALITY,"Change Field Type"],[N.b.BuffType.FIX_COMMANDCARD,"Freeze Command Cards"],[N.b.BuffType.GUTS,"Guts"],[N.b.BuffType.GUTS_FUNCTION,"Trigger Skill on Guts"],[N.b.BuffType.GUTS_RATIO,"Guts"],[N.b.BuffType.INVINCIBLE,"Invincible"],[N.b.BuffType.MULTIATTACK,"Multiple Hits"],[N.b.BuffType.PIERCE_INVINCIBLE,"Ignore Invincible"],[N.b.BuffType.REGAIN_HP,"HP Per Turn"],[N.b.BuffType.REGAIN_NP,"NP Per Turn"],[N.b.BuffType.REGAIN_STAR,"Stars Per Turn"],[N.b.BuffType.SELFTURNEND_FUNCTION,"Trigger Skill every Turn"],[N.b.BuffType.SPECIAL_INVINCIBLE,"Special invincible"],[N.b.BuffType.SUB_SELFDAMAGE,"Damage Cut"],[N.b.BuffType.TD_TYPE_CHANGE,"Change Noble Phantasm"],[N.b.BuffType.TD_TYPE_CHANGE_ARTS,"Set Noble Phantasm: Arts"],[N.b.BuffType.TD_TYPE_CHANGE_BUSTER,"Set Noble Phantasm: Buster"],[N.b.BuffType.TD_TYPE_CHANGE_QUICK,"Set Noble Phantasm: Quick"],[N.b.BuffType.UP_HATE,"Taunt"]]),C=new Map([[N.b.BuffType.ATTACK_FUNCTION,{after:!0,event:"attacks"}],[N.b.BuffType.COMMANDATTACK_FUNCTION,{after:!0,event:"cards"}],[N.b.BuffType.COMMANDATTACK_BEFORE_FUNCTION,{after:!1,event:"cards"}],[N.b.BuffType.DAMAGE_FUNCTION,{after:!0,when:"receiving",event:"attacks"}],[N.b.BuffType.DEAD_FUNCTION,{after:!0,event:"death"}],[N.b.BuffType.NPATTACK_PREV_BUFF,{after:!0,event:"NP"}]]);function b(e){for(var n in _)if(_[n].up===e||_[n].down===e)return _[n]}function w(e,n){var t=[],a=U(e),u=U(n);return a.length&&(t.push(new f(" for ")),t.push.apply(t,a)),u.length&&(t.push(new f(" vs. ")),t.push.apply(t,u)),t}function U(e){return function(e,n){for(var t=[],a=0;a<e.length;a++)a>0&&t.push(new f(n)),t.push(e[a]);return t}(e.map((function(e){return new D(e)}))," & ")}var V=function(){var e=function(n,t){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])})(n,t)};return function(n,t){function a(){this.constructor=n}e(n,t),n.prototype=null===t?Object.create(t):(a.prototype=t.prototype,new a)}}(),B=function(e){function n(n){return e.call(this,u.CARD,n)||this}return V(n,e),n}(p),P=function(){var e=function(n,t){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])})(n,t)};return function(n,t){function a(){this.constructor=n}e(n,t),n.prototype=null===t?Object.create(t):(a.prototype=t.prototype,new a)}}(),I=function(e){function n(n){return e.call(this,u.SKILL,n)||this}return P(n,e),n}(p),F=t(70),O=new Map([[N.b.BuffType.UP_ATK,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_ATK,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_COMMANDALL,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_COMMANDALL,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_COMMANDATK,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_COMMANDATK,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_CRITICALDAMAGE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_CRITICALDAMAGE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_CRITICALPOINT,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_CRITICALPOINT,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_CRITICALRATE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_CRITICALRATE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_CRITICAL_RATE_DAMAGE_TAKEN,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_CRITICAL_RATE_DAMAGE_TAKEN,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_DAMAGE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_DAMAGE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_DAMAGEDROPNP,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_DAMAGEDROPNP,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_DEFENCE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_DEFENCE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_DEFENCECOMMANDALL,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_DEFENCECOMMANDALL,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_DROPNP,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_DROPNP,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_FUNC_HP_REDUCE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_FUNC_HP_REDUCE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_GRANTSTATE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_GRANTSTATE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_HATE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_NONRESIST_INSTANTDEATH,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_NPDAMAGE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_NPDAMAGE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_SPECIALDEFENCE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_SPECIALDEFENCE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_STARWEIGHT,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_STARWEIGHT,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_TOLERANCE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_TOLERANCE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.UP_TOLERANCE_SUBSTATE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.DOWN_TOLERANCE_SUBSTATE,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.GUTS_RATIO,{value:F.DataValField.VALUE,power:1}],[N.b.BuffType.REGAIN_NP,{value:F.DataValField.VALUE,power:2}]]),h=new Map([[N.b.BuffType.ATTACK_FUNCTION,{skill:F.DataValField.VALUE,level:F.DataValField.VALUE2}],[N.b.BuffType.COMMANDATTACK_FUNCTION,{skill:F.DataValField.VALUE,level:F.DataValField.VALUE2}],[N.b.BuffType.COMMANDATTACK_BEFORE_FUNCTION,{skill:F.DataValField.VALUE,level:F.DataValField.VALUE2}],[N.b.BuffType.DAMAGE_FUNCTION,{skill:F.DataValField.VALUE,level:F.DataValField.VALUE2}],[N.b.BuffType.DEAD_FUNCTION,{skill:F.DataValField.VALUE,level:F.DataValField.VALUE2}],[N.b.BuffType.DELAY_FUNCTION,{skill:F.DataValField.VALUE,level:F.DataValField.VALUE2}],[N.b.BuffType.NPATTACK_PREV_BUFF,{skill:F.DataValField.SKILL_ID,level:F.DataValField.SKILL_LV,position:F.DataValField.VALUE}],[N.b.BuffType.SELFTURNEND_FUNCTION,{skill:F.DataValField.VALUE,level:F.DataValField.VALUE2,rate:F.DataValField.USE_RATE}]]),R=new Map([[N.b.BuffType.FIELD_INDIVIDUALITY,{trait:F.DataValField.VALUE}]]),L=new Map([[N.b.BuffType.CHANGE_COMMAND_CARD_TYPE,{card:F.DataValField.VALUE}]]),M=function(e,n){var t=O.get(e.type);if(t)return g(null!==n&&void 0!==n?n:{},t.value,r.PERCENT,Math.pow(10,t.power));var a=h.get(e.type);if(a)return function(e,n){var t=[],a=e[n.skill],u=e[n.level],i=(n.position&&e[n.position],n.rate?e[n.rate]:void 0);"number"===typeof a&&(t.length&&t.push(new f(" + ")),t.push(new I(a)));"number"===typeof u&&(t.length&&t.push(new f(" + ")),t.push(new o("Lv. ")),t.push(new T(r.UNKNOWN,u)));"number"===typeof i&&(t.length&&t.push(new f(" + ")),t.push(new o("Chance: ")),t.push(new T(r.PERCENT,i/10)));return t.length>0?new A(t):void 0}(null!==n&&void 0!==n?n:{},a);var u=R.get(e.type);if(u)return function(e,n){var t=[],a=e[n.trait];"number"===typeof a&&t.push(new D(a));return t.length>0?new A(t):void 0}(null!==n&&void 0!==n?n:{},u);var i=L.get(e.type);return i?function(e,n){var t=[],a=e[n.card];"number"===typeof a&&t.push(new B(a));return t.length>0?new A(t):void 0}(null!==n&&void 0!==n?n:{},i):g(null!==n&&void 0!==n?n:{},N.e.DataValField.VALUE,r.NUMBER,1)};function g(e,n,t,a){var u=[],r=e[n];"number"===typeof r&&u.push(new T(t,r/a));var i=e.RatioHPLow;return void 0!==i&&(u.length&&u.push(new f(" + ")),u.push(new f("(")),u.push(new T(t,i/a)),u.push(new f(" Scales by Low HP)"))),u.length>0?new A(u):void 0}var S={describe:function(e){var n=[],t=b(e.type),a=C.get(e.type),u=function(e){var n=e.vals.map((function(e){return e.id}));for(var t in n){var a=n[t],u=y.get(a);if(void 0!==u)return u}}(e),r=v.get(e.type);return t?(t.up===e.type?n.push(new o(t.description+" Up")):n.push(new o(t.description+" Down")),n.push.apply(n,w(e.ckSelfIndv,e.ckOpIndv))):u?(n.push(new o(u)),n.push.apply(n,w(e.ckSelfIndv,e.ckOpIndv))):r?(n.push(new o(r)),n.push.apply(n,w(e.ckSelfIndv,e.ckOpIndv))):a?(n.push(new o("Trigger Skills")),n.push(new f(a.after?" on ":" before ")),a.when&&(n.push(new o(a.when)),n.push(new f(" "))),e.ckSelfIndv.length&&(n.push.apply(n,U(e.ckSelfIndv)),n.push(new f(" "))),n.push(new o(a.event)),n.push.apply(n,w([],e.ckOpIndv))):e.name?n.push(new o(e.name)):n.push(new o(E(e.type))),new A(n)},describeType:function(e){var n=b(e),t=C.get(e),a=v.get(e);return n?n.up===e?n.description+" Up":n.description+" Down":a||(t?"Trigger Skills "+(t.after?"on ":"before ")+(t.when?t.when+" ":"")+t.event:E(e))},describeValue:M,BuffReferencePartial:c},G=new Map([[1,N.c.NONE],[2,N.c.BUSTER],[3,N.c.ARTS],[4,N.c.QUICK],[5,N.c.EXTRA]]),m={describe:function(e){var n=[],t="number"===typeof e?G.get(e):e;return t?n.push(new o(E(t))):"number"===typeof e?n.push(new T(r.UNKNOWN,e)):n.push(new o(E(e))),new A(n)},CardReferencePartial:B},W=t(71),k=function(e){return Object.values(N.e.DataValField).filter((function(n){var t=e.map((function(e){return e[n]}));return new Set(t.map((function(e){return Array.isArray(e)?e.join(","):e}))).size>1}))};function K(e){var n=k(e),t={};for(var a in n)t[n[a]]=e[0][n[a]];return t}var H={describeValue:function(e,n,t,a){var u,i=[],l=function(e){i.length&&e.length&&i.push(new f(" + ")),i.push.apply(i,e)};if(a||void 0===t.Rate||i.push(new T(r.PERCENT,t.Rate/10),new o(" Chance")),e.funcType===W.FuncType.ADD_STATE||e.funcType===W.FuncType.ADD_STATE_SHORT){var p=M(e.buffs[0],t);l(null!==(u=null===p||void 0===p?void 0:p.partials())&&void 0!==u?u:[])}else if(e.funcType===W.FuncType.ABSORB_NPTURN)l(function(e,n){var t,a,u,i,l,p=[],A=[];switch(null!==(t=e.DependFuncId)&&void 0!==t?t:n.DependFuncId){case 469:if(void 0!==(null===(a=n.DependFuncVals)||void 0===a?void 0:a.Value)&&p.push(new T(r.PERCENT,n.DependFuncVals.Value/100)),void 0!==(null===(u=n.DependFuncVals)||void 0===u?void 0:u.Value2)){var s=(null===(i=n.DependFuncVals)||void 0===i?void 0:i.Value2)/100;A.push(new T(r.NUMBER,s),new f(" "),new o("Charge"+(s>1?"s":"")))}break;case 5061:void 0!==(null===(l=n.DependFuncVals)||void 0===l?void 0:l.Value)&&A.push(new T(r.NUMBER,n.DependFuncVals.Value))}return p.length&&A.length?p.concat([new f(" => ")],A):p.length?p:A.length?A:[]}(n,t));else if(e.funcType===W.FuncType.GAIN_HP_FROM_TARGETS)l(function(e,n){var t,a,u=[],i=[];switch(null!==(t=e.DependFuncId)&&void 0!==t?t:n.DependFuncId){case 711:void 0!==(null===(a=n.DependFuncVals)||void 0===a?void 0:a.Value)&&i.push(new T(r.NUMBER,n.DependFuncVals.Value))}return u.length&&i.length?u.concat([new f(" => ")],i):u.length?u:i.length?i:[]}(n,t));else if(e.funcType===W.FuncType.GAIN_NP_FROM_TARGETS)l(function(e,n){var t,a,u,i,l=[],p=[];switch(null!==(t=e.DependFuncId)&&void 0!==t?t:n.DependFuncId){case 474:if(void 0!==(null===(a=n.DependFuncVals)||void 0===a?void 0:a.Value)){var A=n.DependFuncVals.Value/100;l.push(new T(r.NUMBER,A),new f(" "),new o("Charge"+(A>1?"s":"")))}void 0!==(null===(u=n.DependFuncVals)||void 0===u?void 0:u.Value2)&&p.push(new T(r.PERCENT,n.DependFuncVals.Value2/100));break;case 3962:void 0!==(null===(i=n.DependFuncVals)||void 0===i?void 0:i.Value)&&p.push(new T(r.PERCENT,n.DependFuncVals.Value/100))}return l.length&&p.length?l.concat([new f(" => ")],p):l.length?l:p.length?p:[]}(n,t));else{if(void 0!==t.Value)switch(e.funcType){case N.g.FuncType.DAMAGE_NP:case N.g.FuncType.DAMAGE_NP_HPRATIO_LOW:case N.g.FuncType.DAMAGE_NP_INDIVIDUAL:case N.g.FuncType.DAMAGE_NP_INDIVIDUAL_SUM:case N.g.FuncType.DAMAGE_NP_PIERCE:case N.g.FuncType.DAMAGE_NP_RARE:case N.g.FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX:case N.g.FuncType.GAIN_HP_PER:case N.g.FuncType.QP_DROP_UP:l([new T(r.PERCENT,t.Value/10)]);break;case N.g.FuncType.GAIN_NP:case N.g.FuncType.GAIN_NP_BUFF_INDIVIDUAL_SUM:case N.g.FuncType.LOSS_NP:l([new T(r.PERCENT,t.Value/100)]);break;default:l([new T(r.NUMBER,t.Value)])}if(void 0!==t.Value2)switch(e.funcType){case N.g.FuncType.DAMAGE_NP_INDIVIDUAL_SUM:l([new o("additional "),new T(r.PERCENT,t.Value2/10)])}if(void 0!==t.Correction)switch(e.funcType){case N.g.FuncType.DAMAGE_NP_INDIVIDUAL:case N.g.FuncType.DAMAGE_NP_RARE:case N.g.FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX:l([new T(r.PERCENT,t.Correction/10)]);break;case N.g.FuncType.DAMAGE_NP_INDIVIDUAL_SUM:l([new f("("),new T(r.PERCENT,t.Correction/10),new o(" x count"),new f(")")]);break;default:l([new T(r.NUMBER,t.Correction)])}if(void 0!==t.Target)switch(e.funcType){case N.g.FuncType.DAMAGE_NP_HPRATIO_LOW:l([new T(r.PERCENT,t.Target/10)]);break;default:l([new T(r.UNKNOWN,t.Target)])}if(void 0!==t.AddCount&&l([new T(r.NUMBER,t.AddCount)]),void 0!==t.UseRate&&l([new T(r.PERCENT,t.UseRate/10),new o(" Chance to Trigger")]),void 0!==t.RateCount)switch(e.funcType){case N.g.FuncType.QP_DROP_UP:case N.g.FuncType.SERVANT_FRIENDSHIP_UP:case N.g.FuncType.USER_EQUIP_EXP_UP:l([new T(r.PERCENT,t.RateCount/10)]);break;default:l([new T(r.UNKNOWN,t.RateCount)])}void 0!==t.Count&&l([new T(r.NUMBER,t.Count),new o(" Time"+(t.Count>1?"s":""))])}return i.length?new A(i):void 0},getMutatingDataVal:function(e,n,t){var a=function(e){var n,t,a,u,r=e.svals.concat(null!==(n=e.svals2)&&void 0!==n?n:[],null!==(t=e.svals3)&&void 0!==t?t:[],null!==(a=e.svals4)&&void 0!==a?a:[],null!==(u=e.svals5)&&void 0!==u?u:[]);return r.length?k(r):[]}(e),u=function(e,n,t){var a,u,r,i,l,f=[];void 0===t||1===t?f=e.svals:2===t?f=null!==(a=e.svals2)&&void 0!==a?a:[]:3===t?f=null!==(u=e.svals3)&&void 0!==u?u:[]:4===t?f=null!==(r=e.svals4)&&void 0!==r?r:[]:5===t&&(f=null!==(i=e.svals5)&&void 0!==i?i:[]);return null!==(l=f[n-1])&&void 0!==l?l:{}}(e,n,t),r=Object.keys(u),i={};return r.forEach((function(e){-1===a.indexOf(e)&&(i[e]=u[e])})),i},getStaticDataVal:function(e){var n,t,a,u,r=e.svals.concat(null!==(n=e.svals2)&&void 0!==n?n:[],null!==(t=e.svals3)&&void 0!==t?t:[],null!==(a=e.svals4)&&void 0!==a?a:[],null!==(u=e.svals5)&&void 0!==u?u:[]);if(!r.length)return{};var i=K(r);if(r.filter((function(e){return void 0!==e.DependFuncVals})).length>0){var l=r.map((function(e){var n;return null!==(n=e.DependFuncVals)&&void 0!==n?n:{}}));i.DependFuncVals=K(l)}return i},getStaticDataValFields:k},j=new Map([[1,"Gender:Male"],[2,"Gender:Female"],[3,"Gender:Unknown"],[100,"Class:Saber"],[101,"Class:Lancer"],[102,"Class:Archer"],[103,"Class:Rider"],[104,"Class:Caster"],[105,"Class:Assassin"],[106,"Class:Berserker"],[107,"Class:Shielder"],[108,"Class:Ruler"],[109,"Class:Alter Ego"],[110,"Class:Avenger"],[111,"Demon Pillar"],[112,"Class:Grand Caster"],[113,"Beast I"],[114,"Beast II"],[115,"Class:Moon Cancer"],[116,"Beast IIIR"],[117,"Class:Foreigner"],[118,"Beast IIIL"],[119,"Beast Unknown"],[200,"Attribute:Sky"],[201,"Attribute:Earth"],[202,"Attribute:Human"],[203,"Attribute:Star"],[204,"Attribute:Beast"],[300,"Alignment:Lawful"],[301,"Alignment:Chaotic"],[302,"Alignment:Neutral"],[303,"Alignment:Good"],[304,"Alignment:Evil"],[305,"Alignment:Balanced"],[306,"Alignment:Madness"],[308,"Alignment:Summer"],[2386,"Kingprotea:Proliferation"],[2387,"Kingprotea:Growth"],[2664,"Kingprotea:Proliferation NP Defense"],[3005,"Buff:Debuff"],[3006,"Buff:Offensive"],[3007,"Buff:Defensive"],[3011,"Poison"],[3012,"Charm"],[3015,"Burn"],[3021,"Evade"],[3026,"Curse"],[3047,"Pigify"],[4001,"Card:Arts"],[4002,"Card:Buster"],[4003,"Card:Quick"],[4004,"Card:Extra"],[4008,"Player Card"],[4100,"Critical Hit"]]),Y={describe:function(e,n){var t="number"===typeof e?e:e.id,a=j.get(t);if(void 0!==a)return new A([new o(a)]);var u=(null!==n&&void 0!==n?n:[]).find((function(e){return e.id===t}));if(u&&"unknown"!==u.name)return new A([new o(u.name)]);var i="number"===typeof e?"unknown":e.name;return new A("unknown"!==i?[new o(E(i))]:[new f("unknown("),new T(r.UNKNOWN,t),new f(")")])},TraitReferencePartial:D}},190:function(e,n,t){"use strict";var a=t(1),u=t(3),r=t(4),i=t.n(r),l=t(0),f=t.n(l),p=t(5),o=f.a.forwardRef((function(e,n){var t=e.bsPrefix,r=e.className,l=e.striped,o=e.bordered,T=e.borderless,A=e.hover,s=e.size,c=e.variant,E=e.responsive,d=Object(u.a)(e,["bsPrefix","className","striped","bordered","borderless","hover","size","variant","responsive"]),D=Object(p.a)(t,"table"),N=i()(r,D,c&&D+"-"+c,s&&D+"-"+s,l&&D+"-striped",o&&D+"-bordered",T&&D+"-borderless",A&&D+"-hover"),_=f.a.createElement("table",Object(a.a)({},d,{className:N,ref:n}));if(E){var y=D+"-responsive";return"string"===typeof E&&(y=y+"-"+E),f.a.createElement("div",{className:y},_)}return _}));n.a=o}}]);
//# sourceMappingURL=0.d1a1d3ac.chunk.js.map