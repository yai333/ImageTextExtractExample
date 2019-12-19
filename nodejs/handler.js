const AWS = require("aws-sdk");
let response;

const textract = new AWS.Textract();
const s3BucketName = "aiyi.demo.textexact";
const documentName = "PaymentReceipt.pdf";

exports.textexactHandler = async (event, context, callback) => {
  console.log("Failure");
  context.callbackWaitsForEmptyEventLoop = false;
  callback(
    new Error("Failure from event, Success = false, I am failing!"),
    "Destination Function Error Thrown"
  );

  // try {
  //   var params = {
  //     DocumentLocation: {
  //       /* required */
  //       S3Object: {
  //         Bucket: s3BucketName,
  //         Name: documentName
  //       }
  //     },
  //     FeatureTypes: ["TABLES", "FORMS"],
  //     ClientRequestToken: "STRING_VALUE",
  //     JobTag: `textexact-${s3BucketName}`,
  //     NotificationChannel: {
  //       RoleArn: process.env.TEXT_EXTRACT_ROLE /* required */,
  //       SNSTopicArn: process.env.SNS_TOPIC /* required */
  //     }
  //   };
  //
  //   textract.startDocumentAnalysis(params, function(err, data) {
  //     if (err) console.log(err, err.stack);
  //     // an error occurred
  //     else console.log(data); // successful response
  //   });
  // } catch (err) {
  //   console.log("Failure");
  // }
  // context.callbackWaitsForEmptyEventLoop = false;
  // return {
  //   statusCode: 200
  // };
};
