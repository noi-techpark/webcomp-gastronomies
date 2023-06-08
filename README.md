<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# Gastronomies - Web component

![REUSE Compliance](https://github.com/noi-techpark/webcomp-gastronomies/actions/workflows/reuse.yml/badge.svg)
[![REUSE status](https://api.reuse.software/badge/github.com/noi-techpark/webcomp-gastronomies)](https://api.reuse.software/info/github.com/noi-techpark/webcomp-gastronomies)
[![CI/CD](https://github.com/noi-techpark/webcomp-gastronomies/actions/workflows/main.yml/badge.svg)](https://github.com/noi-techpark/webcomp-gastronomies/actions/workflows/main.yml)

A web component that shows the gastronomies stored in the Open Data Hub.

Do you want to see it in action? Go to our [web component store](https://webcomponents.opendatahub.bz.it/webcomponent/f113a6c6-445f-4633-a901-b8004353c903).

- [Gastronomies - Web component](#gastronomies---web-component)
  - [Usage](#usage)
    - [Attributes](#attributes)
      - [width](#width)
      - [height](#height)
      - [fontFamily](#fontfamily)
      - [language](#language)
      - [mapAttribution](#mapattribution)
      - [currentLocation](#currentlocation)
      - [tiles-url](#tiles-url)
      - [modality](#modality)
      - [pageSize](#pagesize)
      - [filterRadius](#filterradius)
      - [disableGastronomyDirections](#disablegastronomydirections)
      - [categoriesFilter](#categoriesfilter)
  - [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Source code](#source-code)
    - [.env](#env)
    - [Dependencies](#dependencies)
    - [Build](#build)
  - [Docker environment](#docker-environment)
    - [Installation](#installation)
    - [Dependenices](#dependenices)
    - [Start and stop the containers](#start-and-stop-the-containers)
    - [Running commands inside the container](#running-commands-inside-the-container)
  - [Information](#information)
    - [Support](#support)
    - [Contributing](#contributing)
    - [Documentation](#documentation)
    - [Boilerplate](#boilerplate)
    - [License](#license)

## Usage

Include the webcompscript file `dist/odh-gastronomiesjs` in your HTML and define the web component like this:

```html
<odh-gastronomies
    width="100%"
    height="500px"
    fontFamily="Arial"
    language="it"
    mapAttribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    currentLocation='{ "lat": 46.31, "lng": 11.26 }'
    tiles-url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    modality="list"
    pageSize="5"
    disableGastronomyDirections>
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

#### mapAttribution

Set the acknowledgement for the map tiles provider.

Example: `'&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'`

#### currentLocation

Set the starting point position on the map.

Example: `'{ "lat": 46.31, "lng": 11.26 }'`

#### tiles-url

Set the URL of the API that provides the tiles.

Example: `"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"`

#### modality

Set the default and starting value for the modality of the widget.

Example: `"list" or "map"`

#### pageSize

Set the default and starting value for the modality of the widget. Default value is `10`.

Example: `"5"`

#### filterRadius

The radius expressed in kilometers with which to filter events. Default value is `0`.

Example: `"5"`

#### disableGastronomyDirections

If set the road directions are hidden.

#### categoriesFilter

If set, all the gastronomies are filtered by the bitmask values in the array.

Example: `"[512,8]"`


## Getting started

These instructions will get you a copy of the project up and running
on your local machine for development and testing purposes.

### Prerequisites

To build the project, the following prerequisites must be met:

- Node 14.15.4 / Yarn 1.22.10

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

Create a `.env` file in the main directory.
Fill it with this content:

```
HEREMAPS_API_KEY=YourKey
```

Replace `YourKey` with your API token to use the tiles and the search bar.

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

The application will be served and can be accessed at [http://localhost:8080](http://localhost:8080).

<!-- ## Tests and linting

The tests and the linting can be executed with the following commands:

```bash
npm run test
npm run lint
``` -->

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

### Dependenices

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

For support, please contact [help@opendatahub.bz.it](mailto:help@opendatahub.bz.it).

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
