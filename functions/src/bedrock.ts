import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const DEFAULT_MODEL =
  process.env.BEDROCK_MODEL_ID ?? "anthropic.claude-3-haiku-20240307-v1:0";

export async function invokeClaudeJson(system: string, userMessage: string): Promise<string> {
  const region = process.env.AWS_REGION ?? "us-east-1";
  const client = new BedrockRuntimeClient({
    region,
    credentials:
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  });

  const body = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 4096,
    temperature: 0.25,
    system,
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: userMessage }],
      },
    ],
  });

  const out = await client.send(
    new InvokeModelCommand({
      modelId: DEFAULT_MODEL,
      contentType: "application/json",
      accept: "application/json",
      body: Buffer.from(body),
    }),
  );

  const raw = new TextDecoder().decode(out.body);
  const parsed = JSON.parse(raw) as {
    content?: { type?: string; text?: string }[];
  };
  const text = parsed.content?.[0]?.text;
  if (!text) throw new Error("Bedrock: empty content");
  return text;
}

export function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object in model output");
  }
  return JSON.parse(trimmed.slice(start, end + 1));
}
