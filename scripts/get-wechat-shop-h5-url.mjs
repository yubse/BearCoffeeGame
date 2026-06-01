#!/usr/bin/env node

const APPID = process.env.WECHAT_APPID || '';
const APPSECRET = process.env.WECHAT_APPSECRET;
const WECOM_CORP_ID = process.env.WECOM_CORP_ID || '';
const WECOM_USER_ID = process.env.WECOM_USER_ID || '';

if (!APPSECRET) {
    console.error('Missing WECHAT_APPSECRET. Set it before running this script.');
    console.error('PowerShell example:');
    console.error('$env:WECHAT_APPSECRET="your_appsecret"; node scripts/get-wechat-shop-h5-url.mjs');
    process.exit(1);
}

async function requestJson(url, options = {}) {
    const response = await fetch(url, options);
    const text = await response.text();

    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        throw new Error(`Invalid JSON response from ${url}: ${text}`);
    }

    if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${url}: ${JSON.stringify(data)}`);
    }

    return data;
}

async function getAccessToken() {
    const url = new URL('https://api.weixin.qq.com/cgi-bin/token');
    url.searchParams.set('grant_type', 'client_credential');
    url.searchParams.set('appid', APPID);
    url.searchParams.set('secret', APPSECRET);

    const data = await requestJson(url);

    if (data.errcode) {
        throw new Error(`Failed to get access_token: ${JSON.stringify(data)}`);
    }

    if (!data.access_token) {
        throw new Error(`No access_token in response: ${JSON.stringify(data)}`);
    }

    return data.access_token;
}

async function getShopH5Url(accessToken) {
    const url = new URL('https://api.weixin.qq.com/channels/ec/basics/shop/h5url/get');
    url.searchParams.set('access_token', accessToken);

    const payload = {};
    if (WECOM_CORP_ID) payload.wecom_corp_id = WECOM_CORP_ID;
    if (WECOM_USER_ID) payload.wecom_user_id = WECOM_USER_ID;

    const data = await requestJson(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (data.errcode !== 0) {
        throw new Error(`Failed to get shop_h5url: ${JSON.stringify(data)}`);
    }

    if (!data.shop_h5url) {
        throw new Error(`No shop_h5url in response: ${JSON.stringify(data)}`);
    }

    return data;
}

try {
    const accessToken = await getAccessToken();
    const result = await getShopH5Url(accessToken);

    console.log('shop_h5url:');
    console.log(result.shop_h5url);
    console.log('');
    console.log('full response:');
    console.log(JSON.stringify(result, null, 2));
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
