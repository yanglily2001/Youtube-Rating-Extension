document.getElementById('submitBtn').addEventListener('click', function () {
  const videoURL = document.getElementById('videoURL').value;
  const rating = document.getElementById('rating').value;

  chrome.runtime.sendMessage({ action: 'submitRating', videoURL, rating });
});

document.addEventListener('DOMContentLoaded', function() {
  const viewDataButton = document.getElementById('viewDataButton');
  viewDataButton.addEventListener('click', function() {
    chrome.tabs.create({url: 'http://localhost:3000/viewData'});
  });
});

