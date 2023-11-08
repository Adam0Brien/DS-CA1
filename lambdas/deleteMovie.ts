import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand, // Import DeleteCommand
  GetCommand, // Import GetCommand for validation
} from "@aws-sdk/lib-dynamodb";
import Ajv from "ajv";
import schema from "../shared/types.schema.json";

const ajv = new Ajv();
const isValidBodyParams = ajv.compile(schema.definitions["Movie"] || {});

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    console.log("Event: ", event);

    // Handle HTTP DELETE request
    if (event.httpMethod === "DELETE") {
      const movieID = event.pathParameters?.movieID;

      if (!movieID) {
        return {
          statusCode: 400,
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ message: "Missing 'movieID' parameter" }),
        };
      }

      await ddbDocClient.send(
        new DeleteCommand({
          TableName: process.env.TABLE_NAME,
          Key: { movieID },
        })
      );

      return {
        statusCode: 204,
        headers: {
          "content-type": "application/json",
        },
      };
    } else {
      return {
        statusCode: 405, // 405 Method Not Allowed
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message: "Invalid HTTP method" }),
      };
    }
  } catch (error: any) {
    console.log(JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error }),
    };
  }
};

function createDDbDocClient() {
    const ddbClient = new DynamoDBClient({ region: process.env.REGION });
    const marshallOptions = {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    };
    const unmarshallOptions = {
      wrapNumbers: false,
    };
    const translateConfig = { marshallOptions, unmarshallOptions };
    return DynamoDBDocumentClient.from(ddbClient, translateConfig);
  }
