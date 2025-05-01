name: Deploy Node.js to Azure

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Verify package.json
        run: test -f package.json || (echo "package.json missing!" && exit 1)

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22.x'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build --if-present

      - name: Zip files
        run: zip -r release.zip . -x '*.git*'

  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: release.zip

      - name: Deploy to Azure
        uses: azure/webapps-deploy@v3
        with:
          app-name: 'MyPaaSApp-123'
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: release.zip
