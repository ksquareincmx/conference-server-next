module.exports = {
  rythm: "quarter", // Let's you book only on quarter of an hour
  minDuration: 15, // minutes
  maxDuration: Infinity, // Within workingHours
  timezone: process.env.TZ || "America/Mexico_City",
  // Ideally we would write this like, { from: "monday": to: "friday" };
  workingDays: [1, 2, 3, 4, 5],
  workingHours: [
    {
      from: "08:00",
      to: "18:00"
    }
  ]
};
