const participantsQuery = require('../models/participantsQuery');

exports.getParticipantsByMeeting = async (meetingId) => {
  if(!meetingId)
  {
    throw new Error('Meeting ID is required');
  } 
  
  return await participantsQuery.getParticipantsByMeetingId(meetingId);
};

exports.addParticipant = async (meetingId, userId) => {
  if(!meetingId || !userId)
  {
    throw new Error('Meeting ID and User ID are required');
  } 
  
  return await participantsQuery.addParticipant(meetingId, userId);
};

exports.updateParticipantStatus = async (meetingId, userId, status) => {
  if(!meetingId || !userId || !status)
  {
    throw new Error('Participant ID and status are required');
  } 

  if(!['pending','arrived','absent'].includes(status))
  {
    throw new Error('Invalid status');
  } 

  return await participantsQuery.updateParticipantStatus(meetingId, userId, status);
};

exports.deleteParticipant = async (meetingId, userId) => {
  if(!meetingId || !userId)
  {
  throw new Error('Participant ID is required');    
  } 

  return await participantsQuery.deleteParticipant(meetingId, userId);
};

exports.getUsersNotInMeeting = async (meetingId) => {
  if (!meetingId) {
    throw new Error('Meeting ID is required');
  }
  return await participantsQuery.getUsersNotInMeeting(meetingId);
};