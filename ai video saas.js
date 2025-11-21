export async function POST(req) {
  try {
    const body = await req.json();

    //
    // 1. GENERATE SCRIPT
    //
    const scriptRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/generate-script`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!scriptRes.ok) throw new Error("Failed to generate script");
    const scriptData = await scriptRes.json();


    //
    // 2. GENERATE VOICE
    //
    const voiceRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/generate-voice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ script: scriptData.script }),
    });

    if (!voiceRes.ok) throw new Error("Failed to generate voice");
    const voiceData = await voiceRes.json();


    //
    // 3. THUMBNAIL
    //
    const thumbRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-thumbnail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!thumbRes.ok) throw new Error("Failed to generate thumbnail");
    const thumbData = await thumbRes.json();


    //
    // 4. CAPTIONS
    //
    const captionsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-captions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ script: scriptData.script }),
    });

    if (!captionsRes.ok) throw new Error("Failed to generate captions");
    const captionsData = await captionsRes.json();


    //
    // 5. OPTIONAL: RENDER VIDEO
    //
    // const renderRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/render-final`, {...})
    // renderData = await renderRes.json();


    //
    // FINAL RESPONSE
    //
    return Response.json({
      success: true,
      script: scriptData.script,
      voice: voiceData.voiceUrl,
      thumbnail: thumbData.thumbnailUrl,
      captions: captionsData.captions,
      // finalVideo: renderData.videoUrl
    });

  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
