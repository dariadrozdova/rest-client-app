export function normalizeResponseBody(response: unknown): unknown {
  if (typeof response !== "object" || response === null) {
    return response;
  }

  const responseObject: Record<string, unknown> = { ...response };
  const body = responseObject.body;

  if (typeof body === "object" && body !== null) {
    const bodyObject: Record<string, unknown> = { ...body };

    if (typeof bodyObject.body === "string") {
      const rawInnerBody: string = bodyObject.body;
      try {
        bodyObject.body = JSON.parse(rawInnerBody);
      } catch {
        bodyObject.body = {
          error: "Failed to parse inner body as JSON",
          raw: rawInnerBody,
        };
      }
    }

    responseObject.body = bodyObject;
  }

  return responseObject;
}
