require('dotenv').config();

const config: {
  openevse: {
    url: string,
    ampsMin: number,
    ampsMax: number,
  },
  selectlive: {
    url: string,
    device: string,
  }
} = {
  openevse: {
    url: process.env.OPENEVSE_URL ?? '',
    ampsMin: parseInt(process.env.OPENEVSE_AMPS_MIN ?? '0'),
    ampsMax: parseInt(process.env.OPENEVSE_AMPS_MAX ?? '0'),
  },
  selectlive: {
    url: process.env.SELECTLIVE_URL ?? '',
    device: process.env.SELECTLIVE_DEVICE ?? '',
  }
};

export { config };
