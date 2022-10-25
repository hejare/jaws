"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JawsStack = void 0;
const cdk = require("aws-cdk-lib");
// import * as sqs from 'aws-cdk-lib/aws-sqs';
const ec2 = require("aws-cdk-lib/aws-ec2");
class JawsStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    // The code that defines your stack goes here
    // example resource
    // const queue = new sqs.Queue(this, 'JawsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    new ec2.Vpc(this, 'mainVPC', {
      // This is where you can define how many AZs you want to use
      maxAzs: 2,
      // This is where you can define the subnet configuration per AZ
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public-subnet',
          subnetType: ec2.SubnetType.PUBLIC,
        }
      ]
    });
  }
}
exports.JawsStack = JawsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF3cy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImphd3Mtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLDhDQUE4QztBQUM5QywyQ0FBMkM7QUFFM0MsTUFBYSxTQUFVLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDdEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qiw2Q0FBNkM7UUFFN0MsbUJBQW1CO1FBQ25CLG1EQUFtRDtRQUNuRCxpREFBaUQ7UUFDakQsTUFBTTtRQUVOLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzNCLDREQUE0RDtZQUM1RCxNQUFNLEVBQUUsQ0FBQztZQUNULCtEQUErRDtZQUMvRCxtQkFBbUIsRUFBRTtnQkFDbkI7b0JBQ0UsUUFBUSxFQUFFLEVBQUU7b0JBQ1osSUFBSSxFQUFFLGVBQWU7b0JBQ3JCLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU07aUJBQ2xDO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF4QkQsOEJBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuLy8gaW1wb3J0ICogYXMgc3FzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zcXMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuXG5leHBvcnQgY2xhc3MgSmF3c1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gVGhlIGNvZGUgdGhhdCBkZWZpbmVzIHlvdXIgc3RhY2sgZ29lcyBoZXJlXG5cbiAgICAvLyBleGFtcGxlIHJlc291cmNlXG4gICAgLy8gY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHRoaXMsICdKYXdzUXVldWUnLCB7XG4gICAgLy8gICB2aXNpYmlsaXR5VGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMzAwKVxuICAgIC8vIH0pO1xuXG4gICAgbmV3IGVjMi5WcGModGhpcywgJ21haW5WUEMnLCB7XG4gICAgICAvLyBUaGlzIGlzIHdoZXJlIHlvdSBjYW4gZGVmaW5lIGhvdyBtYW55IEFacyB5b3Ugd2FudCB0byB1c2VcbiAgICAgIG1heEF6czogMixcbiAgICAgIC8vIFRoaXMgaXMgd2hlcmUgeW91IGNhbiBkZWZpbmUgdGhlIHN1Ym5ldCBjb25maWd1cmF0aW9uIHBlciBBWlxuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICB7XG4gICAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgICAgICAgIG5hbWU6ICdwdWJsaWMtc3VibmV0JyxcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KTtcbiAgfVxufVxuIl19