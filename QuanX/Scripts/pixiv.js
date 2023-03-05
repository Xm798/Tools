/***********************
[rewrite_local]
#^https:\/\/app-api\.pixiv\.net\/v1\/user\/detail url script-response-body https://cdn.jsdelivr.net/gh/Xm798/Tools@main/QuanX/Scripts/pixiv.js
^https:\/\/oauth\.secure\.pixiv\.net\/auth\/token url script-response-body https://cdn.jsdelivr.net/gh/Xm798/Tools@main/QuanX/Scripts/pixiv.js
^https:\/\/app-api\.pixiv\.net\/v1\/search\/illust\?.*sort=(popular_desc|popular_female_desc|popular_male_desc) url script-request-header https://cdn.jsdelivr.net/gh/Xm798/Tools@main/QuanX/Scripts/pixiv.js 

^https:\/\/www\.pixiv\.net\/touch\/ajax\/user\/self\/status url script-response-body https://cdn.jsdelivr.net/gh/Xm798/Tools@main/QuanX/Scripts/pixiv.js
^https:\/\/www\.pixiv\.net\/touch\/ajax_api\/ajax_api\.php\?mode=get_user_data url script-response-body https://cdn.jsdelivr.net/gh/Xm798/Tools@main/QuanX/Scripts/pixiv.js
^https:\/\/www\.pixiv\.net\/?$ url script-response-body https://cdn.jsdelivr.net/gh/Xm798/Tools@main/QuanX/Scripts/pixiv.js
#^https:\/\/www.pixiv.net\/.*?.php\?mode=r18 url script-response-body https://cdn.jsdelivr.net/gh/Xm798/Tools@main/QuanX/Scripts/pixiv.js

[mitm] 
hostname = app-api.pixiv.net,oauth.secure.pixiv.net,www.pixiv.net
*/

const $ = API('Pixiv', false);
const url = $request.url;
let obj = $response && !/www\.pixiv\.net\/?$/.test(url) ? JSON.parse($response.body) : null;

