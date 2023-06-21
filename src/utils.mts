import { existsSync, readFileSync } from 'fs';
import { WeaviateClient } from 'weaviate-ts-client';
import { Configuration } from './configuration.mjs';

/** Sleep for msec time */
export const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));

/** Simple function to wait until weaviate is ready again */
export const waitUntilWeaviateIsReady = async (
  client: WeaviateClient,
  waitInMsec = 5000
) => {
  let ready = false;
  do {
    try {
      ready = await client.misc.readyChecker().do();
    } catch (err: any) {
      console.warn(err);
    }
    if (!ready) {
      console.log('Waiting for weaviate...');
      await sleep(waitInMsec);
    }
  } while (!ready);
};

/** Parse the configuration and do some basic validation. */
export const parseConfiguration = (filename: string) => {
  if (!existsSync(filename)) {
    console.error(`error: filename does not exist: ${filename}.`);
    process.exit(1);
  }

  try {
    const configFile = readFileSync(filename);
    const config = JSON.parse(configFile.toString()) as Configuration;
    if (!config.updates) {
      console.error('error: missing property "{ "updates": [...] }".');
      process.exit(1);
    }
    if (
      config.client &&
      config.client.host &&
      config.client.scheme &&
      config.client.host.startsWith('http')
    ) {
      console.error('error: client.host should not include the scheme.');
      process.exit(1);
    }
    console.log(JSON.stringify(config));
    return config;
  } catch (e: any) {
    console.error(e);
    process.exit(1);
  }
};
