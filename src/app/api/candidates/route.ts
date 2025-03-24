import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

// GET all candidates
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

// POST a new candidate
export async function POST(req: NextRequest) {
  try {
    const candidate = await req.json();
    const supabase = getSupabaseClient();
    
    // Add timestamps
    const now = new Date().toISOString();
    const candidateWithTimestamps = {
      ...candidate,
      created_at: now,
      updated_at: now,
    };
    
    const { data, error } = await supabase
      .from("candidates")
      .insert(candidateWithTimestamps)
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json(
      { error: "Failed to create candidate" },
      { status: 500 }
    );
  }
} 