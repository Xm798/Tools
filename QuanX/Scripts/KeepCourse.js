body =
$response.body.replace(/data":\{[^\\}]+\\}/g,'data":{\"status\":true,\"text\":null,\"schema\":null}')
$done({body});