var hostname = $domain;
// 这些网络下不使用默认doh
var ssids = [
    '信号太差不要连',
];
// 如果路由器提供的dns包括这些dns就不使用doh
var dnss = [
    '192.168.1.11',
];

// ssids
ssids = '^(' + ssids.join('|') + ')$';
ssids = new RegExp(ssids);
// dnss
dnss = '"(' + dnss.join('|') + ')"';
dnss = new RegExp(dnss);

var ssid = $network.wifi.ssid ? $network.wifi.ssid : '';
console.log(ssid);

var ssidMatched = ssid.match(ssids);
var dnsMatched = JSON.stringify($network.dns).match(dnss);

if (ssidMatched || dnsMatched) {
    $done({ servers: $network.dns })
} else {
    $done({})
}