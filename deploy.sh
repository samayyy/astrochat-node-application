#!/usr/bin/env bash

ENV=$1

aws s3 cp s3://devops-orchestration-scripts/devops_service_new.json.enc ./
role=$(aws --region us-east-1 kms decrypt --ciphertext-blob  fileb://devops_service_new.json.enc --output text --query Plaintext | base64 --decode | jq -r .$ENV.deploy_role)
creds=$(aws sts assume-role --role-arn $role --role-session-name deploy_role | jq .Credentials)

export AWS_ACCESS_KEY_ID=$(echo $creds | jq -r .AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo $creds | jq -r .SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo $creds | jq -r .SessionToken)


if [ "$1" = "staging" ]; then
    echo "Staging deployment"
    env_file="samconfig-sandbox.toml"
else
    echo "Prod deployment"
    env_file="samconfig-prod.toml"
fi



echo $env_file

sam build --use-container -t ./template.yaml

sam deploy --config-file "$env_file"


# clean up
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN
rm ./devops_service_new.json.enc
