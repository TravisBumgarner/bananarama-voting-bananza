![image](https://user-images.githubusercontent.com/11890057/210198534-f17588f4-6fda-4b65-b8b0-baefb2d04564.png)


# Deploy

### Backend

Note - For some reason on initial deploy, the first failed. Ran again and it was ok.

1. `cd backend && yarn run deploy`
2. Login to GCP and add `NODE_ENV=production` as an env variable. 

### Frontend

1. `cd frontend && yarn run deploy`
