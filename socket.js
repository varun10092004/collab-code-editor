const Room = require("./models/Room");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", async ({ roomId }) => {
      try {
        socket.join(roomId);

        let room = await Room.findOne({ roomId });
        if (!room) {
          room = await Room.create({ roomId, code: "" });
        }

        socket.emit("sync-code", room.code);
      } catch (error) {
        console.error("JOIN ROOM ERROR:", error);
      }
    });

    socket.on("code-change", async ({ roomId, code }) => {
      try {
        await Room.findOneAndUpdate(
          { roomId },
          { code },
          { upsert: true, new: true }
        );

        socket.to(roomId).emit("sync-code", code);
      } catch (error) {
        console.error("CODE UPDATE ERROR:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

