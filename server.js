const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/send-message', async (req, res) => {
    const { message } = req.body;
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!message || message.trim() === "") {
        res.status(400).send('Message text is empty');
        return;
    }

    const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: message
            })
        });

        const data = await response.json();

        if (data.ok) {
            res.status(200).send('Message sent successfully');
        } else {
            console.error('Error sending message:', data);
            res.status(500).send(`Error sending message: ${data.description}`);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send(`Error sending message: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
