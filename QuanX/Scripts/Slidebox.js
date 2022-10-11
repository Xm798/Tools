let obj = JSON.parse($response.body);
obj = {
    "data": {
        "env": {
            "realm": "prod",
            "projectId": "slidebox-ios-prod",
            "region": "asia-east2",
            "function": "api_v1"
        },
        "appStoreRecord": {
            "bundleId": "co.slidebox.Slidebox",
            "validatedTimestampMs": "1598173662663",
            "purchases": [],
            "subscriptions": [
                {
                    "productId": "co.slidebox.iap.apple.membership.auto.1year",
                    "expireTimestampMs": "1756543902000",
                    "isExpired": "0"
                }
            ]
        }
    }
};
$done({ body: JSON.stringify(obj) });