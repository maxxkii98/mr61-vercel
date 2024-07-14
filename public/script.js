document.addEventListener('DOMContentLoaded', function () {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        currentDateElement.textContent = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    const predictionForm = document.getElementById('predictionForm');
    if (predictionForm) {
        predictionForm.onsubmit = function (e) {
            e.preventDefault();
            const teamAScore = document.getElementById('teamAScore').value;
            const teamBScore = document.getElementById('teamBScore').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const teams = document.getElementById('modalTitle').textContent.replace('ทายผลฟุตบอลทีม', '').trim();
            const currentDateTime = new Date().toLocaleString('th-TH', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
            const status = 'pending'; // เปลี่ยนเป็น 'win' หรือ 'lose' ตามที่ต้องการ

            if (teamAScore && teamBScore && phoneNumber) {
                const teamNames = teams.split(' vs ');
                const message = `⚽️ ผลทายบอล-MR61 \n${teamNames[0]} vs ${teamNames[1]}\n${teamNames[0]}: ${teamAScore}\n${teamNames[1]}: ${teamBScore}\n☎️เบอร์โทรศัพท์: ${phoneNumber}\n⏱️วันที่ทายผล: ${currentDateTime}`;

                const payload = {
                    message: message,
                    date: new Date().toISOString().split('T')[0], // ส่งวันที่ในรูปแบบ 'YYYY-MM-DD'
                    teams: teams,
                    teamAScore: parseInt(teamAScore),
                    teamBScore: parseInt(teamBScore),
                    status: status,
                    phoneNumber: phoneNumber
                };

                sendToServer(payload);

                document.getElementById('resultContent').innerHTML = message.replace(/\n/g, '<br>');
                resultModal.style.display = 'block';
                modal.style.display = 'none';
            } else {
                alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            }
        }
    }

    function sendToServer(payload) {
        console.log('Sending payload:', payload); // เพิ่มการบันทึกข้อมูลที่กำลังจะส่ง
        fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
    }

    // Initialize matches
    const matches = [
        // {
        //     teams: "สวิตเซอร์แลนด์ vs อิตาลี",
        //     time: "วันที่ 29 มิถุนายน 2024 เวลา 23:00",
        //     liveUrl: "https://maruay61.win/",
        //     teamAName: "สวิตเซอร์แลนด์",
        //     teamBName: "อิตาลี",
        //     teamACode: "ch",
        //     teamBCode: "it",
        //     matchDate: new Date("2024-06-29T22:00:00+07:00")
        // },
        // {
        //     teams: "เยอรมนี vs เดนมาร์ก",
        //     time: "วันที่ 30 มิถุนายน 2024 เวลา 02:00",
        //     liveUrl: "https://maruay61.win/",
        //     teamAName: "เยอรมนี",
        //     teamBName: "เดนมาร์ก",
        //     teamACode: "de",
        //     teamBCode: "dk",
        //     matchDate: new Date("2024-06-29T22:00:00+07:00")
        // },
        // {
        //     teams: "สวิตเซอร์แลนด์ vs อิตาลี",
        //     time: "วันที่ 29 มิถุนายน 2024 เวลา 23:00",
        //     liveUrl: "https://maruay61.win/",
        //     teamAName: "สวิตเซอร์แลนด์",
        //     teamBName: "อิตาลี",
        //     teamACode: "ch",
        //     teamBCode: "it",
        //     matchDate: new Date("2024-06-29T22:00:00+07:00")
        // },
        // {
        //     teams: "เยอรมนี vs เดนมาร์ก",
        //     time: "วันที่ 30 มิถุนายน 2024 เวลา 02:00",
        //     liveUrl: "https://maruay61.win/",
        //     teamAName: "เยอรมนี",
        //     teamBName: "เดนมาร์ก",
        //     teamACode: "de",
        //     teamBCode: "dk",
        //     matchDate: new Date("2024-06-29T22:00:00+07:00")
        // },
        // {
        //     teams: "อังกฤษ vs สโลวาเกีย",
        //     time: "วันที่ 30 มิถุนายน 2024 เวลา 23:00",
        //     liveUrl: "https://maruay61.win/",
        //     teamAName: "อังกฤษ",
        //     teamBName: "สโลวาเกีย",
        //     teamACode: "gc",
        //     teamBCode: "sk",
        //     matchDate: new Date("2024-06-30T22:00:00+07:00")
        // },
        // {
        //     teams: "สเปน vs จอร์เจีย",
        //     time: "วันที่ 01 กรกฏาคม 2024 เวลา 02:00",
        //     liveUrl: "https://maruay61.win/",
        //     teamAName: "สเปน",
        //     teamBName: "จอร์เจีย",
        //     teamACode: "es",
        //     teamBCode: "ge",
        //     matchDate: new Date("2024-06-30T22:00:00+07:00")
        // },
        // {
        //     teams: "สเปน vs เยอรมนี",
        //     time: "วันที่ 05 กรกฎาคม 2024 เวลา 23:00",
        //     liveUrl: "https://maruay61.win/",
        //     teamAName: "สเปน",
        //     teamBName: "เยอรมนี",
        //     teamACode: "es",
        //     teamBCode: "de",
        //     matchDate: new Date("2024-07-05T22:00:00+07:00")
        // },
        // {
        //     teams: "โปรตุเกส vs ฝรั่งเศส",
        //     time: "วันที่ 05 กรกฎาคม 2024 เวลา 02:00",
        //     liveUrl: "https://maruay61.win/",
        //     teamAName: "โปรตุเกส",
        //     teamBName: "ฝรั่งเศส",
        //     teamACode: "pt",
        //     teamBCode: "fr",
        //     matchDate: new Date("2024-07-05T22:00:00+07:00")
        // },
        {
            teams: "สเปน vs อังกฤษ ",
            time: "วันอาทิตย์ ที่ 14 กรกฎาคม 2024 เวลา 02:00",
            liveUrl: "https://maruay61.win/",
            teamAName: "สเปน",
            teamBName: "อังกฤษ ",
            teamACode: "es",
            teamBCode: "en",
            matchDate: new Date("2024-07-14T23:50:00+07:00")
        },
        // {
        //     teams: "เนเธอร์แลนด์ vs อังกฤษ  ",
        //     time: "วันที่ 11 กรกฎาคม 2024 เวลา 02:00",
        //     liveUrl: "https://maruay61.win/",
        //     teamAName: "เนเธอร์แลนด์",
        //     teamBName: "อังกฤษ  ",
        //     teamACode: "nl",
        //     teamBCode: "en",
        //     matchDate: new Date("2024-07-10T22:00:00+07:00")
        // }
    ];


    const matchesContainer = document.getElementById('matches');

    matches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.classList.add('match-card');

        const now = new Date();
        const matchDate = match.matchDate;
        const matchEndDate = new Date(matchDate);
        matchEndDate.setHours(matchDate.getHours() + 2); // สมมติว่าแต่ละการแข่งขันใช้เวลา 2 ชั่วโมง

        let predictButton;
        if (now.toDateString() === matchDate.toDateString() && now < matchDate) {
            // If today is the match date and the current time is before the match time
            predictButton = `<button class="predict-btn" onclick="openModal('${match.teams}', 'images/64/${match.teamACode}_64.png', 'images/64/${match.teamBCode}_64.png', '${match.teamAName}', '${match.teamBName}')">ทายผล</button>`;
        } else if (now >= matchDate && now < matchEndDate) {
            predictButton = `<button class="predict-btn expired" disabled>หมดเวลาทาย</button>`;
        } else if (now >= matchEndDate) {
            predictButton = `<button class="predict-btn finished" disabled>หมดเวลาทายผล</button>`;
        } else {
            predictButton = `<button class="predict-btn disabled" disabled>ยังไม่ถึงเวลา</button>`;
        }

        matchCard.innerHTML = `
            <div class="match-info">
                <img src="images/64/${match.teamACode}_64.png" alt="${match.teamAName}">
                <img src="images/64/${match.teamBCode}_64.png" alt="${match.teamBName}">
            </div>
            <div class="match-details">
                <h2>${match.teams}</h2>
                <p class="match-time">${match.time}</p>
            </div>
            <div class="buttons">
                ${predictButton}
                <button class="live-btn" onclick="window.open('${match.liveUrl}', 'https://maruay61.win/')">กลับเข้าสู่เว็บไชต์</button>
            </div>
        `;

        matchesContainer.appendChild(matchCard);
    });

    // Modal functionality
    const modal = document.getElementById('predictionModal');
    const resultModal = document.getElementById('resultModal');
    const closeModalBtn = document.getElementsByClassName('close')[0];
    const closeResultBtn = document.getElementsByClassName('close-result')[0];

    closeModalBtn.onclick = function () {
        modal.style.display = 'none';
    }

    closeResultBtn.onclick = function () {
        resultModal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        } else if (event.target == resultModal) {
            resultModal.style.display = 'none';
        }
    }
});

function openModal(teams, teamAFlag, teamBFlag, teamAName, teamBName) {
    document.getElementById('modalTitle').innerHTML = `ทายผลฟุตบอลทีม ${teams}`;
    document.getElementById('teamAFlag').src = teamAFlag;
    document.getElementById('teamBFlag').src = teamBFlag;
    document.getElementById('teamALabel').textContent = `${teamAName} `;
    document.getElementById('teamBLabel').textContent = `${teamBName} `;
    const modal = document.getElementById('predictionModal');
    modal.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', (event) => {
    const closeButton = document.getElementById('closeButton');

    closeButton.addEventListener('click', () => {
        const modal = document.getElementById('resultModal');
        modal.style.display = 'none'; // ปิด Modal
        location.reload(); // รีเฟรชหน้าเว็บ
    });
});