!(async () => {
    switch (true) {
        case /\/auth\/token/.test(url):
            obj['user']['is_premium'] = true;
            obj['response']['user']['is_premium'] = true;
            break;
        case /\/v1\/user\/detail/.test(url):
            obj['profile']['is_premium'] = true;
            break;
        case /\/touch\/ajax\/user\/self\/status/.test(url):
            obj = obj['body']['user_status'];
            obj['ads_disabled'] = true;
            obj['show_ads'] = false;
            obj['user_premium'] = '1';
            break;
        case /\/touch\/ajax_api\/ajax_api\.php/.test(url):
            obj['user_data']['user_premium'] = '1';
            break;
        case /\/v1\/search\/illust/.test(url):
            let headers = $request.headers;
            let path = $request.path;
            path = path.replace(
                /search\/illust(.+)search_target=(partial|exact)/,
                'search/popular-preview/illust$1search_target=exact'
            );
            $.log(path);
            $.done({ path: path, headers: headers });
            break;
        case /www\.pixiv\.net\/?$/.test(url):
            let body = $response.body;
            body = body
                .replace(/"qualtrics_is-premium" hidden>no/, '"qualtrics_is-premium" hidden>yes')
                .replace(/premium: 'no'/, "premium: 'yes'")
                .replace(
                    /"pixiv.context.enabledPopularSearch":false/,
                    '"pixiv.context.enabledPopularSearch":true'
                )
                .replace(
                    /"touch_premium_popular_search_modal":true/,
                    '"touch_premium_popular_search_modal":false'
                )
                .replace(/"www_premium_link_text":true/, '"www_premium_link_text":false');
            $.done({ body: body });
            break;
    }
})().then(() => {
    obj = JSON.stringify(obj);
    $.log(obj);
    $.done({ body: obj });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * OpenAPI
 * @author: Peng-YM
 * https://github.com/Peng-YM/QuanX/blob/master/Tools/OpenAPI/README.md
 */
function ENV(){const e="function"==typeof require&&"undefined"!=typeof $jsbox;return{isQX:"undefined"!=typeof $task,isLoon:"undefined"!=typeof $loon,isSurge:"undefined"!=typeof $httpClient&&"undefined"!=typeof $utils,isBrowser:"undefined"!=typeof document,isNode:"function"==typeof require&&!e,isJSBox:e,isRequest:"undefined"!=typeof $request,isScriptable:"undefined"!=typeof importModule}}function HTTP(e={baseURL:""}){const{isQX:t,isLoon:s,isSurge:o,isScriptable:n,isNode:i,isBrowser:r}=ENV(),u=/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;const a={};return["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"].forEach(h=>a[h.toLowerCase()]=(a=>(function(a,h){h="string"==typeof h?{url:h}:h;const d=e.baseURL;d&&!u.test(h.url||"")&&(h.url=d?d+h.url:h.url),h.obj&&h.headers&&!h.headers["Content-Type"]&&(h.headers["Content-Type"]="application/x-www-form-urlencoded");const l=(h={...e,...h}).timeout,c={onRequest:()=>{},onResponse:e=>e,onTimeout:()=>{},...h.events};let f,p;if(c.onRequest(a,h),t)f=$task.fetch({method:a,...h});else if(s||o||i)f=new Promise((e,t)=>{(i?require("request"):$httpClient)[a.toLowerCase()](h,(s,o,n)=>{s?t(s):e({statusCode:o.status||o.statusCode,headers:o.headers,obj:n})})});else if(n){const e=new Request(h.url);e.method=a,e.headers=h.headers,e.obj=h.obj,f=new Promise((t,s)=>{e.loadString().then(s=>{t({statusCode:e.response.statusCode,headers:e.response.headers,obj:s})}).catch(e=>s(e))})}else r&&(f=new Promise((e,t)=>{fetch(h.url,{method:a,headers:h.headers,obj:h.obj}).then(e=>e.json()).then(t=>e({statusCode:t.status,headers:t.headers,obj:t.data})).catch(t)}));const y=l?new Promise((e,t)=>{p=setTimeout(()=>(c.onTimeout(),t(`${a} URL: ${h.url} exceeds the timeout ${l} ms`)),l)}):null;return(y?Promise.race([y,f]).then(e=>(clearTimeout(p),e)):f).then(e=>c.onResponse(e))})(h,a))),a}function API(e="untitled",t=!1){const{isQX:s,isLoon:o,isSurge:n,isNode:i,isJSBox:r,isScriptable:u}=ENV();return new class{constructor(e,t){this.name=e,this.debug=t,this.http=HTTP(),this.env=ENV(),this.node=(()=>{if(i){return{fs:require("fs")}}return null})(),this.initCache();Promise.prototype.delay=function(e){return this.then(function(t){return((e,t)=>new Promise(function(s){setTimeout(s.bind(null,t),e)}))(e,t)})}}initCache(){if(s&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(o||n)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),i){let e="root.json";this.node.fs.existsSync(e)||this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.root={},e=`${this.name}.json`,this.node.fs.existsSync(e)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.cache={})}}persistCache(){const e=JSON.stringify(this.cache,null,2);s&&$prefs.setValueForKey(e,this.name),(o||n)&&$persistentStore.write(e,this.name),i&&(this.node.fs.writeFileSync(`${this.name}.json`,e,{flag:"w"},e=>console.log(e)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root,null,2),{flag:"w"},e=>console.log(e)))}write(e,t){if(this.log(`SET ${t}`),-1!==t.indexOf("#")){if(t=t.substr(1),n||o)return $persistentStore.write(e,t);if(s)return $prefs.setValueForKey(e,t);i&&(this.root[t]=e)}else this.cache[t]=e;this.persistCache()}read(e){return this.log(`READ ${e}`),-1===e.indexOf("#")?this.cache[e]:(e=e.substr(1),n||o?$persistentStore.read(e):s?$prefs.valueForKey(e):i?this.root[e]:void 0)}delete(e){if(this.log(`DELETE ${e}`),-1!==e.indexOf("#")){if(e=e.substr(1),n||o)return $persistentStore.write(null,e);if(s)return $prefs.removeValueForKey(e);i&&delete this.root[e]}else delete this.cache[e];this.persistCache()}notify(e,t="",a="",h={}){const d=h["open-url"],l=h["media-url"];if(s&&$notify(e,t,a,h),n&&$notification.post(e,t,a+`${l?"\n多媒体:"+l:""}`,{url:d}),o){let s={};d&&(s.openUrl=d),l&&(s.mediaUrl=l),"{}"===JSON.stringify(s)?$notification.post(e,t,a):$notification.post(e,t,a,s)}if(i||u){const s=a+(d?`\n点击跳转: ${d}`:"")+(l?`\n多媒体: ${l}`:"");if(r){require("push").schedule({title:e,obj:(t?t+"\n":"")+s})}else console.log(`${e}\n${t}\n${s}\n\n`)}}log(e){this.debug&&console.log(`[${this.name}] LOG: ${this.stringify(e)}`)}info(e){console.log(`[${this.name}] INFO: ${this.stringify(e)}`)}error(e){console.log(`[${this.name}] ERROR: ${this.stringify(e)}`)}wait(e){return new Promise(t=>setTimeout(t,e))}done(e={}){s||o||n?$done(e):i&&!r&&"undefined"!=typeof $context&&($context.headers=e.headers,$context.statusCode=e.statusCode,$context.obj=e.obj)}stringify(e){if("string"==typeof e||e instanceof String)return e;try{return JSON.stringify(e,null,2)}catch(e){return"[object Object]"}}}(e,t)}