const { log, getText } = global.utils;
const socketIO = require("socket.io");

module.exports = function (server) {
	try {
		const io = socketIO(server);
		
		io.on("connection", (socket) => {
			// log.info("SOCKET.IO", "New client connected: " + socket.id);

			socket.on("disconnect", () => {
				// log.info("SOCKET.IO", "Client disconnected: " + socket.id);
			});

			socket.on("error", (err) => {
				log.warn("SOCKET.IO", `Socket error: ${err.message}`);
			});
		});

		log.info("SOCKET.IO", getText('socketIO', 'connected'));
	} catch (err) {
		log.err("SOCKET.IO", getText('socketIO', 'error'), err);
	}
};
