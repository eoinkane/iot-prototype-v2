code ~/.aws/credentials

particle token create

code .env

export AWS_PROFILE=educate

# optional

npm run compile:lambda-app
npm run build:lambda-app
npm run build:ui

# used

npm run cdk -- synth
npm run cdk -- deploy --require-approval=never

cd lambda_app && npm run update-webhook && cd ..

npm run build:ui
