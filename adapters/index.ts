import httpAdapter from "./http.js";
import xhrAdapter from "./xhr.js";

const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
};

export default knownAdapters;
