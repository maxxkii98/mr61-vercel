document.addEventListener('DOMContentLoaded', function () {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        currentDateElement.textContent = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    const predictionForm = document.getElementById('predictionForm');
    if (predictionForm) {
        predictionForm.onsubmit = function (e) {
            e.preventDefault();
            const selectedTeam = document.querySelector('.team-btn.selected');
            const phoneNumber = document.getElementById('phoneNumber').value;
            const teams = document.getElementById('modalTitle').textContent.replace('ทายผลฟุตบอลทีม', '').trim();
            const currentDateTime = new Date().toLocaleString('th-TH', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
            const status = 'pending';

            if (selectedTeam && phoneNumber) {
                const selectedTeamName = selectedTeam.getAttribute('data-team-name');
                const otherTeamName = selectedTeamName === teams.split(' vs ')[0] ? teams.split(' vs ')[1] : teams.split(' vs ')[0];
                const message = `⚽️ ผลทายบอล-MR61 \n${teams}\n${selectedTeamName}:  (ชนะ)\n${otherTeamName}: -\n☎️เบอร์โทรศัพท์: ${phoneNumber}\n⏱️วันที่ทายผล: ${currentDateTime}`;

                const payload = {
                    message: message,
                    date: new Date().toISOString().split('T')[0],
                    teams: teams,
                    selectedTeam: selectedTeamName,
                    status: status,
                    phoneNumber: phoneNumber
                };

                sendToServer(payload);

                document.getElementById('resultContent').innerHTML = message.replace(/\n/g, '<br>');
                const resultModal = document.getElementById('resultModal');
                resultModal.style.display = 'block';
                const modal = document.getElementById('predictionModal');
                modal.style.display = 'none';
            } else {
                alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            }
        }
    }

    function sendToServer(payload) {
        console.log('Sending payload:', payload);
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

    const matches = [
        {
            teams: "สเปน vs อังกฤษ ",
            time: "วันอาทิตย์ ที่ 14 กรกฎาคม 2024 เวลา 02:00",
            liveUrl: "https://maruay61.win/",
            teamAName: "สเปน",
            teamBName: "อังกฤษ ",
            teamACode: "es",
            teamBCode: "en",
            matchDate: new Date("2024-07-14T23:50:00+07:00")
        }
    ];

    const matchesContainer = document.getElementById('matches');

    matches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.classList.add('match-card');

        const now = new Date();
        const matchDate = match.matchDate;
        const matchEndDate = new Date(matchDate);
        matchEndDate.setHours(matchDate.getHours() + 2);

        let predictButton;
        if (now.toDateString() === matchDate.toDateString() && now < matchDate) {
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

    const modal = document.getElementById('predictionModal');
    const resultModal = document.getElementById('resultModal');
    const closeModalBtn = document.getElementsByClassName('close')[0];
    const closeResultBtn = document.getElementsByClassName('close-result')[0];

    closeModalBtn.onclick = function () {
        modal.style.display = 'none';
    }

    if (closeResultBtn) {
        closeResultBtn.onclick = function () {
            resultModal.style.display = 'none';
        }
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
    const teamAButton = document.getElementById('teamAButton');
    const teamBButton = document.getElementById('teamBButton');

    teamAButton.innerHTML = `<img src="${teamAFlag}" alt="ธงทีม A"><span>${teamAName}</span>`;
    teamBButton.innerHTML = `<img src="${teamBFlag}" alt="ธงทีม B"><span>${teamBName}</span>`;

    teamAButton.setAttribute('data-team-name', teamAName);
    teamBButton.setAttribute('data-team-name', teamBName);

    teamAButton.onclick = function () {
        selectTeam(teamAButton);
    };
    teamBButton.onclick = function () {
        selectTeam(teamBButton);
    };

    const modal = document.getElementById('predictionModal');
    modal.style.display = 'block';
}

function selectTeam(button) {
    const buttons = document.querySelectorAll('.team-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

document.addEventListener('DOMContentLoaded', (event) => {
    const closeButton = document.getElementById('closeButton');

    closeButton.addEventListener('click', () => {
        const modal = document.getElementById('resultModal');
        modal.style.display = 'none';
        location.reload();
    });
});
