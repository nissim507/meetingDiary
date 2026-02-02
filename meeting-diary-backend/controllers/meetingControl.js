const meetingQuery = require('../models/meetingQuery')
const participantsQuery = require('../models/participantsQuery')

exports.getAllMeetings = async () => {
  return await meetingQuery.getAllMeetings();
};

exports.getMeetingsByUserId = async (userId, date) => {
  if(!userId) {
    throw new Error('User ID is required');
  }

  if(date) {
    return await meetingQuery.getMeetingsByUserIdAndDate(userId, date);
  }

  return await meetingQuery.getMeetingsByUserId(userId);
}

exports.getMeetingById = async (id) => {
  if(!id) {
    throw new Error('Meeting ID is required');
  }

  const meeting = await meetingQuery.getMeetingById(id);
  if(!meeting) {
    throw new Error('Meeting not found');
  }

  return meeting;
}

exports.addMeeting = async (newMeeting) => {
  if(!newMeeting || !newMeeting.title || !newMeeting.date || !newMeeting.time || !newMeeting.owner_user || !newMeeting.place ) 
  {
    throw new Error('Missing meeting data');
  }
  //adding the meeting to meeting DB
  const meeting = await meetingQuery.insertMeeting(newMeeting);
  if(!meeting || !meeting.meeting_id) 
  {
    throw new Error('Failed to create a meeting');
  }

  //adding the owner to participants DB
  await participantsQuery.addParticipant(meeting.meeting_id, meeting.owner_user);

  //adding other participants
  if(newMeeting.participants && Array.isArray(newMeeting.participants))
  {
    for(const userId of newMeeting.participants)
    {
      if(userId !== newMeeting.owner_user) 
      {
        await participantsQuery.addParticipant(meeting.meeting_id, userId);
      }
    }
  }

  return meeting;
}

exports.updateMeeting = async (meeting) => {
  if (!meeting.meeting_id) {
    throw new Error("Meeting ID is required");
  }

  const existing = await meetingQuery.getMeetingById(meeting.meeting_id);
  if (!existing) {
    throw new Error("Meeting not found");
  }

  return await meetingQuery.updateMeeting(meeting);
};

exports.deleteMeeting = async (id) => {
  if(!id) {
    throw new Error('Meeting ID is required');
  }

  return await meetingQuery.deleteMeeting(id);
}

