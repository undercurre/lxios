import CancelToken from "./cancel/CancelToken";
import Cancel, { isCancel } from "./cancel/Cancel";
import defaults from "./defaults";
import Lxios from "./helpers/lxois";
import { extend, mergeConfig } from "./helpers/util";

function createInstance(config: LxiosRequestConfig): LxiosStatic {
  const context = new Lxios(config);
  const instance = Lxios.prototype.request.bind(context);

  extend(instance, context);

  (instance as LxiosStatic).create = function create(
    config: LxiosRequestConfig | undefined
  ) {
    return createInstance(mergeConfig(defaults, config));
  };

  return instance as LxiosStatic;
}

const lxios = createInstance(defaults);

lxios.Cancel = Cancel;
lxios.CancelToken = CancelToken;
lxios.isCancel = isCancel;

export default lxios;
