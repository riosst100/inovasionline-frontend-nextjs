import { apiGet, apiPost } from "@/services/api-client";
import type { UserVerification, UserVerificationPayload } from "@/types/auth";

function toVerificationFormData(payload: UserVerificationPayload): FormData {
  const formData = new FormData();

  formData.append("full_name", payload.full_name);
  if (payload.id_number) {
    formData.append("id_number", payload.id_number);
  }
  formData.append("selfie", payload.selfie);
  formData.append("document", payload.document);

  return formData;
}

export const userVerificationService = {
  submit: (payload: UserVerificationPayload) =>
    apiPost<UserVerification>("/verifications", toVerificationFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  current: () => apiGet<UserVerification>("/verifications/me"),
};
