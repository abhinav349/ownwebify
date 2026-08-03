import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { put } from "@vercel/blob";
import { authOptions } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

/** Extensions matching ALLOWED_TYPES; anything else is normalised away. */
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Each call writes to paid blob storage and the result is world-readable,
  // so an unthrottled authenticated user is a standing cost/abuse vector.
  const limited = await enforceRateLimit(
    request,
    "upload",
    `user:${session.user.id}`
  );
  if (limited) return limited;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image uploads are not configured. Please contact support." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image must be smaller than 5 MB" },
      { status: 400 }
    );
  }

  // `file.name` is caller-controlled and is being interpolated into a
  // storage path, so take only a known-good extension from it rather than
  // whatever the last dot-segment happens to be — e.g. a name like
  // "a.png/../../evil" pops to "/evil" and injects path separators.
  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "";
  const ext = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : "png";
  const filename = `chat/${session.user.id}-${Date.now()}.${ext}`;

  try {
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Blob upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image. Please try again." },
      { status: 500 }
    );
  }
}
