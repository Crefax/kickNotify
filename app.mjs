import { WebhookClient } from 'discord.js';
import { KickApiWrapper } from 'kick.com-api';
const kickApi = new KickApiWrapper();
import config from './config.json' assert { type: 'json' };
var cooldown = false;

setInterval(() => {
    kickApi.fetchChannelData(config.kick_username)
        .then(data => {
    if (data.livestream != null) {
        let baslik = data.livestream.session_title;
        let profilePicture = data.user.profile_pic;
        let kickUsername = data.user.username;
        let webhookUrl = config.webhook_url; 
        if (!cooldown){
            notifySender(kickUsername, profilePicture, baslik, webhookUrl);
            cooldown = true;
        }
    } else 
        cooldown = false;
  })
  .catch(error => console.error(error));
}, 60000);


async function notifySender(kickName, avatar, title, webhookurl) {
    const webhookClient = new WebhookClient({ url: webhookurl });
    
    let message = `${title} \n\nhttps://kick.com/${kickName}`;

    webhookClient.send({
        content: message,
        username: kickName,
        avatarURL: avatar,
    });
}