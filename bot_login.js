const Plugin = require('../plugin');

module.exports = new Plugin({
    name: 'Bot Login',
    author: 'Joe 🎸#7070',
    description: 'Log in as a bot user without being redirected or logged out. DO NOT USE THIS AS A NORMAL USER!',
    color: 'hotpink',
    preload: true,

    load: async function() {

        while (!window.findRawModule || !findRawModule('showPendingNotification', true))
            await this.sleep(2);

        let m = findRawModule('showPendingNotification');
        if (m && m.i && req.c[m.i + 1]) {
            monkeyPatch(req.c[m.i + 1].exports.prototype, '_handleDispatch', function(b) {
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
                }
                return b.callOriginalMethod(b.methodArguments);
            });
        }

        while (!findModule('hasUnread', true) || !findModule('getToken', true) || !findModule('ack', true))
            await this.sleep(1000);

        // unreads aren't a thing for bots
        monkeyPatch(findModule('hasUnread').__proto__, 'hasUnread', function() {
            return false;
        });
        m = findModule('ack');
        const ackers = ['ack', 'ackCategory', 'localAck', 'manualAck'];
        for (const fName of ackers) {
            monkeyPatch(m, fName, () => {});
        }

        // fix Authorization headers
        monkeyPatch(findModule('getToken'), 'getToken', function(b) {
            return "Bot " + b.callOriginalMethod(b.methodArguments);
        });
    },
    unload: function() {
        let m = findRawModule('showPendingNotification');
        if (m && m.i && req.c[m.i + 1])
            req.c[m.i + 1].exports.prototype._handleDispatch.unpatch();

        m = findModule('hasUnread')
        if (m && m.__proto__ && m.__proto__.hasUnread && m.__proto__.hasUnread.__monkeyPatched)
            m.__proto__.hasUnread.unpatch();

        m = findModule('ack');
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
