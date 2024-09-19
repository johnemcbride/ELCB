#!/bin/bash

# Variables
ROLE_ARN="arn:aws:iam::228447865234:role/x-account-admin"
SESSION_NAME="dynamo-access"

# Assume the role and capture the output
OUTPUT=$(aws sts assume-role --role-arn $ROLE_ARN --role-session-name $SESSION_NAME --output json --profile elcb)

# Extract temporary credentials from the output
AWS_ACCESS_KEY_ID=$(echo $OUTPUT | jq -r '.Credentials.AccessKeyId')
AWS_SECRET_ACCESS_KEY=$(echo $OUTPUT | jq -r '.Credentials.SecretAccessKey')
AWS_SESSION_TOKEN=$(echo $OUTPUT | jq -r '.Credentials.SessionToken')



# Print the export commands so they can be used in the master shell
echo "export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID"
echo "export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY"
echo "export AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN"

