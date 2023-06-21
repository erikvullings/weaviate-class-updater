import { Command } from 'commander';
import weaviate, { ConnectionParams } from 'weaviate-ts-client';
import { parseConfiguration, waitUntilWeaviateIsReady } from './utils.mjs';
import { configDotenv } from 'dotenv';

configDotenv();

const DEFAULT_FILENAME = './data/config.json';

const DEFAULT_CLIENT = {
  host: process.env.WEAVIATE_HOST || 'localhost:8888',
  scheme: process.env.WEAVIATE_SCHEME || 'http',
  authClientSecret: process.env.WEAVIATE_AUTH_CLIENT_SECRET,
  apiKey: process.env.WEAVIATE_API_KEY,
  headers: process.env.WEAVIATE_HEADERS,
} as ConnectionParams;

type CommandOptions = {
  //** Input filename */
  filename: string;
};

const program = new Command();
program
  .name('weaviate-class-updater')
  .description('CLI to update a Weaviate class.')
  .version('0.0.1')
  .option(
    '-f, --filename <input-file>',
    `The configuration file to parse, default ${DEFAULT_FILENAME}`
  );
program.parse();

const options = program.opts() as CommandOptions;

const { filename = DEFAULT_FILENAME } = options;
const config = parseConfiguration(filename);
const weaviateClientOptions = Object.assign(
  {},
  DEFAULT_CLIENT,
  config.client
) as ConnectionParams;

const client = weaviate.client(weaviateClientOptions);
await waitUntilWeaviateIsReady(client);

for (const update of config.updates) {
  const { className, properties } = update;
  if (!className) {
    console.error(
      `error: classname does not exist: "{ "updates": [{ "className": "Article" }] }"..`
    );
    process.exit(1);
  }
  for (const property of properties) {
    const result = await client.schema
      .propertyCreator()
      .withClassName(className)
      .withProperty(property)
      .do()
      .catch((err: Error) => {
        console.warn(err);
      });
    result && console.info(JSON.stringify(result, null, 2));
  }
}
