/*
IHttpResponse.ts
Description: An interface that http errors and successes implement.
Use Cases: Used to provide a common API for all http responses and errors
*/

export default interface IHttpResponse {
    getContent(): {
        statusCode: number;
        status: string;
        message: string;
    };
}