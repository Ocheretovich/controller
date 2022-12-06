import { split } from "@cartridge/controller";
import { ec, Provider } from "starknet";
import { encodeShortString } from "starknet/dist/utils/shortString";
import {
  calculateContractAddressFromHash,
  getSelectorFromName,
} from "starknet/dist/utils/hash";
import { toBN } from "starknet/dist/utils/number";
import Controller from "utils/controller";
import { ACCOUNT_CLASS, CONTROLLER_CLASS, PROXY_CLASS } from "utils/constants";

const register =
  () => async (username: string, credentialId: string, credential: { x: string; y: string }) => {
    const keypair = ec.genKeyPair();
    const deviceKey = ec.getStarkKey(keypair);

    const { x: x0, y: x1, z: x2 } = split(toBN(credential.x));
    const { x: y0, y: y1, z: y2 } = split(toBN(credential.y));

    const address = calculateContractAddressFromHash(
      encodeShortString(username),
      toBN(PROXY_CLASS),
      [
        toBN(ACCOUNT_CLASS),
        getSelectorFromName("initialize"),
        "9",
        toBN(CONTROLLER_CLASS),
        "7",
        x0,
        x1,
        x2,
        y0,
        y1,
        y2,
        toBN(deviceKey),
      ],
      "0",
    );

    const controller = new Controller(keypair, address, credentialId);
    controller.store();

    return { address, deviceKey };
  };

export default register;
