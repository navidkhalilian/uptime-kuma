const NotificationProvider = require("./notification-provider");
const axios = require("axios");

class Bale extends NotificationProvider {
    name = "bale";

    /**
     * @inheritdoc
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        const okMsg = "Sent Successfully.";
        const url = "https://tapi.bale.ai";

        try {
            let params = {
                chat_id: notification.baleChatID,
                text: msg
            };
            console.log('url+++',`${url}/bot${notification.baleBotToken}/sendMessage`);
            console.log('params+++',params);
            await axios.get(`${url}/bot${notification.baleBotToken}/sendMessage`, {
                params: params,
            });
            return okMsg;

        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }
}

module.exports = Bale;
