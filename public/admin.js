document.addEventListener('DOMContentLoaded', function() {
  fetchPredictions();
});

function fetchPredictions() {
  // Fetch predictions from your API
  fetch('/api/get-predictions')
      .then(response => response.json())
      .then(data => {
          renderPredictions(data);
      })
      .catch(error => {
          console.error('Error fetching predictions:', error);
      });
}

function renderPredictions(predictions) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';
  predictions.forEach(prediction => {
      const card = document.createElement('div');
      card.classList.add('result-card');
      card.innerHTML = `
          <p>วันที่ทายผล: ${prediction.date}</p>
          <p>ทีมทายผล: ${prediction.teams}</p>
          <p>Score ทายผล: ${prediction.teamAScore} : ${prediction.teamBScore}</p>
          <p>สถานะ: ${prediction.status}</p>
          <p>เบอร์โทรศัพท์: ${prediction.phoneNumber}</p>
      `;
      resultsContainer.appendChild(card);
  });
}

function searchByPhone() {
  const phone = document.getElementById('searchPhone').value;
  // Fetch predictions by phone number from your API
  fetch(`/api/search-predictions?phone=${phone}`)
      .then(response => response.json())
      .then(data => {
          renderPredictions(data);
      })
      .catch(error => {
          console.error('Error fetching predictions:', error);
      });
}

function filterStatus() {
  const status = document.getElementById('statusFilter').value;
  // Fetch predictions by status from your API
  fetch(`/api/filter-predictions?status=${status}`)
      .then(response => response.json())
      .then(data => {
          renderPredictions(data);
      })
      .catch(error => {
          console.error('Error fetching predictions:', error);
      });
}
