import ModelClient, {ChatCompletionsOutput} from "@azure-rest/ai-inference";
import {AzureKeyCredential} from "@azure/core-auth";
import {ErrorResponse} from "@azure-rest/core-client";

const token: string | undefined = process.env["GITHUB_TOKEN"];
const endpoint: string = "https://models.inference.ai.azure.com";
const modelId: string = "gpt-4o-mini";

const oneShot = {
    prompt: "Q1 is in the books, and we had a very strong showing. Now there are certainly some gaps in our processes that we're working strategically in order to align that should help us bridge those gaps in a really efficient way.",
    response: "Q1 wasn't good and Management is very upset about it. We may need to fire some people."
}

const systemPrompt = "You are a an informed journalist of corporate culture with a morbid sense of humor. You are providing a darkly humorous, blunt and yet concise translation of corporate statements for employees assuming the worst case.  Provide only the translation with no commentary about the translation.";

type ChatbotRequest = { userPrompt: string };

export async function POST(request: Request): Promise<Response> {
    const payload: ChatbotRequest = await request.json();

    if (token === undefined) {
        return new Response("Error", {status: 401, statusText: "Missing token"});
    }
    const client = ModelClient(endpoint, new AzureKeyCredential(token));

    const response = await client.path("/chat/completions").post({
        body: {
            messages: [
                {role: "system", content: systemPrompt},
                {role: "user", content: oneShot.prompt},
                {role: "assistant", content: oneShot.response},
                {role: "user", content: payload.userPrompt}
            ],
            temperature: 1.0,
            top_p: 1.0,
            max_tokens: 1000,
            model: modelId
        }
    });
    console.dir(response);

    if (response.status !== "200") {
        const body = response.body as ErrorResponse;
        return new Response("Error", {status: 401, statusText: body.error.message});
    } else {
        const body = response.body as ChatCompletionsOutput;
        console.dir(body);
        return new Response(body.choices[0].message.content, {status: 200});
    }

}
