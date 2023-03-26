# Atlas Academy DB

![Cloudflare Worker Publish](https://github.com/atlasacademy/apps/workflows/Cloudflare%20Worker%20Publish/badge.svg)

Source code for the Atlas Academy DB at https://apps.atlasacademy.io/db

You can join our Discod to discuss the development. Feel free to make pull request or open an issue but we are usually more responsive on Discord.

[![Discord server invite](https://discordapp.com/api/guilds/502554574423457812/embed.png)](https://discord.gg/TKJmuCR)

## Development workflow

```bash
# clone repo
git clone https://github.com/atlasacademy/apps.git aa-apps
cd aa-apps

# install lerna and prettier. You should use prettier with the given config to format the files.
npm ci

# setup packages with local npm link
npx lerna bootstrap --ci --force-local

# run typescript watchers
npm run watch

# run dev db on another terminal
npm run start:db

# ... make changes

# commit changes
npm run format
git add -A && git commit -m "stuff"
```

## Publish workflow

This is not applicable if you are not part of the npm.js Atlas Academy org. Ping one of the contributors to publish the changes.

```bash
# publish changes
lerna publish

# merge to master
git checkout master && git pull && git merge dev
```
