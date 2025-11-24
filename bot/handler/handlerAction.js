const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
	const handlerEvents = require(process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

	return async function (event) {
		// Safety check for event
		if (!event || !event.type) return;

		// Check if the bot is in the inbox and anti inbox is enabled
		if (
			global.GoatBot.config.antiInbox == true &&
			(event.senderID == event.threadID || event.userID == event.senderID || event.isGroup == false) &&
			(event.senderID || event.userID || event.isGroup == false)
		)
			return;

		try {
			const message = createFuncMessage(api, event);

			await handlerCheckDB(usersData, threadsData, event);
			const handlerChat = await handlerEvents(event, message);
			
			if (!handlerChat) return;

			const {
				onAnyEvent, onFirstChat, onStart, onChat,
				onReply, onEvent, handlerEvent, onReaction,
				typ, presence, read_receipt
			} = handlerChat;

			// Execute Always
			if (onAnyEvent) onAnyEvent();

			switch (event.type) {
				case "message":
				case "message_reply":
				case "message_unsend":
					if (onFirstChat) onFirstChat();
					if (onChat) onChat();
					if (onStart) onStart();
					if (onReply) onReply();
					break;
				case "event":
				case "change_thread_image":
				case "change_thread_name":
				case "log:subscribe":
				case "log:unsubscribe":
					if (handlerEvent) handlerEvent();
					if (onEvent) onEvent();
					break;
				case "message_reaction":
					if (onReaction) onReaction();
					break;
				case "typ":
					if (typ) typ();
					break;
				case "presence":
					if (presence) presence();
					break;
				case "read_receipt":
					if (read_receipt) read_receipt();
					break;
				default:
					break;
			}
		} catch (error) {
			// Log error but prevent crash
			global.utils.log.err("HANDLER ACTION", "Critical Error in Action Handler:", error);
		}
	};
};
