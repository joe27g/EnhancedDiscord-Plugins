# Bot Login
Allow you to log in as a bot user instead of being automatically logged out.

### Only use this plugin while using a bot token!!!
If you have this enabled with a user account, you will get errors.

**Best used with the [Dev Helpers plugin](/dev_helpers.md) to avoid being logged out.**

#### To use this plugin:
1. Start Discord without the plugin enabled.
2. Open dev tools (Ctrl+Shift+I), go to the Application tab, and add or edit the `token` entry with the bot token in quotes, i.e. `"McgxZTUyMFh4BZB5NGzUIw.DPOp5Q.eeK-M6FyC6HKK8qTyjxJn7LNc1Ds"`.
3. Enable the plugin or add it to your `plugins` folder.
4. Kill the client with Task Manager or something similar. *(If you use Ctrl+R or the normal 'Quit Discord' button, the `beforeunload` event will be fired, reverting the token to your personal one.)*
5. Have fun! :)

#### Download
To quickly download, right-click [this link](https://github.com/joe27g/EnhancedDiscord-Plugins/raw/master/bot_login.js) and `Save link as...`
