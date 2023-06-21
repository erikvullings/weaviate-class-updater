import { ConnectionParams, Property } from 'weaviate-ts-client';

/** Configuration file */
export type Configuration = {
  /** Optional client properties, may also be processed from the environment */
  client?: ConnectionParams;
  updates: [
    {
      className: string;
      properties: Property[];
    }
  ];
};
