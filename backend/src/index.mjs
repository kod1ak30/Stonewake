import { createService } from "./service.mjs";
import {
  verifyAppleIdentity,
  verifyTransaction,
  verifyNotification,
} from "./apple.mjs";
export default createService({
  verifyAppleIdentity,
  verifyTransaction,
  verifyNotification,
});
