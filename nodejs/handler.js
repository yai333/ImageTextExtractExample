const AWS = require("aws-sdk");
let response;

const textract = new AWS.Textract();
const s3BucketName = "aiyi.demo.textexact";
const documentName = "PaymentReceipt.pdf";

exports.lambdaHandler = async (event, context) => {
  try {
    var params = {
      DocumentLocation: {
        /* required */
        S3Object: {
          Bucket: s3BucketName,
          Name: documentName
        }
      },
      FeatureTypes: ["TABLES", "FORMS"],
      ClientRequestToken: "STRING_VALUE",
      JobTag: `textexact-${s3BucketName}`,
      NotificationChannel: {
        RoleArn: "STRING_VALUE" /* required */,
        SNSTopicArn: "STRING_VALUE" /* required */
      }
    };
    textract.startDocumentAnalysis(params, function(err, data) {
      if (err) console.log(err, err.stack);
      // an error occurred
      else console.log(data); // successful response
    });
  } catch (err) {
    console.log(err);
    return err;
  }
  return response;
};
