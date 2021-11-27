const axios = require('axios').default;
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);
export { mock };
