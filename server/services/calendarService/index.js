const { config } = require("../../config/config");
const CalendarAPI = require("node-google-calendar");

class GoogleCalendarService {
  constructor(
    sendUpdates = "all",
    timeZone = "America/Mexico_City",
    calendarId = "primary"
  ) {
    this.params = {
      sendUpdates
    };
    this.timeZone = timeZone;
    this.calendarId = calendarId;
    this.calendar = new CalendarAPI(config.serviceAccount);
  }

  async insertEvent(start, end, description, attendees, location) {
    const event = this.defineEvent(
      start,
      end,
      description,
      location,
      attendees
    );

    try {
      const googleEvent = await this.calendar.Events.insert(
        this.calendarId,
        event,
        this.params
      );
      return googleEvent;
    } catch (err) {
      return new Error(err);
    }
  }

  async updateEvent(eventId, start, end, description, attendees, location) {
    const event = this.defineEvent(
      start,
      end,
      description,
      location,
      attendees
    );

    try {
      const googleEvent = await this.calendar.Events.update(
        this.calendarId,
        eventId,
        event,
        this.params
      );
      return googleEvent;
    } catch (err) {
      return new Error(err);
    }
  }

  async deleteEvent(eventId) {
    try {
      const deletedEvent = await this.calendar.Events.delete(
        this.calendarId,
        eventId,
        this.params
      );
      return deletedEvent;
    } catch (error) {
      return new Error(error);
    }
  }

  defineEvent(start, end, description, location, attendees = []) {
    const event = {
      location,
      start: {
        dateTime: start,
        timeZone: this.timeZone
      },
      end: {
        dateTime: end,
        timeZone: this.timeZone
      },
      summary: description,
      attendees: /*only place where attendees should be called this*/ attendees.map(
        attendee => ({
          email: attendee
        })
      )
    };
    return event;
  }
}

module.exports = {
  calendarService: new GoogleCalendarService()
};
