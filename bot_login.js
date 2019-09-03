const Plugin = require('../plugin');

module.exports = new Plugin({
    name: 'Bot Login',
    author: 'Joe 🎸#7070',
    description: 'Log in as a bot user without being redirected or logged out. DO NOT USE THIS AS A NORMAL USER!',
    color: 'hotpink',
    preload: true,

    load: async function() {
        this._mod = EDApi.findModule(mod => { // this section based on https://pastebin.com/Fn9EYNLa
            if (!(typeof mod === 'function' && 'prototype' in mod)) return;
            const descriptors = Object.getOwnPropertyDescriptors(mod.prototype);
            if ('_discoveryFailed' in descriptors) return mod;
        });

        if (this._mod) {
            monkeyPatch(this._mod.prototype, '_handleDispatch', function(b) {
                if (b.methodArguments[0].user && b.methodArguments[0].user.bot) {
                    console.log(b);
                    module.exports.log('Faking READY as user account');
                    b.methodArguments[0].user.bot = false;
                    b.methodArguments[0].user.email = "yes"; // prevent "unclaimed account" shit
                    b.methodArguments[0].experiments = [];
                    b.methodArguments[0].guild_experiments = [];
                    b.methodArguments[0].connected_accounts = [];
                    b.methodArguments[0].user_guild_settings = [];
                    b.methodArguments[0].read_state = [];
                    b.methodArguments[0].relationships = [];
                    b.methodArguments[0].notes = {};
                    b.methodArguments[0].user_feed_settings = [];
                    b.methodArguments[0].analytics_tokens = [];
                    b.methodArguments[0].consents = [];
                }
                return b.callOriginalMethod(b.methodArguments);
            });
        } else {
            return this.error("Couldn't find main module needed for this plugin to work.");
        }

        // unreads aren't a thing for bots
        monkeyPatch(findModule('hasUnread').__proto__, 'hasUnread', function() {
            return false;
        });
        m = findModule('manualAck');
        const ackers = ['ack', 'ackCategory', 'localAck', 'manualAck'];
        for (const fName of ackers) {
            monkeyPatch(m, fName, () => {});
        }

        // fix Authorization headers
        monkeyPatch(findModule('getToken'), 'getToken', function(b) {
            const token = b.callOriginalMethod(b.methodArguments);
            return token ? token.startsWith("Bot ") ? token : "Bot " + token : null;
        });
    },
    unload: function() {
        if (this._mod)
            this._mod.prototype._handleDispatch.unpatch();

        m = findModule('hasUnread')
        if (m && m.__proto__ && m.__proto__.hasUnread && m.__proto__.hasUnread.__monkeyPatched)
            m.__proto__.hasUnread.unpatch();

        m = findModule('manualAck');
        const ackers = ['ack', 'ackCategory', 'localAck', 'manualAck'];
        for (const fName of ackers) {
            if (m[fName] && m[fName].__monkeyPatched)
                m[fName].unpatch();
        }

        m = findModule('getToken');
        if (m && m.getToken && m.getToken.__monkeyPatched)
            m.getToken.unpatch();
    }
});
