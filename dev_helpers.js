const Plugin = require('../plugin');

module.exports = new Plugin({
    name: "Dev Helpers",
    author: 'Joe 🎸#7070',
    description: "Helps people that like to use the developer tools. Namely, preventing you from being logged out if your client dies while having dev tools open.",
    color: 'darkblue',

    load: async function() {
        monkeyPatch(findModule('hideToken'), 'hideToken', () => {});
        monkeyPatch(findModule('consoleWarning'), 'consoleWarning', () => {
            console.log("%cHold Up!", "color: #7289DA; -webkit-text-stroke: 2px black; font-size: 72px; font-weight: bold;");
            console.log("%cIf you're reading this, you're probably smarter than most Discord developers.", "font-size: 16px;");
            console.log("%cPasting anything in here could actually improve the Discord client.", "font-size: 18px; font-weight: bold; color: red;");
            console.log("%cUnless you understand exactly what you're doing, keep this window open to browse our bad code.", "font-size: 16px;");
            console.log("%cIf you don't understand exactly what you're doing, you should come work with us: https://discordapp.com/jobs", "font-size: 16px;");
        });
    },
    unload: function() {
        findModule('hideToken').hideToken.unpatch();
        findModule('consoleWarning').consoleWarning.unpatch();
    }
});
