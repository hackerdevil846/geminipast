/* eslint-disable no-redeclare */
"use strict";
var utils = require("../utils");
var log = require("npmlog");
var mqtt = require('mqtt');
var websocket = require('websocket-stream');
var HttpsProxyAgent = require('https-proxy-agent');
const EventEmitter = require('events');
const fs = require('fs'); // Added fs for file operations

var identity = function () { };
var form = {};
var getSeqID = function () { };

var topics = [
    "/legacy_web",
    "/webrtc",
    "/rtc_multi",
    "/onevc",
    "/br_sr", 
    "/sr_res",
    "/t_ms",
    "/thread_typing",
    "/orca_typing_notifications",
    "/notify_disconnect",
    "/orca_presence",
    "/inbox",
    "/mercury",
    "/messaging_events",
    "/orca_message_notifications",
    "/pp",
    "/webrtc_response",
];

function listenMqtt(defaultFuncs, api, ctx, globalCallback) {
    var sessionID = Math.floor(Math.random() * 9007199254740991) + 1;
    var GUID = utils.getGUID();
    
    const username = {
        u: ctx.userID,
        s: sessionID,
        chat_on: ctx.globalOptions.online,
        fg: false,
        d: GUID,
        ct: 'websocket',
        aid: '219994525426954',
        mqtt_sid: '',
        cp: 3,
        ecp: 10,
        st: [],
        pm: [],
        dc: '',
        no_auto_fg: true,
        p: null,
        php_override: ""
    };

    var cookies = ctx.jar.getCookies("https://www.facebook.com").join("; ");

    var host;
    if (ctx.mqttEndpoint) host = `${ctx.mqttEndpoint}&sid=${sessionID}&cid=${GUID}`;
    else if (ctx.region) host = `wss://edge-chat.facebook.com/chat?region=${ctx.region.toLocaleLowerCase()}&sid=${sessionID}&cid=${GUID}`;
    else host = `wss://edge-chat.facebook.com/chat?sid=${sessionID}&cid=${GUID}`;

    const options = {
        clientId: 'mqttwsclient',
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        username: JSON.stringify(username),
        clean: true,
        wsOptions: {
            headers: {
                Cookie: cookies,
                Origin: 'https://www.facebook.com',
                'User-Agent': ctx.globalOptions.userAgent,
                Referer: 'https://www.facebook.com/',
                Host: new URL(host).hostname,
            },
            origin: 'https://www.facebook.com',
            protocolVersion: 13,
            binaryType: 'arraybuffer',
        },
        keepalive: 60,
        reschedulePings: true,
        reconnectPeriod: 3,
    };

    if (typeof ctx.globalOptions.proxy != "undefined") {
        var agent = new HttpsProxyAgent(ctx.globalOptions.proxy);
        options.wsOptions.agent = agent;
    }

    ctx.mqttClient = new mqtt.Client(_ => websocket(host, options.wsOptions), options);
    global.mqttClient = ctx.mqttClient; 

    ctx.mqttClient.on('error', function (err) {
        log.error("listenMqtt", err);
        ctx.mqttClient.end();
        if (ctx.globalOptions.autoReconnect) {
            getSeqID();
        } else {
            globalCallback({ type: "stop_listen", error: "Connection refused: Server unavailable" }, null);
        }
    });

    ctx.mqttClient.on('connect', function () {
        topics.forEach(topicsub => ctx.mqttClient.subscribe(topicsub));

        var topic;
        var queue = {
            sync_api_version: 10,
            max_deltas_able_to_process: 1000,
            delta_batch_size: 500,
            encoding: "JSON",
            entity_fbid: ctx.userID,
        };

        if (ctx.syncToken) {
            topic = "/messenger_sync_get_diffs";
            queue.last_seq_id = ctx.lastSeqId;
            queue.sync_token = ctx.syncToken;
        } else {
            topic = "/messenger_sync_create_queue";
            queue.initial_titan_sequence_id = ctx.lastSeqId;
            queue.device_params = null;
        }

        ctx.mqttClient.publish(topic, JSON.stringify(queue), { qos: 1, retain: false });

        var rTimeout = setTimeout(function () {
            ctx.mqttClient.end();
            getSeqID();
        }, 5000);

        ctx.tmsWait = function () {
            clearTimeout(rTimeout);
            ctx.globalOptions.emitReady ? globalCallback({
                type: "ready",
                error: null
            }) : "";
            delete ctx.tmsWait;
        };
    });

    ctx.mqttClient.on('message', function (topic, message, _packet) {
        try {
            var jsonMessage = JSON.parse(message);
        } catch (ex) {
            return log.error("listenMqtt", "JSON Parse Error: " + ex);
        }

        if (topic === "/t_ms") {
            if (ctx.tmsWait && typeof ctx.tmsWait == "function") ctx.tmsWait();

            if (jsonMessage.firstDeltaSeqId && jsonMessage.syncToken) {
                ctx.lastSeqId = jsonMessage.firstDeltaSeqId;
                ctx.syncToken = jsonMessage.syncToken;
            }

            if (jsonMessage.lastIssuedSeqId) ctx.lastSeqId = parseInt(jsonMessage.lastIssuedSeqId);

            for (var i in jsonMessage.deltas) {
                var delta = jsonMessage.deltas[i];
                parseDelta(defaultFuncs, api, ctx, globalCallback, { "delta": delta });
            }
        } else if (topic === "/thread_typing" || topic === "/orca_typing_notifications") {
            var typ = {
                type: "typ",
                isTyping: !!jsonMessage.state,
                from: jsonMessage.sender_fbid.toString(),
                threadID: utils.formatID((jsonMessage.thread || jsonMessage.sender_fbid).toString())
            };
            globalCallback(null, typ);
        } else if (topic === "/orca_presence" && ctx.globalOptions.updatePresence) {
            for (var i in jsonMessage.list) {
                var data = jsonMessage.list[i];
                var userID = data["u"];

                var presence = {
                    type: "presence",
                    userID: userID.toString(),
                    timestamp: data["l"] * 1000,
                    statuses: data["p"]
                };
                globalCallback(null, presence);
            }
        }
    });

    ctx.mqttClient.on('close', function () { });
}

