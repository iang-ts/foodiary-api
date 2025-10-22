/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';

const API_URL = 'https://api.foodiary.ian.dev.br/meals';
const TOKEN = 'eyJraWQiOiI5MWtxSENPZlBxME1aazhod3pZM2JDaHBuZjhwajZsOTFZVDRZbGI0eWowPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhMzhjMGE2YS0wMGMxLTcwMDUtMGYxNC0wOWU4ZjNjYjgyYzgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuc2EtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3NhLWVhc3QtMV9vaklGTEoyc24iLCJjbGllbnRfaWQiOiI2dTc0b2FkbDFlcHJvOGNiY2tsdnY4M2tsMyIsIm9yaWdpbl9qdGkiOiI5ZDdhYWQyNi0xOTlhLTQxNzMtODE5MS1hMzc2MmJjMmY0YTQiLCJpbnRlcm5hbElkIjoiMzJpMW00cGZ6QkswclM4VHlIeWNXQmRnZTFRIiwiZXZlbnRfaWQiOiI0N2EzYmFjZi0yMWI0LTQxMzYtYWQwNy0yODlkZGM1N2FkOTgiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzYxMDk0Mzk2LCJleHAiOjE3NjExODA3OTYsImlhdCI6MTc2MTA5NDM5NiwianRpIjoiMDRkMmQ4OGEtODRjYi00MGFmLWJlYTEtODhkYjU1MGM5ZTI2IiwidXNlcm5hbWUiOiJhMzhjMGE2YS0wMGMxLTcwMDUtMGYxNC0wOWU4ZjNjYjgyYzgifQ.fvVZg42faiXcngz41XdFit-o6_azo68oulT2j9vuVhaBwzgELys73PDobxtzZjwPXnjnodO6O82gi14DOEtMjzKXYfJJZJghrMRbv_PMn2iUrS6fq8WpegUs6ZVpqLi7c0JMwqWmnmcesXIHcUKLl9tc1DrynWjiSIlvxPNlAqU0wUW0ZDjFRaptkokaCZm3qrHkRBOwZH2bEGJrPoXp3eoDj9kb1Bd1PZVfD1luxQ3xnPvoZxbuKV1odFmiEzDNXXdFYzoMedgVCwoDX5g2eCr8DQZkr8N4TNWxXL3CpXrZj6RKDBxZMvqZtewAibriKjhlg3aks58HwtcsdShypg';

interface IPresignResponse {
  uploadSignature: string;
}

interface IPresignDecoded {
  url: string;
  fields: Record<string, string>;
}

async function readFile(filePath: string, type: 'audio/m4a' | 'image/jpeg'): Promise<{
  data: Buffer;
  size: number;
  type: string;
}> {
  console.log(`🔍 Reading file from disk: ${filePath}`);
  const data = await fs.readFile(filePath);
  return {
    data,
    size: data.length,
    type,
  };
}

async function createMeal(
  fileType: string,
  fileSize: number,
): Promise<IPresignDecoded> {
  console.log(`🚀 Requesting presigned POST for ${fileSize} bytes of type ${fileType}`);
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ file: { type: fileType, size: fileSize } }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get presigned POST: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as IPresignResponse;
  const decoded = JSON.parse(
    Buffer.from(json.uploadSignature, 'base64').toString('utf-8'),
  ) as IPresignDecoded;

  console.log('✅ Received presigned POST data');
  return decoded;
}

function buildFormData(
  fields: Record<string, string>,
  fileData: Buffer,
  filename: string,
  fileType: string,
): FormData {
  console.log(`📦 Building FormData with ${Object.keys(fields).length} fields and file ${filename}`);
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }
  const blob = new Blob([fileData], { type: fileType });
  form.append('file', blob, filename);
  return form;
}

async function uploadToS3(url: string, form: FormData): Promise<void> {
  console.log(`📤 Uploading to S3 at ${url}`);
  const res = await fetch(url, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`S3 upload failed: ${res.status} ${res.statusText} — ${text}`);
  }

  console.log('🎉 Upload completed successfully');
}

async function uploadFile(filePath: string, fileType: 'audio/m4a' | 'image/jpeg'): Promise<void> {
  try {
    const { data, size, type } = await readFile(filePath, fileType);
    const { url, fields } = await createMeal(type, size);
    const form = buildFormData(fields, data, path.basename(filePath), type);
    await uploadToS3(url, form);
  } catch (err) {
    console.error('❌ Error during uploadFile:', err);
    throw err;
  }
}

uploadFile(
  path.resolve(__dirname, 'assets', 'refeicao.jpg'),
  'image/jpeg',
).catch(() => process.exit(1));
