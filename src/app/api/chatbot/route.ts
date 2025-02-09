export async function POST(request: Request): Promise<Response> {
    const {userPrompt}: { userPrompt: string } = await request.json();
    return randomResponse(userPrompt);
}

async function randomResponse(userPrompt: string): Promise<Response> {
    return Math.random() < 0.5 ? successResponse(userPrompt) : errorResponse();
}

function successResponse(userPrompt: string): Response {
    return new Response(`This is a placeholder for the translation of ${userPrompt}`);
}

function errorResponse(): Response {
    return new Response("Unauthorized", { status: 401, statusText: "Invalid username or password" });
}