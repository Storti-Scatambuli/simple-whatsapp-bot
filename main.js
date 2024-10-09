const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const sheets = require('./modules/google_sheets')

const client = new Client({
	authStrategy: new LocalAuth ({
		dataPath: 'whatsapp_auth'
	})
});

client.initialize();

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', async qr => {
    await qrcode.generate(qr, {small: true});
});

client.on('message_create', async message => {
	if (message.body.slice(0, 1) == '!') {
		number = '000' + message.body.slice(1);
		sheets.getPerfume(number.slice(-3)).then((perfume) => {
			client.sendMessage(message.from, perfume)
		})
	}
	
});

