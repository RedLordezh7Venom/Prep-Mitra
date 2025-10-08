import Hyperswarm from 'hyperswarm';
import Hyperdrive from 'hyperdrive';
import Localdrive from 'localdrive';
import Corestore from 'corestore';
import debounce from 'debounceify';
import b4a from 'b4a';
import stdio from 'pear-stdio';

const store = new Corestore(Pear.config.storage);
const swarm = new Hyperswarm();
Pear.teardown(() => swarm.destroy());

swarm.on('connection', conn => store.replicate(conn));

const local = new Localdrive('./writer-dir');
const drive = new Hyperdrive(store);

await drive.ready();

const mirror = debounce(mirrorDrive);

const discovery = swarm.join(drive.discoveryKey);
await discovery.flushed();

console.log('Drive key:', b4a.toString(drive.key, 'hex'));

stdio.in.setEncoding('utf-8');
stdio.in.on('data', (data) => {
  if (!data.match('\n')) return;
  mirror();
});

async function mirrorDrive() {
  console.log('Mirroring changes from ./writer-dir into the drive...');
  const mirror = local.mirror(drive);
  await mirror.done();
  console.log('Finished mirroring:', mirror.count);
}