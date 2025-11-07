import { NextResponse } from "next/server";

const OPSGLITCH_URL = "https://www.opsglitch.com/api/v1/contest-submission/3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  try {
    const upstreamResponse = await fetch(OPSGLITCH_URL, {
      cache: "no-store",
    });

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch access code" },
        {
          status: upstreamResponse.status,
          headers: corsHeaders,
        }
      );
    }

    const data = await upstreamResponse.json();
    const uniqueGeneratedCode =
      typeof data?.uniqueGeneratedCode === "string"
        ? data.uniqueGeneratedCode
        : null;

    return NextResponse.json(
      { uniqueGeneratedCode },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error fetching access code:", error);
    return NextResponse.json(
      { error: "Unable to fetch access code" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: corsHeaders,
    }
  );
}
