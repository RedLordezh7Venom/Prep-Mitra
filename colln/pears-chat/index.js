import Hyperswarm from 'hyperswarm';
import b4a from 'b4a';
import crypto from 'hypercore-crypto';
import readline from 'bare-readline';
import tty from 'bare-tty';
import process from 'bare-process';

const swarm = new Hyperswarm();

// Function to create a new chat room
async function createChatRoom() {
  const topicBuffer = crypto.randomBytes(32);
  await joinSwarm(topicBuffer);
  const topic = b4a.toString(topicBuffer, 'hex');
  console.log(`[info] Created new chat room: ${topic}`);
}

// Function to join an existing chat room
async function joinChatRoom(topicStr) {
  const topicBuffer = b4a.from(topicStr, 'hex');
  await joinSwarm(topicBuffer);
  console.log(`[info] Joined chat room`);
}

// Function to join the swarm
async function joinSwarm(topicBuffer) {
  const discovery = swarm.join(topicBuffer, { client: true, server: true });
  await discovery.flushed();
}

// Function to send messages to all connected peers
function sendMessage(message) {
  const peers = [...swarm.connections];
  for (const peer of peers) peer.write(message);
}

// Function to append received messages to the terminal output
function appendMessage({ name, message }) {
  console.log(`[${name}] ${message}`);
}

// Set up event listeners for new connections and messages
swarm.on('connection', peer => {
  const name = b4a.toString(peer.remotePublicKey, 'hex').substr(0, 6);
  console.log(`[info] New peer joined, ${name}`);
  peer.on('data', message => appendMessage({ name, message }));
  peer.on('error', e => console.log(`Connection error: ${e}`));
});

// Handle user input to send messages
const rl = readline.createInterface({
  input: new tty.ReadStream(0),
  output: new tty.WriteStream(1)
});

rl.on('data', line => {
  sendMessage(line);
  rl.prompt();
});

rl.prompt();

// Determine whether to create or join a chat room based on command-line arguments
const key = process.argv[2];
if (!key) {
  await createChatRoom();
} else {
  await joinChatRoom(key);
}
