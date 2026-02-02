const participantsControl = require('../controllers/participantsControl');
const { authenticate } = require('../middleware/auth');

module.exports = function(app) {
  app.get('/participants/meeting/:meetingId', authenticate, getParticipantsByMeeting);
  app.get('/participants/not-in-meeting/:meetingId', authenticate, getUsersNotInMeeting);
  app.post('/participants/add', authenticate, addParticipant);
  app.post('/participants/update', authenticate, updateParticipantStatus);
  app.delete('/participants', authenticate, deleteParticipant);
};

async function getParticipantsByMeeting(req, res) {
  try {
    const meetingId = parseInt(req.params.meetingId);
    const participants = await participantsControl.getParticipantsByMeeting(meetingId);
    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function addParticipant(req, res) {
  try {
    const { meetingId, userId } = req.body;
    const participant = await participantsControl.addParticipant(meetingId, userId);
    res.status(201).json(participant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function updateParticipantStatus(req, res) {
  try {
    const { meetingId, userId, status } = req.body;
    const updated = await participantsControl.updateParticipantStatus(meetingId, userId, status);
    if(updated) 
    {
      res.status(200).json(updated);
    }
    else
    {
      res.status(404).json({ message: 'Participant not found' }); 
    } 
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

async function deleteParticipant(req, res) {
  try {
    const { meetingId, userId } = req.body;
    const deleted = await participantsControl.deleteParticipant(meetingId, userId);
    if(deleted) 
    {
      res.status(200).json(deleted);
    }
    else 
    {
      res.status(404).json({ message: 'Participant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function getUsersNotInMeeting(req, res) {
  try {
    const meetingId = parseInt(req.params.meetingId);
    const users = await participantsControl.getUsersNotInMeeting(meetingId);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};