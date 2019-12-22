const AWS = require("aws-sdk");
const { EOL } = require("os");
const path = require("path");
const textract = new AWS.Textract();
const s3 = new AWS.S3();

exports.textractStartHandler = async (event, context, callback) => {
  try {
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;
    const params = {
      DocumentLocation: {
        S3Object: {
          Bucket: bucket,
          Name: key
        }
      },
      FeatureTypes: ["TABLES", "FORMS"],
      NotificationChannel: {
        RoleArn: process.env.TEXT_EXTRACT_ROLE,
        SNSTopicArn: process.env.SNS_TOPIC
      }
    };
    const reponse = await textract.startDocumentAnalysis(params).promise();
    console.log(reponse);
  } catch (err) {
    console.log(err);
  } finally {
    callback(null);
  }
};

exports.textractEndHandler = async (event, context, callback) => {
  try {
    const {
      Sns: { Message }
    } = event.Records[0];
    const {
      JobId: jobId,
      Status: status,
      DocumentLocation: { S3ObjectName, S3Bucket }
    } = JSON.parse(Message);
    if (status === "SUCCEEDED") {
      const textResult = await getDocumentText(jobId, null);
      const params = {
        Bucket: S3Bucket,
        Key: `${path.parse(S3ObjectName).name}.txt`,
        Body: textResult
      };
      await s3.putObject(params).promise();
    }
  } catch (error) {
    callback(error);
  } finally {
    callback(null);
  }
};

exports.getTextractResult = async (event, context, callback) => {
  try {
    if (event.body) {
      const body = JSON.parse(event.body);
      if (body.jobId) {
        const params = {
          JobId: body.jobId,
          MaxResults: 100,
          nextToken: body.nextToken
        };
        !params.nextToken && delete params.nextToken;
        let {
          JobStatus: jobStatus,
          NextToken: nextToken,
          Blocks: blocks
        } = await textract.getDocumentAnalysis(params).promise();

        if (jobStatus === "SUCCEEDED") {
          textractResult = blocks
            .map(({ BlockType, Text }) => {
              if (BlockType === "LINE") return `${Text}${EOL}`;
            })
            .join();
        }
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            text: textractResult,
            jobStatus,
            nextToken
          })
        });
      }
    }
  } catch ({ statusCode, message }) {
    return callback(null, {
      statusCode,
      body: JSON.stringify({ message })
    });
  } finally {
    return callback(null);
  }
};

const getDocumentText = async (jobId, nextToken) => {
  console.log("nextToken", nextToken);
  const params = {
    JobId: jobId,
    MaxResults: 100,
    NextToken: nextToken
  };

  if (!nextToken) delete params.NextToken;

  let {
    JobStatus: _jobStatus,
    NextToken: _nextToken,
    Blocks: _blocks
  } = await textract.getDocumentAnalysis(params).promise();

  let textractResult = _blocks
    .map(({ BlockType, Text }) => {
      if (BlockType === "LINE") return `${Text}${EOL}`;
    })
    .join();

  if (_nextToken) {
    textractResult += await getDocumentText(jobId, _nextToken);
  }

  return textractResult;
};
