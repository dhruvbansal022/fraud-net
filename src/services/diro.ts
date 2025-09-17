import { env, getDiroAuthHeader } from "@/config/env";

export interface DiroSmartFeedbackResponse {
  document_type?: string;
  name?: boolean;
  address?: boolean;
  accountnumber?: boolean;
  accountnumber_value?: string[];
  period?: string;
  isCategoryInvalid?: boolean;
  docid?: string;
  // Allow unknowns without forcing any
  [key: string]: unknown;
}

export interface SmartFeedbackParams {
  file: File;
  buttonId?: string;
  warnTrackId1?: string;
  warnTrackId2?: string;
}

export async function uploadSmartFeedback({
  file,
  buttonId,
  warnTrackId1,
  warnTrackId2,
}: SmartFeedbackParams): Promise<DiroSmartFeedbackResponse> {
  const effectiveButtonId = buttonId || env.diro.defaultButtonId || "";
  const effectiveWarn1 = warnTrackId1 ?? env.diro.warnTrackId1;
  const effectiveWarn2 = warnTrackId2 ?? env.diro.warnTrackId2;
  const formData = new FormData();
  formData.append("buttonid", effectiveButtonId);
  formData.append("pdffile", file, file.name);
  formData.append(
    "warn_cases",
    JSON.stringify({
      trackid1: effectiveWarn1,
      trackid2: effectiveWarn2,
    })
  );

  // Debug: confirm payload matches expected structure and includes file
  try {
    console.log("rishabh-smartFeedback request:", {
      buttonid: effectiveButtonId,
      pdffile: { name: file.name, type: file.type, size: file.size },
      warn_cases: { trackid1: effectiveWarn1, trackid2: effectiveWarn2 },
    });
  } catch {}

  const headers: Record<string, string> = {
    Accept: "application/json",
    "x-api-key": env.diro.apiKey || "",
  };
  const authHeader = getDiroAuthHeader();
  if (authHeader) headers["Authorization"] = authHeader;

  const response = await fetch(env.diro.apiUrl, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `DIRO upload failed (${response.status} ${response.statusText})${text ? `: ${text}` : ""}`
    );
  }

  return (await response.json()) as DiroSmartFeedbackResponse;
}

export interface SmartUploadResponse {
  error: boolean;
  message: string;
}

export async function submitSmartUpload(docid: string): Promise<SmartUploadResponse> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": env.diro.apiKey || "",
  };
  const authHeader = getDiroAuthHeader();
  if (authHeader) headers["Authorization"] = authHeader;

  const response = await fetch(env.diro.smartUploadUrl || "", {
    method: "POST",
    headers,
    body: JSON.stringify({ docid }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `DIRO smartUpload failed (${response.status} ${response.statusText})${text ? `: ${text}` : ""}`
    );
  }

  return (await response.json()) as SmartUploadResponse;
}