function parseDelta(defaultFuncs, api, ctx, globalCallback, v) {
    if (v.delta.class == "NewMessage") {
        if (ctx.globalOptions.pageID && ctx.globalOptions.pageID != v.queue) return;

        (function resolveAttachmentUrl(i) {
            if (i == (v.delta.attachments || []).length) {
                let fmtMsg;
                try {
                    fmtMsg = utils.formatDeltaMessage(v);
                } catch (err) {
                    return globalCallback({
                        error: "Problem parsing message object.",
                        detail: err,
                        res: v,
                        type: "parse_error"
                    });
                }
                if (fmtMsg) {
                    if (ctx.globalOptions.autoMarkDelivery) {
                        markDelivery(ctx, api, fmtMsg.threadID, fmtMsg.messageID);
                    }
                }
                return !ctx.globalOptions.selfListen &&
                    (fmtMsg.senderID === ctx.i_userID || fmtMsg.senderID === ctx.userID) ?
                    undefined :
                    (function () { globalCallback(null, fmtMsg); })();
            } else {
                if (v.delta.attachments[i].mercury.attach_type == "photo") {
                    api.resolvePhotoUrl(
                        v.delta.attachments[i].fbid,
                        (err, url) => {
                            if (!err) v.delta.attachments[i].mercury.metadata.url = url;
                            return resolveAttachmentUrl(i + 1);
                        }
                    );
                } else {
                    return resolveAttachmentUrl(i + 1);
                }
            }
        })(0);
    }

    if (v.delta.class == "ClientPayload") {
        var clientPayload = utils.decodeClientPayload(v.delta.payload);
        if (clientPayload && clientPayload.deltas) {
            for (var i in clientPayload.deltas) {
                var delta = clientPayload.deltas[i];
                if (delta.deltaMessageReaction && !!ctx.globalOptions.listenEvents) {
                    globalCallback(null, {
                        type: "message_reaction",
                        threadID: (delta.deltaMessageReaction.threadKey.threadFbId ? delta.deltaMessageReaction.threadKey.threadFbId : delta.deltaMessageReaction.threadKey.otherUserFbId).toString(),
                        messageID: delta.deltaMessageReaction.messageId,
                        reaction: delta.deltaMessageReaction.reaction,
                        senderID: delta.deltaMessageReaction.senderId.toString(),
                        userID: delta.deltaMessageReaction.userId.toString()
                    });
                } else if (delta.deltaRecallMessageData && !!ctx.globalOptions.listenEvents) {
                    globalCallback(null, {
                        type: "message_unsend",
                        threadID: (delta.deltaRecallMessageData.threadKey.threadFbId ? delta.deltaRecallMessageData.threadKey.threadFbId : delta.deltaRecallMessageData.threadKey.otherUserFbId).toString(),
                        messageID: delta.deltaRecallMessageData.messageID,
                        senderID: delta.deltaRecallMessageData.senderID.toString(),
                        deletionTimestamp: delta.deltaRecallMessageData.deletionTimestamp,
                        timestamp: delta.deltaRecallMessageData.timestamp
                    });
                } else if (delta.deltaMessageReply) {
                    var mdata = delta.deltaMessageReply.message === undefined ? [] :
                        delta.deltaMessageReply.message.data === undefined ? [] :
                            delta.deltaMessageReply.message.data.prng === undefined ? [] :
                                JSON.parse(delta.deltaMessageReply.message.data.prng);
                    var m_id = mdata.map(u => u.i);
                    var m_offset = mdata.map(u => u.o);
                    var m_length = mdata.map(u => u.l);

                    var mentions = {};

                    for (var i = 0; i < m_id.length; i++) mentions[m_id[i]] = (delta.deltaMessageReply.message.body || "").substring(m_offset[i], m_offset[i] + m_length[i]);

                    var callbackToReturn = {
                        type: "message_reply",
                        threadID: (delta.deltaMessageReply.message.messageMetadata.threadKey.threadFbId ? delta.deltaMessageReply.message.messageMetadata.threadKey.threadFbId : delta.deltaMessageReply.message.messageMetadata.threadKey.otherUserFbId).toString(),
                        messageID: delta.deltaMessageReply.message.messageMetadata.messageId,
                        senderID: delta.deltaMessageReply.message.messageMetadata.actorFbId.toString(),
                        attachments: (delta.deltaMessageReply.message.attachments || []).map(function (att) {
                            var mercury = JSON.parse(att.mercuryJSON);
                            Object.assign(att, mercury);
                            return att;
                        }).map(att => {
                            var x;
                            try { x = utils._formatAttachment(att); }
                            catch (ex) { x = att; x.error = ex; x.type = "unknown"; }
                            return x;
                        }),
                        args: (delta.deltaMessageReply.message.body || "").trim().split(/\s+/),
                        body: (delta.deltaMessageReply.message.body || ""),
                        isGroup: !!delta.deltaMessageReply.message.messageMetadata.threadKey.threadFbId,
                        mentions: mentions,
                        timestamp: delta.deltaMessageReply.message.messageMetadata.timestamp,
                        participantIDs: (delta.deltaMessageReply.message.messageMetadata.cid.canonicalParticipantFbids || delta.deltaMessageReply.message.participants || []).map(e => e.toString())
                    };

                    if (delta.deltaMessageReply.repliedToMessage) {
                        mdata = delta.deltaMessageReply.repliedToMessage === undefined ? [] :
                            delta.deltaMessageReply.repliedToMessage.data === undefined ? [] :
                                delta.deltaMessageReply.repliedToMessage.data.prng === undefined ? [] :
                                    JSON.parse(delta.deltaMessageReply.repliedToMessage.data.prng);
                        m_id = mdata.map(u => u.i);
                        m_offset = mdata.map(u => u.o);
                        m_length = mdata.map(u => u.l);

                        var rmentions = {};
                        for (var i = 0; i < m_id.length; i++) rmentions[m_id[i]] = (delta.deltaMessageReply.repliedToMessage.body || "").substring(m_offset[i], m_offset[i] + m_length[i]);

                        callbackToReturn.messageReply = {
                            threadID: (delta.deltaMessageReply.repliedToMessage.messageMetadata.threadKey.threadFbId ? delta.deltaMessageReply.repliedToMessage.messageMetadata.threadKey.threadFbId : delta.deltaMessageReply.repliedToMessage.messageMetadata.threadKey.otherUserFbId).toString(),
                            messageID: delta.deltaMessageReply.repliedToMessage.messageMetadata.messageId,
                            senderID: delta.deltaMessageReply.repliedToMessage.messageMetadata.actorFbId.toString(),
                            attachments: delta.deltaMessageReply.repliedToMessage.attachments.map(function (att) {
                                var mercury = JSON.parse(att.mercuryJSON);
                                Object.assign(att, mercury);
                                return att;
                            }).map(att => {
                                var x;
                                try { x = utils._formatAttachment(att); }
                                catch (ex) { x = att; x.error = ex; x.type = "unknown"; }
                                return x;
                            }),
                            args: (delta.deltaMessageReply.repliedToMessage.body || "").trim().split(/\s+/),
                            body: delta.deltaMessageReply.repliedToMessage.body || "",
                            isGroup: !!delta.deltaMessageReply.repliedToMessage.messageMetadata.threadKey.threadFbId,
                            mentions: rmentions,
                            timestamp: delta.deltaMessageReply.repliedToMessage.messageMetadata.timestamp
                        };
                    } 
                    
                    if (ctx.globalOptions.autoMarkDelivery) markDelivery(ctx, api, callbackToReturn.threadID, callbackToReturn.messageID);
                    !ctx.globalOptions.selfListen && callbackToReturn.senderID === ctx.userID ? undefined : globalCallback(null, callbackToReturn);
                }
            }
            return;
        }
    }

    if (v.delta.class !== "NewMessage" && !ctx.globalOptions.listenEvents) return;
    
    switch (v.delta.class) {
        case "JoinableMode":
        case "AdminTextMessage":
        case "ThreadName":
        case "ParticipantsAddedToGroupThread":
        case "ParticipantLeftGroupThread":
            var formattedEvent;
            try {
                formattedEvent = utils.formatDeltaEvent(v.delta);
            } catch (err) {
                return globalCallback({
                    error: "Problem parsing event object.",
                    detail: err,
                    res: v.delta,
                    type: "parse_error"
                });
            }
            return (!ctx.globalOptions.selfListen && formattedEvent.author.toString() === ctx.userID) ? undefined : globalCallback(null, formattedEvent);
    }
}

