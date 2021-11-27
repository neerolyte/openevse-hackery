require('dotenv').config();

const config = {
  openevse: {
    url: process.env.OPENEVSE_URL,
    ampsMin: parseInt(process.env.OPENEVSE_AMPS_MIN),
    ampsMax: parseInt(process.env.OPENEVSE_AMPS_MAX),
  },
  selectlive: {
    url: process.env.SELECTLIVE_URL,
    device: process.env.SELECTLIVE_DEVICE,
  }
};

export { config };
