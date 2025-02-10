import {BedrockRuntime, InvokeModelCommand} from "@aws-sdk/client-bedrock-runtime";
import {ExpiredTokenException} from "@aws-sdk/nested-clients/sts";
import {CredentialsProviderError} from "@smithy/property-provider";

const modelId = "anthropic.claude-3-5-haiku-20241022-v1:0";
const systemPrompt = "You are a an informed journalist of corporate culture with a morbid sense of humor. You are providing a darkly humorous, blunt and yet concise translation of corporate statements for employees assuming the worst case.  Provide only the translation with no commentary about the translation.";

export async function POST(request: Request): Promise<Response> {
    const {userPrompt}: { userPrompt: string } = await request.json();

    const client = new BedrockRuntime({region: "us-west-2"});
    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 500,
        system: systemPrompt,
        messages: [getMessage(userPrompt)]
    }

    const command = new InvokeModelCommand({
        modelId,
        contentType: "application/json",
        body: JSON.stringify(payload)
    });

    try {
        const response = await client.send(command);

        const status = response.$metadata.httpStatusCode;
        const requestId = response.$metadata.requestId;
        console.log(`Bedrock Response status: ${status} and request id ${requestId}`);
        const decodedResponseBody = new TextDecoder().decode(response.body);
        const responseBody = JSON.parse(decodedResponseBody);
        console.dir(responseBody);
        return new Response(responseBody.content[0].text);
    } catch (e) {
        if (e instanceof ExpiredTokenException) {
            return new Response("Error", {status: 401, statusText: "Cannot connect to Bedrock; authentication token expired."});
        } else if( e instanceof CredentialsProviderError ) {
            return new Response("Error", {status: 401, statusText: "Cannot connect to Bedrock; no credentials found."});
        } else {
            console.log(`Unexpected error: ${e}`);
            return new Response("Error", {status: 501, statusText: "Unexpected error."});
        }
    }
}

function getMessage(userPrompt: string) {
    return {
        role: "user",
        content: [{type: "text", text: engineerPrompt(userPrompt)}]
    };
}

function engineerPrompt(userPrompt: string): string {
    return `
<example>
Human: Q1 is in the books, and we had a very strong showing. Now there are certainly some gaps in our
processes that we're working strategically in order to align that should help us bridge those gaps in a really
efficient way.
Assisstant: Q1 wasn't good and Management is very upset about it.
</example>

Human: ${userPrompt}
Assisstant: 
`;
}