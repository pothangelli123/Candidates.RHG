import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

// GET a single candidate by ID
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = context.params;
    
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Candidate not found" },
          { status: 404 }
        );
      }
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Error fetching candidate:`, error);
    return NextResponse.json(
      { error: "Failed to fetch candidate" },
      { status: 500 }
    );
  }
}

// UPDATE a candidate
export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = context.params;
    const updates = await request.json();
    
    // Add updated timestamp
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from("candidates")
      .update(updatesWithTimestamp)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Candidate not found" },
          { status: 404 }
        );
      }
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Error updating candidate:`, error);
    return NextResponse.json(
      { error: "Failed to update candidate" },
      { status: 500 }
    );
  }
}

// DELETE a candidate
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = context.params;
    
    const { error } = await supabase
      .from("candidates")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`Error deleting candidate:`, error);
    return NextResponse.json(
      { error: "Failed to delete candidate" },
      { status: 500 }
    );
  }
} 