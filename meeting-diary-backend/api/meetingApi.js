const meetingControl = require('../controllers/meetingControl');
const { authenticate } = require('../middleware/auth')

module.exports = function(app) {
  app.get('/meetings', authenticate, getAllMeetings);
  app.get('/meetings/user/:userId', authenticate, getMeetingsByUserId);
  app.get('/meetings/:id', authenticate, getMeetingById);
  app.post('/meetings/add', authenticate, addMeeting);
  app.put('/meetings/:id', authenticate, updateMeeting);
  app.delete('/meetings/:id', authenticate, deleteMeeting);
};

async function getAllMeetings(req, res) {
  try {
    const meetings = await meetingControl.getAllMeetings();
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMeetingsByUserId(req, res) {
  try {
    const userId = req.params.userId;
    const date = req.query.date;
    const meetings = await meetingControl.getMeetingsByUserId(userId, date);
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMeetingById(req, res) {
  try {
    const id = req.params.id;
    const meeting = await meetingControl.getMeetingById(id);
    if (meeting) 
    {
      res.status(200).json(meeting);
    } else 
    {
      res.status(404).json({ message: 'Meeting not found' });
    }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

async function addMeeting(req, res) {
  try {
    const newMeeting = req.body;
    const meeting = await meetingControl.addMeeting(newMeeting);
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateMeeting(req, res) {
  try {
    const meeting = {
      ...req.body,
      meeting_id: req.params.id,
    };
    const updated = await meetingControl.updateMeeting(meeting);

    if (updated) {
      res.status(200).json(updated);
    } else {
      res.status(404).json({ message: "Meeting not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteMeeting(req, res) {
  try {
    const id = req.params.id;
    const deleted = await meetingControl.deleteMeeting(id);
    if(deleted) 
    {
      res.status(200).json(deleted);
    }
    else 
    {
      res.status(404).json({ message: error.message});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



