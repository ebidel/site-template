Minimal Node/Express server that is basically a static markdown site generator,
but way less deps!

### Development

Get the code:

    git clone https://github.com/ebidel/site-template
    cd site-template
    npm i

To run, start the server. The `env` variable `DEV=true` will recompile
nunjucks templates as edits are made and server the unminified JS/CSS files.

    yarn start
    DEV=true yarn start

Run `gulp` any time you make changes to JS code.

### Deployment

    npm run deploy
