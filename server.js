const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '/Users/lilyyang/Desktop/extension/database.db', 
});

// Model
const VideoRating = sequelize.define('VideoRating', {
  // Model attributes
  videoURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Sync model with database
sequelize.sync();

// Parse JSON in the request body
app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

app.post('/submitRating', async (req, res) => {
  try {
    const { videoURL, rating } = req.body;

    await VideoRating.create({
      videoURL: videoURL, 
      rating: rating,
    });

    res.json({ success: true, message: 'Rating submitted successfully.' });
  } catch (error) {

    console.error('Error submitting rating:', error.message);
    res.status(500).json({ success: false, message: 'Error submitting rating.' });
  }
});

app.get('/viewData', async (req, res) => {
  try {
    const data = await VideoRating.findAll();
    let html = '<!DOCTYPE html><html><head><title>View Data</title></head><body>';
    html += '<table border="1"><tr><th>Number</th><th>Video URL</th><th>Rating</th><th>Delete?</th></tr>';
    data.forEach((item, index) => {
      html += `<tr>
                 <td>${index + 1}</td>
                 <td>${item.videoURL}</td>
                 <td>
                   <input type="number" value="${item.rating}" id="rating-${item.id}" />
                   <button onclick="updateRating(${item.id})">Update</button>
                 </td>
                 <td>
                   <button onclick="deleteRow(${item.id}, this)">Delete</button>
                 </td>
               </tr>`;
    });
    html += '</table>';
    html += `
      <script>
        function updateRating(id) {
          const rating = document.getElementById('rating-' + id).value;
          fetch('/updateRating', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, rating }),
          }).then(() => {
            window.location.reload();
          });
        }

        function deleteRow(id, element) {
          fetch('/deleteRow', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
          }).then(() => {
            // Remove the row from the table
            const row = element.parentNode.parentNode;
            row.parentNode.removeChild(row);
            // Update row numbers
            const table = document.querySelector('table');
            Array.from(table.rows).forEach((row, index) => {
              if (index > 0) { // Skip header row
                row.cells[0].innerText = index; // Update the Number column
              }
            });
          });
        }
      </script>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/updateRating', async (req, res) => {
  try {
    const { id, rating } = req.body;
    await VideoRating.update({ rating }, { where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ success: false, message: 'Error updating rating.' });
  }
});

app.post('/deleteRow', async (req, res) => {
  try {
    const { id } = req.body;
    await VideoRating.destroy({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting row:', error);
    res.status(500).json({ success: false, message: 'Error deleting row.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});