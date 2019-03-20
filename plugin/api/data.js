let data = 'init data'

import regeneratorRuntime from 'runtime' // eslint-disable-line

let oauthSession = {}
let cookieA

const getCode = async function (account, password, res1) {
    const login = async function (account, password) {
        return await new Promise(function (resolve, reject) {
            wx.request({
                url: 'http://139.199.224.230:7001/oauth/login',
                method: 'POST',
                needLogin: false,
                data: { account, password },
                success: function (res) {
                    let oauthSessionKey
                    let oauthSessionValue
                    try {
                        oauthSessionKey = res.cookies[0].name
                        oauthSessionValue = res.cookies[0].value
                        // [oauthSessionKey, oauthSessionValue] = res.header['set-cookie'].split(';')[0].split('=')
                        console.log('login success')
                    } catch (e) {
                        console.log(e)
                    }

                    // 存储资源服务器session
                    oauthSession = { oauthSessionKey, oauthSessionValue }
                    resolve(oauthSession)
                },
                fail: function (res) {
                    reject(res)
                }
            })
        })
    }
    const getOauth = async function () {
        let cookieb = await login(account, password)
        let { oauthSessionKey, oauthSessionValue } = cookieb
        return await new Promise(function (resolve, reject) {
            wx.request({
                url: 'http://139.199.224.230:7001/oauth/authorize',
                method: 'GET',
                header: { cookie: `${oauthSessionKey}=${oauthSessionValue}` },
                needLogin: false,
                data: {
                    response_type: 'code',
                    client_id: res1.client_id,
                    state: res1.state,
                    scope: res1.scope,
                    from: 'mini'
                },
                success: function (res) {
                    console.log('oauth相关数据：' + res)
                    resolve(res.data.authorization_code)
                },
                fail: function (res) {
                    reject(res)
                }
            })
        })
    }
    return getOauth()
}



const getConfigure = async function () {
    let json
    return await new Promise(function (resolve, reject) {
        wx.request({
            url: 'http://139.199.224.230:7002/user/get_oauth_data',
            method: 'GET',
            needLogin: false,
            data: { from: 'mini' },
            success: function (res) {
                let cookieAKey = res.cookies[0].name
                let cookieAValue = res.cookies[0].value
                cookieA = { cookieAKey, cookieAValue }
                console.log('cookieA:' + cookieA)
                json = {
                    client_id: res.data.client_id,
                    state: res.data.state,
                    scope: res.data.scope,
                    redirect_uri: res.data.redirect_uri
                }
                resolve(json)
            },
            fail: function (res) {
                reject(res)
            }
        })
    })

}


const getSkey = async function (code, res1) {
    return new Promise(function (resolve, reject) {
        let { cookieAKey, cookieAValue } = cookieA
        wx.request({
            url: res1.redirect_uri,
            method: 'GET',
            header: { cookie: `${cookieAKey}=${cookieAValue}` },
            needLogin: false,
            data: {
                code: code,
                state: res1.state,
                from: 'mini'
            },
            success: function (res) {
                console.log('skey:' + res.data.skey)
                resolve(res.data.skey)
            },
            fail: function (res) {
                reject(res)
            }
        })
    })
}

const redirect = async function (username, password) {
    let res = await getConfigure()
    let code = await getCode(username, password, res)
    let res1 = await getSkey(code, res)
    console.log(res1)
    return res1
}

function getData() {
    console.log(data)
    return data
}

function setData(value) {
    data = value
}

module.exports = {
    getData: getData,
    setData: setData,
    getConfigure: getConfigure,
    getCode: getCode,
    redirect: redirect,
    getSkey: getSkey
}
