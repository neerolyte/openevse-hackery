import { OpenevseClient } from './src/OpenevseClient';
import { SelectliveClient } from './src/SelectliveClient';
import { config } from './src/config';
import { Updater } from './src/Updater';

const selectliveClient = new SelectliveClient(config.selectlive);
const openevseClient = new OpenevseClient(config.openevse);
const updater = new Updater(selectliveClient, openevseClient);

async function update() {
  console.log((new Date()).toISOString());
  let update = await updater.update();
  console.log(`Spare amps: ${update.spareAmps}`);
  console.log(`Measured amps: ${update.measuredAmps}`)
  console.log(`Target amps: ${update.oldTargetAmps} => ${update.newTargetAmps}`);
};

async function updateLoop() {
  try {
    await update();
  } catch (e) {
    console.log(e);
  }
  setTimeout(updateLoop, 10000);
}
updateLoop();
