# Atlas Academy DB

![Docker](https://github.com/atlasacademy/apps/workflows/Docker/badge.svg)

Source code for the Atlas Academy DB at https://apps.atlasacademy.io/db

You can join our Discod to discuss the development. Feel free to make a Pull request or open an issue but we are usually more responsive on Discord.

[![Discord server invite](https://discordapp.com/api/guilds/502554574423457812/embed.png)](https://discord.gg/TKJmuCR)

## Development workflow

```bash
# install lerna
npm i -g lerna

# clone repo
git clone https://github.com/atlasacademy/apps.git

# use dev branch
git checkout dev && git pull

# setup packages
lerna bootstrap

# run typescript watchers
npm run watch

# run dev db
npm run start:db

# or run this command on Windows
npm run start:db-win

# ... make changes

# commit changes
git add -A && git commit -m "stuff
```

## Publish workflow

This is not applicable if you are not part of the npm.js Atlas Academy org. Ping one of the contributors to publish the changes.

```bash
# publish changes
lerna publish

# merge to master
git checkout master && git pull && git merge dev
```