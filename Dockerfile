FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /app

COPY TransAction.API/. ./TransAction.API/
COPY TransAction.Data/. ./TransAction.Data/
WORKDIR /app/TransAction.API
RUN dotnet restore
RUN dotnet publish -c Release -o out

FROM microsoft/dotnet:2.2-aspnetcore-runtime AS runtime
WORKDIR /app
COPY --from=build /app/TransAction.API/out ./

EXPOSE 50790

ENTRYPOINT ["dotnet", "TransAction.API.dll"]

