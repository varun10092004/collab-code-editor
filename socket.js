const Room = require("./models/Room");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", async ({ roomId }) => {
      socket.join(roomId);

      let room = await Room.findOne({ roomId });
      if (!room) room = await Room.create({ roomId, code: "" });

      socket.emit("sync-code", room.code);
    });

    socket.on("code-change", async ({ roomId, code }) => {
      await Room.findOneAndUpdate(
        { roomId },
        { code },
        { upsert: true }
      );
      socket.to(roomId).emit("sync-code", code);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
