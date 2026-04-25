import twilio from "twilio";

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  try {
    return twilio(sid, token);
  } catch {
    return null;
  }
}

export async function sendSMS({ to, body }) {
  const from = process.env.TWILIO_PHONE_NUMBER;
  const client = getClient();

  if (!from || !client) {
    console.log("-----------------------------------------");
    console.log("⚠️  TWILIO SMS MOCK (Fallback Mode)");
    console.log(`TO: ${to}`);
    console.log(`BODY: ${body}`);
    console.log("-----------------------------------------");
    return { sid: "mock_sid_" + Math.random().toString(36).substr(2, 9), status: "sent" };
  }

  try {
    const msg = await client.messages.create({ from, to, body });
    return { sid: msg.sid, status: msg.status };
  } catch (err) {
    console.error("❌ TWILIO ERROR:", err.message);
    throw err;
  }
}
