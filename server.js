const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ตั้งค่าให้ Express เสิร์ฟไฟล์จากโฟลเดอร์ public และใช้ EJS เป็น View Engine
app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// ลบการเชื่อมต่อกับ MongoDB

// API สำหรับส่งข้อความไปยัง Telegram
app.post('/send-message', async (req, res) => {
    const { message, date, teams, teamAScore, teamBScore, status, phoneNumber } = req.body;
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    console.log('Received data:', req.body);

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

        console.log("Response from Telegram:", data);

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

// เสิร์ฟไฟล์ index.html เมื่อเข้าหน้าแรก
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
