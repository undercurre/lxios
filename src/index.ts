import defaults from "./defaults";
import Lxios from "./helpers/lxois";
import { mergeConfig } from "./helpers/util";

function createInstance(config: LxiosRequestConfig): LxiosStatic {
  const context = new Lxios(config);
  const instance = Lxios.prototype.request.bind(context);

  // extend(instance, Axios.prototype, context)

  extend(instance, context);

  return instance as LxiosStatic;
}

lxios.create = function create(config: LxiosRequestConfig | undefined) {
  return createInstance(mergeConfig(defaults, config));
};

const axios = createInstance(defaults);
