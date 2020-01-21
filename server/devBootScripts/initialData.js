const moment = require('moment');

module.exports = App => {
    const { Room, user, Booking } = App.models;
    Room.create(
      {
        name: "Kijimi",
        bg_color: "gray",
        txt_color: "blue"
      }, (err, kijimiRoom) => {
        if (err) {
          throw new Error(`Cannot create Room`, err);
        }

        user.create(
            {
                name: "Babu Frik",
                role: "admin",
            }, (err, babu) => {
                if (err) {
                    throw new Error('Cannot create user', err);
                }

            Booking.create(               
                {
                    description: "He-hey!",
                    start: moment().set( { hour: 10, minute: 15 } ).valueOf(),
                    end: moment().set( { hour: 10, minute: 45 } ).valueOf(),
                    room_id: kijimiRoom.id,
                    user_id: babu.id
                }, (err, newBooking) => {
                  if (err) {
                    throw new Error('Cannot create booking', err);
                  }
                }
            )

            }
        )
      }
    );
  };

