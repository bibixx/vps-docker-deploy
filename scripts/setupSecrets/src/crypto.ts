import sodium from "libsodium-wrappers";
import { exec } from "child_process";

export const encryptSecret = async (secret: string, key: string) => {
  await sodium.ready;

  let binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL);
  let binsec = sodium.from_string(secret);

  let encBytes = sodium.crypto_box_seal(binsec, binkey);
  let output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
  return output;
};

export const getSSHKey = () =>
  new Promise<string>((resolve, reject) => {
    exec(
      `op item get ${process.env.ONE_PASSWORD_KEY_ID} --fields label='private key'`,
      (error, stdout, stderr) => {
        if (error) {
          return reject(new Error(error.message));
        }

        if (stderr) {
          return reject(new Error(stderr));
        }

        resolve(stdout.slice(1, stdout.length - 2));
      }
    );
  });
