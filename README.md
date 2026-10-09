<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# Gastronomies - Web component

[![REUSE Compliance](https://github.com/noi-techpark/webcomp-gastronomies/actions/workflows/reuse.yml/badge.svg)](https://github.com/noi-techpark/odh-docs/wiki/REUSE#badges)
[![REUSE status](https://api.reuse.software/badge/github.com/noi-techpark/webcomp-gastronomies)](https://api.reuse.software/info/github.com/noi-techpark/webcomp-gastronomies)
[![CI/CD](https://github.com/noi-techpark/webcomp-gastronomies/actions/workflows/main.yml/badge.svg)](https://github.com/noi-techpark/webcomp-gastronomies/actions/workflows/main.yml)

A web component that shows the gastronomies stored in the Open Data Hub.

The map is rendered from clustered vector tiles of the [Open Data Hub Geo Api](https://geo.api.opendatahub.com/swagger/index.html).
The [Open Data Hub Tourism Api](https://tourism.api.opendatahub.com/swagger/index.html) is only called to load the details of a selected gastronomy (and for the optional list modality / search).

Do you want to see it in action? Go to our [web component store](https://webcomponents.opendatahub.com/webcomponent/f113a6c6-445f-4633-a901-b8004353c903).

- [Gastronomies - Web component](#gastronomies---web-component)
  - [Usage](#usage)
    - [Attributes](#attributes)
  - [How it works](#how-it-works)
  - [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Source code](#source-code)
    - [.env](#env)
    - [Dependencies](#dependencies)
    - [Build](#build)
  - [Docker environment](#docker-environment)
  - [Information](#information)

## Usage

Include the webcomponent script file `dist/odh-gastronomies.js` in your HTML and define the web component like this:

```html
<odh-gastronomies
    width="100%"
    height="500px"
    fontFamily="Arial"
    language="it"
    currentLocation='{ "lat": 46.31, "lng": 11.26 }'
    modality="map"
    source="lts">
</odh-gastronomies>
```

### Attributes

#### width

Give a fixed width to the component. Works only from desktop up. You can use `px` or `%` as unit size.

Examples: `width="100%"`

#### height

Give a fixed height to the component. Works only from desktop up. You can use `px` or `%` as unit size.

Example: `height="500px"`

#### fontFamily

Set the typeface.

Example: `"Arial"`

#### language

Set the default and starting language.

Example: `"en" or "de" or "it"`

#### currentLocation

Set the starting point position on the map.

Example: `'{ "lat": 46.31, "lng": 11.26 }'`

#### modality

Set the default and starting value for the modality of the widget.

Example: `"list" or "map"`

#### source

Only show gastronomies of these sources. Empty shows all sources.

Type: string  
Options: `"lts"` (currently the only available source)  
Default: `"lts"`

#### pageSize

Page size for the list modality. Default value is `10`.

Example: `"5"`

#### filterRadius

The radius expressed in kilometers drawn around the current location on the map. Default value is `0`.

Example: `"5"`

#### disableGastronomyDirections

If set the road directions are hidden.

#### categoriesFilter

If set, the list modality filters gastronomies by the bitmask values in the array (Tourism Api).

Example: `"[512,8]"`

#### mapAttribution

Optional extra attribution text for the map (HTML without double-quotes). Open Data Hub attribution is always included.

### Configuration

The api endpoints are configured at build time with a `.env` file (see `.env.example`):

| Variable | Default |
|---|---|
| `TOURISM_BASE_PATH` | `https://tourism.api.opendatahub.com/v1` |
| `GEO_BASE_PATH` | `https://geo.api.opendatahub.com` |
| `BASEMAP_STYLE_URL` | `https://tiles.openfreemap.org/styles/positron` |

## How it works

```
                 vector tiles (.pbf, clustered)
  Geo Api  ─────────────────────────────────────▶  map: clusters + points
                                                        │ click on a point
  Tourism Api  ◀── GET /ODHActivityPoi/{id} ────────────┘
               ───▶ detail panel
```

### Vector tiles from the Geo Api

Gastronomies on the map are no longer downloaded as a full REST list. [MapLibre GL](https://maplibre.org/) requests
[Mapbox Vector Tiles](https://github.com/mapbox/vector-tile-spec) for the visible part of the map only:

```
GET {GEO_BASE_PATH}/api/tiles/odhactivitypoi/{z}/{x}/{y}.pbf?operationmode=points&enableclustering=true&tagfilter=eating%20drinking&source={source}
```

| Parameter | Value |
|---|---|
| `type` (path) | `odhactivitypoi` |
| `operationmode` | `points` |
| `enableclustering` | `true` — the Geo Api clusters points server-side up to zoom level 16 |
| `tagfilter` | `eating drinking` (see [Geo gastronomies example](https://geo.api.opendatahub.com/examples/activitiespois/gastronomies.html)) |
| `source` | value of the `source` attribute, omitted when empty |

### Details from the Tourism Api

The Tourism Api is called when a gastronomy is clicked:

```
GET {TOURISM_BASE_PATH}/ODHActivityPoi/{id}?removenullvalues=true&origin=webcomp-gastronomies
```

The Geo Api may serve the open data copy of a record with an Id ending in `_REDUCED`.
That suffix is removed before calling the Tourism Api.

### Search

The search bar uses `GET /ODHActivityPoi?searchfilter=…&tagfilter=gastronomy` on the Tourism Api.
`searchfilter` matches the query against Detail texts (e.g. Title) of active gastronomy POIs.
Selecting a result flies the map to that location. Map markers themselves always come from Geo tiles.

The deprecated `tourism.opendatahub.com/api/Poi` endpoint is no longer used.

### List modality

The optional list modality still uses the paginated Tourism Api
(`GET /ODHActivityPoi?tagfilter=gastronomy&…`) so category / facility bitmasks keep working.
Map markers are independent and come from the Geo Api.

### Basemap

The basemap is the [OpenFreeMap](https://openfreemap.org/) Positron vector style (no api key required),
configurable with `BASEMAP_STYLE_URL`.

## Getting started

These instructions will get you a copy of the project up and running
on your local machine for development and testing purposes.

### Prerequisites

To build the project, the following prerequisites must be met:

- Node 20.19 or newer / NPM 10 (see `.nvmrc`)

For a ready to use Docker environment with all prerequisites already installed
and prepared, you can check out the [Docker environment](#docker-environment)
section.

### Source code

Get a copy of the repository:

```bash
git clone git@github.com:noi-techpark/webcomp-gastronomies.git
```

Change directory:

```bash
cd webcomp-gastronomies/
```

### .env

Create a `.env` file in the main directory (see `.env.example`):

```
TOURISM_BASE_PATH="https://tourism.api.opendatahub.testingmachine.eu/v1"
GEO_BASE_PATH="https://geo.api.opendatahub.testingmachine.eu"
BASEMAP_STYLE_URL="https://tiles.openfreemap.org/styles/positron"
HEREMAPS_API_KEY=
```

`HEREMAPS_API_KEY` is optional and only used as a fallback when the Tourism search returns no results.

### Dependencies

Download all dependencies:

```bash
npm install
```

### Build

Build and start the project:

```bash
npm run start
```

The application will be served and can be accessed at [http://localhost:8989](http://localhost:8989).

## Deployment

To create the distributable files, execute the following command:

```bash
npm run build
```

## Docker environment

For the project a Docker environment is already prepared and ready to use with all necessary prerequisites.

These Docker containers are the same as used by the continuous integration servers.

### Installation

Install [Docker](https://docs.docker.com/install/) (with Docker Compose) locally on your machine.

### Dependencies

First, install all dependencies:

```bash
docker-compose run --rm app /bin/bash -c "npm install"
```

### Start and stop the containers

Before start working you have to start the Docker containers:

```
docker-compose up --build --detach
```

After finished working you can stop the Docker containers:

```
docker-compose stop
```

### Running commands inside the container

When the containers are running, you can execute any command inside the environment. Just replace the dots `...` in the following example with the command you wish to execute:

```bash
docker-compose run --rm app /bin/bash -c "..."
```

Some examples are:

```bash
docker-compose run --rm app /bin/bash -c "npm run start"
```

## Information

### Support

For support, please contact [help@opendatahub.com](mailto:help@opendatahub.com).

### Contributing

If you'd like to contribute, please follow the following instructions:

- Fork the repository.

- Checkout a topic branch from the `development` branch.

- Make sure the tests are passing.

- Create a pull request against the `development` branch.

A more detailed description can be found here: [https://github.com/noi-techpark/documentation/blob/master/contributors.md](https://github.com/noi-techpark/documentation/blob/master/contributors.md).

### Documentation

More documentation can be found at [https://opendatahub.readthedocs.io/en/latest/index.html](https://opendatahub.readthedocs.io/en/latest/index.html).

### Boilerplate

The project uses this boilerplate: [https://github.com/noi-techpark/webcomp-boilerplate](https://github.com/noi-techpark/webcomp-boilerplate).

### License

The code in this project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3 license. See the [LICENSE.md](LICENSE.md) file for more information.

### REUSE

This project is [REUSE](https://reuse.software) compliant, more information about the usage of REUSE in NOI Techpark repositories can be found [here](https://github.com/noi-techpark/odh-docs/wiki/Guidelines-for-developers-and-licenses#guidelines-for-contributors-and-new-developers).

Since the CI for this project checks for REUSE compliance you might find it useful to use a pre-commit hook checking for REUSE compliance locally. The [pre-commit-config](.pre-commit-config.yaml) file in the repository root is already configured to check for REUSE compliance with help of the [pre-commit](https://pre-commit.com) tool.

Install the tool by running:
```bash
pip install pre-commit
```
Then install the pre-commit hook via the config file by running:
```bash
pre-commit install
```
