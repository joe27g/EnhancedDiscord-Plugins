const Plugin = require('../plugin');

module.exports = new Plugin({
    name: 'Experiments',
    author: 'Joe 🎸#7070',
    description: 'Enables Discord Staff "experiments." (super-secret dev features)',
    color: 'limegreen',

    load: function() {
        const mod = findModule(mod => mod.getExperimentDescriptor && !mod.getExperimentId);
        if (!mod || !mod.__proto__) {
            return this.warn("Couldn't find isDeveloper module.")
        }
        mod.__proto__ = {
            constructor: mod.__proto__,
            getExperimentDescriptor: mod.__proto__.getExperimentDescriptor,
            isDeveloper: true,
            __proto__: mod.__proto__.__proto__
        };
    },
    unload: function() {
        const mod = findModule(mod => mod.getExperimentDescriptor && !mod.getExperimentId);
        if (!mod || !mod.__proto__) {
            return this.warn("Couldn't find isDeveloper module.")
        }
        mod.__proto__.isDeveloper = false;
    }
});
