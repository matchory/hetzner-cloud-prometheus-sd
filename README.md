Prometheus: Hetzner Service Discovery ![Current Release](https://img.shields.io/npm/v/@matchory/hetzner-cloud-prometheus-sd/latest) ![License](https://img.shields.io/npm/l/@matchory/hetzner-cloud-prometheus-sd) [![Build](https://github.com/matchory/hetzner-cloud-prometheus-sd/actions/workflows/main.yaml/badge.svg)](https://github.com/matchory/hetzner-cloud-prometheus-sd/actions/workflows/main.yaml) ![Weekly Downloads](https://img.shields.io/npm/dw/@matchory/hetzner-cloud-prometheus-sd) ![Docker Build Status](https://img.shields.io/docker/cloud/build/matchory/hetzner-cloud-prometheus-sd)
=====================================
> A server to provide automatic node discovery for Hetzner Cloud to Prometheus via HTTP service discovery.

In contrary to the integrated Hetzner SD configuration, this lets you use internal IPs and filter the node list using
Hetzner labels or node filters, for example.

Installation
------------
The easiest option will be using our Docker image
[`matchory/hetzner-cloud-prometheus-sd`](https://hub.docker.com/matchory/hetzner-cloud-prometheus-sd):

```bash
docker run -p 127.0.0.1:7764:7764 matchory/hetzner-cloud-prometheus-sd --hetzner-api-token $HETZNER_API_TOKEN
```

You can also install the npm package globally:

```bash
npx @matchory/hetzner-cloud-prometheus-sd --hetzner-api-token $HETZNER_API_TOKEN
```

Usage
-----
Upon starting the server, it will continuously synchronize its list of Hetzner cloud nodes with the Hetzner API, and
return those to requests on the `/sd` endpoint. Additionally, the server also provides its own metrics endpoint.

Configuration
-------------
The server may be configured using command-line options, environment variables, or its configuration file. The following
table shows all available settings:

| CLI option                 | Environment variable           | Default value | Description                                                                                                              |
|:---------------------------|:-------------------------------|---------------|--------------------------------------------------------------------------------------------------------------------------|
| `-t`, `--api-token`        | `HETZNER_SD_API_TOKEN`         | -             | API token obtained from Hetzner Cloud (**required**).                                                                    |
| `-h`, `--hostname`         | `HETZNER_SD_HOSTNAME`          | `localhost`   | Hostname to listen on.                                                                                                   |
| `-a`, `--auth-bearer`      | `HETZNER_SD_AUTH_BEARER`       | -             | Bearer token to verify on incoming requests. Mutually exclusive with `--auth-basic`.                                     |
| `-A`, `--auth-basic`       | `HETZNER_SD_AUTH_BASIC`        | -             | Basic auth credentials to verify on incoming requests, provided as `user:pass`. Mutually exclusive with `--auth-bearer`. |
| `-p`, `--port`             | `HETZNER_SD_PORT`              | `7764`        | Port to listen on.                                                                                                       |
| `-H`, `--https`            | `HETZNER_SD_HTTPS`             | _false_       | Use HTTPS for the listening socket. Required for mTLS.                                                                   |
| `--m-tls-ca`               | `HETZNER_SD_MTLS_CA`           | -             | Path to the mTLS certificate authority file. Ignored unless https is enabled.                                            |
| `-r`, `--refresh-interval` | `HETZNER_SD_REFRESH_INTERVAL`  | `30000` (30s) | How often to synchronize with the Hetzner API in ms.                                                                     |
| `--metrics-endpoint`       | `HETZNER_SD_METRICS_ENDPOINT`  | `/metrics`    | Endpoint to provide server metrics on.                                                                                   |
| `--node-port`              | `HETZNER_SD_NODE_PORT`         | `9090`        | Port _on the nodes_ Prometheus should connect to.                                                                        |
| `--node-network`           | `HETZNER_SD_NODE_NETWORK`      | -             | Name, ID, or CIDR range of the network to prefer when resolving nodes. If omitted, the public IP will be preferred.      |
| `--node-label-prefix`      | `HETZNER_SD_NODE_LABEL_PREFIX` | `hetzner`     | Prefix for labels attached to discovered nodes-                                                                          |
| `--log-level`              | `HETZNER_SD_LOG_LEVEL`         | `debug`       | Log level for the server (must be one of `debug`, `info`, `warn` or `error`).                                            |
| `--debug`                  | `HETZNER_SD_DEBUG`             | _false_       | Enable debug mode. This will also include additional debugging information in HTTP responses.                            |

> **Note:**  
> You can provide token parameters in secret files using the environment variables with a `_FILE` suffix, e.g. 
> `HETZNER_SD_API_TOKEN_FILE`. This variable is expected to contain an absolute path to a file on the filesystem which
> contains the secret. Trailing whitespace will be removed; the secret will be read once, and cached for the runtime of
> the server. This works for the API token and authentication credentials, so currently we support the following 
> secret files:
>  - `HETZNER_SD_API_TOKEN_FILE`
>  - `HETZNER_SD_AUTH_BEARER_FILE`
>  - `HETZNER_SD_AUTH_BASIC_FILE`

Development
-----------
For local development, you'll want to use `yarn dev` to compile the TypeScript sources and start the server.

### Contributing
We welcome all contributions. If you need help or would like to see a feature implemented, please get in touch.

### Releasing
To publish a new release, use the [`np`](https://github.com/sindresorhus/np) utility on the command line.
