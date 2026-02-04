'use strict';

import reanimatedJS from "../js-reanimated/index.js";
import { shouldBeUseWeb } from "../PlatformChecker.js";
import { NativeReanimated } from "./NativeReanimated.js";
export default shouldBeUseWeb() ? reanimatedJS : new NativeReanimated();
//# sourceMappingURL=index.js.map