import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_LIFETIME_SECONDS = 8 * 60 * 60;

function sign(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function matchesSecret(provided, expected) {
  const providedHash = createHmac("sha256", "queueease-credential-check").update(provided).digest();
  const expectedHash = createHmac("sha256", "queueease-credential-check").update(expected).digest();
  return timingSafeEqual(providedHash, expectedHash);
}

export function issueOfficerToken(username, secret) {
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    exp: Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS,
  })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyOfficerToken(token, secret) {
  const [payload, signature, extra] = String(token || "").split(".");
  if (!payload || !signature || extra) return null;

  const expectedSignature = sign(payload, secret);
  if (!matchesSecret(signature, expectedSignature)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data.sub !== "string" || !Number.isInteger(data.exp) || data.exp <= Date.now() / 1000) {
      return null;
    }
    return data.sub;
  } catch {
    return null;
  }
}

export function requireOfficer(req, res, next) {
  const username = process.env.OFFICER_USERNAME;
  const secret = process.env.JWT_SECRET;
  const authorization = req.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";

  if (!username || !secret || secret.length < 32) {
    return res.status(503).json({ message: "Login petugas belum dikonfigurasi di backend." });
  }

  const authenticatedUsername = verifyOfficerToken(token, secret);
  if (authenticatedUsername !== username) {
    return res.status(401).json({ message: "Sesi petugas tidak valid. Silakan login kembali." });
  }

  next();
}

export function officerCredentialsConfigured() {
  return Boolean(
    process.env.OFFICER_USERNAME &&
    process.env.OFFICER_PASSWORD &&
    process.env.JWT_SECRET &&
    process.env.JWT_SECRET.length >= 32
  );
}

export function authenticateOfficer(username, password) {
  const expectedUsername = process.env.OFFICER_USERNAME || "";
  const expectedPassword = process.env.OFFICER_PASSWORD || "";
  return matchesSecret(username, expectedUsername) && matchesSecret(password, expectedPassword);
}
