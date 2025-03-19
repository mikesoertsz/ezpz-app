const BLAND_API_ENDPOINT = "https://api.bland.ai/v1/calls";

interface BlandCallParams {
  phoneNumber: string;
  voiceId: string;
  request_data?: {
    name: string;
    company?: string;
    email?: string;
  };
}

export const initiateBlandCall = async ({
  phoneNumber,
  voiceId,
  request_data,
}: BlandCallParams) => {
  try {
    const apiKey = import.meta.env.VITE_BLAND_API_KEY;
    if (!apiKey) {
      throw new Error("API key is not set in the environment variables");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    const data = {
      phone_number: phoneNumber,
      voice: voiceId,
      wait_for_greeting: false,
      record: true,
      amd: false,
      answered_by_enabled: false,
      noise_cancellation: false,
      interruption_threshold: 100,
      block_interruptions: false,
      max_duration: 25,
      model: "base",
      language: "en",
      background_track: "office",
      endpoint: "https://api.bland.ai",
      voicemail_action: "hangup",
      metadata: {
        name: request_data?.name || "",
        company: request_data?.company || "",
        email: request_data?.email || ""
      },
      from: "+14155322237",
      pathway_id: "910b8c10-57fc-4f3c-bafc-c4a7ea3bbcdc",
      pathway_version: "0"
    };

    console.log('Sending request to Bland AI:', data);

    const response = await fetch(BLAND_API_ENDPOINT, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Bland API error:', errorData);
      throw new Error(errorData.message || "Failed to initiate call");
    }

    const result = await response.json();
    console.log('Bland API response:', result);
    return result;
  } catch (error) {
    console.error("Error initiating Bland call:", error);
    throw error;
  }
};