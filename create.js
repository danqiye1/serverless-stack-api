import * as uuid from "uuid";
import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback){
    // Request body is passed in as a JSON encoded string in "event.body"
    const data = JSON.parse(event.body);

    const params = {
        TableName: process.env.tableName,
        // 'Item' contains the attributes of the item to be created
        // - 'userId': user identities are federated through the
        //             Cognito Identity Pool, we will use the identity id
        //             as the user id of the authenticated user
        // - 'noteId': a unique uuid
        // - 'content': parsed from request body
        // - 'attachment': parsed from request body
        // - 'createdAt': Unix timestamp of 'Item' creation
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: uuid.v1(),
            content: data.content,
            attachment: data.attachment,
            createdAt: Date.now()
        }
    };

    dynamoDB.put(params, (error, data) => {
        // Set response headers to enable CORS (Cross-Origin Resource Sharing)
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        };

        if (error) {
            const response = {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ status: false })
            };
            callback(null, response);
            return;
        }

        const response = {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(params.Item)
        };
        callback(null, response);
        return;
    });
}