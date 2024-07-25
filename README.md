![img](https://img.shields.io/badge/Lifecycle-Stable-97ca00)

# TransAction

## Introduction
TransAction is a voluntary initiative sponsored by the Ministry of Transportation and Infrastructure (TRAN) Employee Advisory Forum (EAF) and the ministry executives.  Employees are encouraged to reach out and forge teams of five with colleagues throughout TRAN. Employees exercise will earn "fitness points." Employees will not only compete against other teams, but their individual time will also help their geographic area compete in the 4-way battle between regions and headquarters.

## Requirements

- .NET 7
- Node.js 12+
- Microsoft SQL Server 2012+
- Pre-configured Keycloak Server

## Deployment (Local Development)

### Run Server
- Copy `TransAction.API/appsettings.json` to `TransAction.API/appsettings.Development.json`
- Update the vlaues in `TransAction.API/appsettings.Development.json`
- Change working dir to `TransAction.API` and run `dotnet restore`, `dotnet run`
- API Server can be accessed at `http://localhost:8080/api`

### Run Client
- Copy `transaction-client/.env.local.sample` to `transaction-client/.env.local`
- Update the values in `transaction-client/.env.local`
- Change working dir to `transaction-client` and run `npm install`, `npm start`
- Client can be access at `http://localhost:3000`

## Deployment (Local Docker)
- Update the environment values in `docker-compose.yml`
- Run 'docker-compose up`
- API Server can be accessed at `http://localhost:8080/api`
- Client can be access at `http://localhost:3000`

## How to Contribute

If you would like to contribute, please see our [CONTRIBUTING](CONTRIBUTING.md) guidelines.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). 
By participating in this project you agree to abide by its terms.

## Issues/Suggestions
Make Suggestions/Issues [here!](https://github.com/bcgov/transaction/issues/new)
Issues are [markdown supported](https://guides.github.com/features/mastering-markdown/).

## License

    Copyright 2018 Province of British Columbia

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
