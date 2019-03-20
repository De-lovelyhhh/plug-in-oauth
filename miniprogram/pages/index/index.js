 import regeneratorRuntime from '../../runtime.js' // eslint-disable-line

let plugin = requirePlugin('myPlugin')
Page({
    data: {
        account: '17jhxu',
        password: 'Jh1515451232',
        res: {},
        code: '',
        skey: ''
    },
    onLoad: function() {
        // plugin.redirect(this.data.account, this.data.password)
    },
    bindInput(e) {
        this.setData({
            [e.currentTarget.dataset.key]: e.detail.value
        })
    },
    getConfigure: async function() {
        this.data.res = await plugin.getConfigure()
    },
    getCode: async function() {
        this.data.code = await plugin.getCode(this.data.account, this.data.password, this.data.res)
    },
    getSkey: async function() {
        let skey = await plugin.getSkey(this.data.code, this.data.res)
        this.setData({
            skey: skey
        })
    }
})
