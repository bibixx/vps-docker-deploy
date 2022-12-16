# Example Setup

```yml
name: Deploy to VPS
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: bibixx/vps-docker-deploy
      with:
        HOST_PATH: ${{ secrets.DEPLOY_HOST_PATH }}
        TARGET_PATH: ${{ secrets.DEPLOY_TARGET_PATH }}
        HOST: ${{ secrets.DEPLOY_HOST }}
        USER: ${{ secrets.DEPLOY_USER }}
        KEY: ${{ secrets.DEPLOY_KEY }}
```
