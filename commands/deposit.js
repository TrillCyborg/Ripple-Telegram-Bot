require("dotenv").config();

const _ = require("lodash");

class DepositCommand {
    constructor(app, db) {
        this.app = app;
        this.db = db;
        this.setCommand()
    }

    setCommand() {
        this.app.command('deposit', async(ctx) => {
            const {replyWithPhoto, replyWithHTML} = ctx;

            // can not run this command in groups
            const chat_type = _.get(ctx, ['update', 'message', 'chat', 'type']);

            if(chat_type !== 'private'){
                return replyWithHTML(`<b>This type of command is not available in group!</b>`)
            }

            const userModel = new this.db.User ;
            const user = await userModel.getUser(ctx);
            const address = `${process.env.WALLET_ADDRESS}?dt=${user.telegramId}`;
            let qrCode = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${address}`;
            replyWithPhoto(qrCode)
                .then( () => replyWithHTML(`<b>Address: </b><code>${process.env.WALLET_ADDRESS}</code>`))
                .then( () => replyWithHTML(`<b>Destination Tag: </b><code>${user.telegramId}</code>`))

        })
    }
}

module.exports = DepositCommand;
