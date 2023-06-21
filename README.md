# weaviate-class-updater

Update a database class in Weaviate.

## Usage

```bash
weaviate-class-updater
```

Alternatively, provide a config file.

```bash
weaviate-class-updater -f ./data/config.json
```

## Environment variables

Instead of using the `client` properties in the configuration file, you can alternatively specify them using environment variables.

| Variable                    | Default value    |
| --------------------------- | ---------------- |
| WEAVIATE_HOST               | 'localhost:8888' |
| WEAVIATE_SCHEME             | 'http'           |
| WEAVIATE_AUTH_CLIENT_SECRET |                  |
| WEAVIATE_API_KEY            |                  |
| WEAVIATE_HEADERS            |                  |

## Configuration file format

Example configuration file to add two properties to the `Article` schema, `authors` and `sentiment`. Note that the `client` is optional, and can also be provided via environment variables or left blank to use the defaults.

```json
{
  "client": {
    "authClientSecret": "",
    "apiKey": "",
    "host": "localhost:8888",
    "scheme": "http",
    "headers": ""
  },
  "updates": [
    {
      "className": "Article",
      "properties": [
        {
          "dataType": ["text[]"],
          "description": "Authors of the article, if any",
          "name": "authors",
          "indexInverted": true
        },
        {
          "dataType": ["number"],
          "description": "Sentiment of the article",
          "name": "sentiment",
          "indexInverted": true
        }
      ]
    }
  ]
}
```

## Development

```bash
git clone https://github.com/erikvullings/weaviate-class-updater
npm i
npm start
```
