import httpAdapter from "./http";
import xhrAdapter from "./xhr";

const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
};

export default knownAdapters;
