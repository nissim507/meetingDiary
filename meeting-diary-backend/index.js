const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const userApi = require('./api/userApi');
const meetingApi = require('./api/meetingApi');
const participantsApi = require('./api/participantsApi');

userApi(app); 
meetingApi(app);   
participantsApi(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
