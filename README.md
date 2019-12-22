# Inroduction

This project contains source code and supporting files for a serverless application that automatically extract text from scanned pdf files using AWS Textract.

# Prerequisites

The following must be done before following this guide:

- Setup an AWS account.
- Configure the AWS CLI with user credentials.
- Install AWS CLI.
- AWS SAM CLI.
- jq (optional).

Deployment

```
$sam deploy --capabilities CAPABILITY_NAMED_IAM --guided
```

# Test

After you upload a pdf file into S3 bucket deployed, there will be a text file created automatically in the same bucket.

You can also call api gateway endpoint path `/textract` to get Textract result by job id. eg.

```
$curl  -d '{"jobId":"xxxxx2bd5ad43875edxxxx5aee29b65f273fxxxxx"}'  -H "Content-Type: application/json" https://xxxx.execute-api.ap-southeast-2.amazonaws.com/textract | jq '.'
```
