import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function getSpacesConfig() {
  const key = process.env.DO_SPACES_KEY;
  const secret = process.env.DO_SPACES_SECRET;
  const bucket = process.env.DO_SPACES_BUCKET;
  const endpoint = process.env.DO_SPACES_ENDPOINT;
  const region = process.env.DO_SPACES_REGION ?? "sgp1";
  const cdnUrl = process.env.DO_SPACES_CDN_URL;

  if (!key || !secret || !bucket || !endpoint || !cdnUrl) {
    throw new Error("DigitalOcean Spaces environment variables are not configured");
  }

  return { key, secret, bucket, endpoint, region, cdnUrl };
}

let s3Client: S3Client | null = null;

function getS3Client() {
  if (s3Client) return s3Client;

  const { key, secret, endpoint, region } = getSpacesConfig();
  s3Client = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId: key, secretAccessKey: secret },
    forcePathStyle: false,
  });

  return s3Client;
}

function sanitizeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function uploadToSpaces(
  file: File,
  folder = "shop-13/uploads",
): Promise<string> {
  const { bucket, cdnUrl } = getSpacesConfig();
  const timestamp = Date.now();
  const safeName = sanitizeFilename(file.name || "upload.jpg");
  const key = `${folder}/${timestamp}-${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
      ACL: "public-read",
    }),
  );

  return `${cdnUrl.replace(/\/$/, "")}/${key}`;
}
