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
	if (message.hasMedia) {
		console.log('Midia identificada')
		const mediafile = await message.downloadMedia();
		console.log(
		  mediafile.mimetype,
		  mediafile.filename,
		  mediafile.data.length
		);

		fs.writeFile(
			"./upload/" + mediafile.filename,
			mediafile.data,
			"base64",
			function (err) {
			  if (err) {
				console.log(err);
			  }
			}
		  );
	}

	else if (message.body.slice(0, 1) == '!') {
		number = '000' + message.body.slice(1);
		sheets.getPerfume(number.slice(-3)).then((perfume) => {
			client.sendMessage(message.from, perfume)
		})
	}
	
});

