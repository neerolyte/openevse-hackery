import { OpenevseClient } from './src/OpenevseClient';
import { SelectliveClient } from './src/SelectliveClient';
import { config } from './src/config';

const selectliveClient = new SelectliveClient(config.selectlive);
const openevseClient = new OpenevseClient(config.openevse);

async function update() {
  console.log((new Date()).toISOString());
  let houseBatterySoc = await selectliveClient.getBatterySoc();
  let houseBatteryW = await selectliveClient.getBatteryW();
  let spareAmps = 0 - ( houseBatteryW / 240 );

  if (houseBatterySoc > 99.0) {
    console.log("Adding spare amps as house battery is full");
    spareAmps += 5;
  }

  let openevseTargetAmps = await openevseClient.getTargetAmps();
  let openevseMeasuredAmps = await openevseClient.getMeasuredAmps();
  let newTargetAmps = openevseClient.constrainAmps(spareAmps + openevseMeasuredAmps);

  // If the measured amps are low, always constrain to the minimum target to avoid harsh start ups
  if (openevseMeasuredAmps < config.openevse.ampsMin) {
    newTargetAmps = config.openevse.ampsMin;
  }

  console.log(`Spare amps: ${spareAmps}`);
  console.log(`Measured amps: ${openevseMeasuredAmps}`)
  console.log(`Target amps: ${openevseTargetAmps} => ${newTargetAmps}`);
  openevseClient.setTargetAmps(newTargetAmps);
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
