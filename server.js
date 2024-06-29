const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ตั้งค่าให้ Express เสิร์ฟไฟล์จากโฟลเดอร์ public และใช้ EJS เป็น View Engine
app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// ตั้งค่าเชื่อมต่อ MongoDB
const mongoUrl = process.env.MONGO_URL;
const client = new MongoClient(mongoUrl);

console.log('Attempting to connect to MongoDB');

client.connect()
    .then(() => {
        console.log('Connected to MongoDB');
        const db = client.db('mr61-football-db');
        const predictionsCollection = db.collection('predictions');

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/public/index.html');
        });

        app.get('/admin', async (req, res) => {
            try {
                const phone = req.query.phone;
                const status = req.query.status;
                let query = {};

                if (phone) {
                    query.phone_number = phone;
                }

                if (status && status !== 'all') {
                    query.status = status;
                }

                const predictions = await predictionsCollection.find(query).toArray();
                res.render('admin', { predictions });
            } catch (error) {
                console.error('Error fetching predictions:', error);
                res.status(500).send('Error fetching predictions');
            }
        });

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
                    // บันทึกข้อมูลการทายผลลงใน MongoDB
                    try {
                        const prediction = { date, teams, team_a_score: teamAScore, team_b_score: teamBScore, status, phone_number: phoneNumber };
                        const insertResult = await predictionsCollection.insertOne(prediction);
                        console.log('Inserted prediction with _id:', insertResult.insertedId);
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
                const predictions = await predictionsCollection.find().toArray();
                console.log('Fetched predictions:', predictions);
                res.json(predictions);
            } catch (error) {
                console.error('Error fetching predictions:', error);
                res.status(500).send('Error fetching predictions');
            }
        });

        // API ค้นหาการทายผลตามหมายเลขโทรศัพท์
        app.get('/api/search-predictions', async (req, res) => {
            const phone = req.query.phone;
            try {
                const predictions = await predictionsCollection.find({ phone_number: phone }).toArray();
                console.log('Fetched predictions by phone:', predictions);
                res.json(predictions);
            } catch (error) {
                console.error('Error fetching predictions:', error);
                res.status(500).send('Error fetching predictions');
            }
        });

        // API กรองการทายผลตามสถานะ
        app.get('/api/filter-predictions', async (req, res) => {
            const status = req.query.status;
            try {
                const query = status === 'all' ? {} : { status: status };
                const predictions = await predictionsCollection.find(query).toArray();
                console.log('Fetched predictions by status:', predictions);
                res.json(predictions);
            } catch (error) {
                console.error('Error fetching predictions:', error);
                res.status(500).send('Error fetching predictions');
            }
        });

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });

console.log(`Starting server on port ${port}`);
