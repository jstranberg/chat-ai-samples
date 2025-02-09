const StreamChat = require('stream-chat').StreamChat;

// Replace these with your actual values
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const userId = 'anakin_skywalker';

const serverClient = StreamChat.getInstance(apiKey, apiSecret);
const token = serverClient.createToken(userId);

console.log('User Token:', token);
