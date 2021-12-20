import { Updater } from './src/Updater';
import { injector } from './src/injector';

const updater = injector.injectClass(Updater);

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