function markDelivery(ctx, api, threadID, messageID) {
    if (threadID && messageID) {
        api.markAsDelivered(threadID, messageID, (err) => {
            if (err) log.error("markAsDelivered", err);
            else {
                if (ctx.globalOptions.autoMarkRead) {
                    api.markAsRead(threadID, (err) => {
                        if (err) log.error("markAsRead", err);
                    });
                }
            }
        });
    }
}

module.exports = function (defaultFuncs, api, ctx) {
    let globalCallback = identity;

    getSeqID = function getSeqID() {
        ctx.t_mqttCalled = false;
        defaultFuncs
            .post("https://www.facebook.com/api/graphqlbatch/", ctx.jar, form)
            .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
            .then((resData) => {
                if (utils.getType(resData) != "Array") throw { error: "Not logged in", res: resData };
                if (resData && resData[resData.length - 1].error_results > 0) throw resData[0].o0.errors;
                if (resData[resData.length - 1].successful_results === 0) throw { error: "getSeqId: there was no successful_results", res: resData };
                
                if (resData[0].o0.data.viewer.message_threads.sync_sequence_id) {
                    ctx.lastSeqId = resData[0].o0.data.viewer.message_threads.sync_sequence_id;
                    listenMqtt(defaultFuncs, api, ctx, globalCallback);
                } else throw { error: "getSeqId: no sync_sequence_id found.", res: resData };
            })
            .catch((err) => {
                log.error("getSeqId", err);
                
                // 🟢 FIX: Detect "Not Logged In" and Trigger Auto-Recovery
                if (utils.getType(err) == "Object" && (err.error === "Not logged in" || err.error === "Not logged in.")) {
                    ctx.loggedIn = false;
                    log.warn("getSeqID", "Session Invalidated (Error 1357004). Clearing cookies and Triggering Auto-Recovery...");

                    // 1. Clear Cookie Files to force fresh login next time
                    try {
                        if (global.client && global.client.dirAccount) {
                            fs.writeFileSync(global.client.dirAccount, ""); // Wipe account.txt
                            log.info("getSeqID", "Cleared account.txt");
                        }
                        if (fs.existsSync("appstate.json")) {
                            fs.unlinkSync("appstate.json"); // Delete appstate.json
                            log.info("getSeqID", "Deleted appstate.json");
                        }
                    } catch(e) {
                        log.error("getSeqID", "Failed to clear cookies: " + e.message);
                    }

                    // 2. Call reLoginBot if available
                    if (global.GoatBot && typeof global.GoatBot.reLoginBot === 'function') {
                        log.info("getSeqID", "Calling reLoginBot() for fresh login...");
                        setTimeout(() => global.GoatBot.reLoginBot(), 2000);
                    } else {
                        log.error("getSeqID", "reLoginBot function not found. Exiting to force restart...");
                        process.exit(1);
                    }
                    return;
                }
                return globalCallback(err);
            });
    };

    return function (callback) {
        class MessageEmitter extends EventEmitter {
            stopListening(callback) {
                callback = callback || (() => { });
                globalCallback = identity;
                if (ctx.mqttClient) {
                    ctx.mqttClient.unsubscribe("/webrtc");
                    ctx.mqttClient.unsubscribe("/rtc_multi");
                    ctx.mqttClient.unsubscribe("/onevc");
                    ctx.mqttClient.publish("/browser_close", "{}");
                    ctx.mqttClient.end(false, function (...data) {
                        callback(data);
                        ctx.mqttClient = undefined;
                    });
                }
            }
        }

        const msgEmitter = new MessageEmitter();
        globalCallback = (callback || function (error, message) {
            if (error) return msgEmitter.emit("error", error);
            msgEmitter.emit("message", message);
        });

        if (!ctx.firstListen) ctx.lastSeqId = null;
        ctx.syncToken = undefined;
        ctx.t_mqttCalled = false;

        form = {
            "av": ctx.globalOptions.pageID,
            "queries": JSON.stringify({
                "o0": {
                    "doc_id": "3336396659757871",
                    "query_params": {
                        "limit": 1,
                        "before": null,
                        "tags": ["INBOX"],
                        "includeDeliveryReceipts": false,
                        "includeSeqID": true
                    }
                }
            })
        };

        if (!ctx.firstListen || !ctx.lastSeqId) {
            getSeqID();
        } else {
            listenMqtt(defaultFuncs, api, ctx, globalCallback);
        }
        ctx.firstListen = false;
        return msgEmitter;
    };
};
