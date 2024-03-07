chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'submitRating') {
    const backendUrl = 'http://localhost:3000/submitRating';
    const data = {
      videoURL: request.videoURL,
      rating: request.rating
    };

    fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      console.log('Rating submitted successfully:', result);
    })
    .catch(error => {
      console.error('Error submitting rating:', error);
    });
  }
});