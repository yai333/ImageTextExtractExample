const AWS = require("aws-sdk");

const textract = new AWS.Textract();

exports.textexactStartHandler = async (event, context, callback) => {
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
    textract.startDocumentAnalysis(params, function(err, data) {
      if (err) console.log(err);
      else console.log(data);
    });
  } catch (err) {
    console.log(err);
  } finally {
    callback(null);
  }
};

exports.textExactEndHandler = async (event, context, callback) => {
  console.log(JSON.stringify(event));
  // if event.Records.length>0{
  //
  // }
  callback(null);
};

exports.getTextExtractResult = async (event, context, callback) => {
  // const params = {
  //   JobId: "STRING_VALUE",
  //   MaxResults: "NUMBER_VALUE",
  //   NextToken: "STRING_VALUE"
  // };
  // textract.getDocumentAnalysis(params, function(err, data) {
  //   if (err) console.log(err, err.stack);
  //   else console.log(data);
  // });
  callback(null);
};
