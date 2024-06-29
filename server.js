const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ตั้งค่าให้ Express เสิร์ฟไฟล์จากโฟลเดอร์ public
app.use(express.static('public'));
app.use(bodyParser.json());

// ตั้งค่าเชื่อมต่อ PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/send-message', async (req, res) => {
    const { message, date, teams, teamAScore, teamBScore, status, phoneNumber } = req.body;
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

        console.log("Response from Telegram:", data);

        if (data.ok) {
            // บันทึกข้อมูลการทายผลลงใน PostgreSQL
            try {
                const insertQuery = `
                    INSERT INTO predictions (date, teams, team_a_score, team_b_score, status, phone_number)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `;
                const values = [date, teams, teamAScore, teamBScore, status, phoneNumber];
                await pool.query(insertQuery, values);
                res.status(200).send('Message sent and prediction saved successfully');
            } catch (dbError) {
                console.error('Error saving prediction:', dbError);
                res.status(500).send('Error saving prediction');
            }
        } else {
            console.error('Error sending message:', data);
            res.status(500).send(`Error sending message: ${data.description}`);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send(`Error sending message: ${error.message}`);
    }
});

// API ดึงข้อมูลการทายผลทั้งหมด
app.get('/api/get-predictions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM predictions');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching predictions:', error);
        res.status(500).send('Error fetching predictions');
    }
});

// API ค้นหาการทายผลตามหมายเลขโทรศัพท์
app.get('/api/search-predictions', async (req, res) => {
    const phone = req.query.phone;
    try {
        const result = await pool.query('SELECT * FROM predictions WHERE phone_number = $1', [phone]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching predictions:', error);
        res.status(500).send('Error fetching predictions');
    }
});

// API กรองการทายผลตามสถานะ
app.get('/api/filter-predictions', async (req, res) => {
    const status = req.query.status;
    try {
        const query = status === 'all' ? 'SELECT * FROM predictions' : 'SELECT * FROM predictions WHERE status = $1';
        const values = status === 'all' ? [] : [status];
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching predictions:', error);
        res.status(500).send('Error fetching predictions');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
