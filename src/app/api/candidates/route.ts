import { getSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET all candidates
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Map the database fields to the Candidate interface
    const mappedData = (data || []).map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone || undefined,
      position: item.position,
      skills: item.skills,
      experience: item.experience,
      education: item.education,
      resume: item.resume || undefined,
      status: item.status,
      notes: item.notes || undefined,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    
    return NextResponse.json({
      success: true,
      candidates: mappedData
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

// POST a new candidate
export async function POST(request: NextRequest) {
  try {
    console.log("Received request to add candidate");
    
    // Get candidate data from request body
    const candidateData = await request.json();
    console.log("Candidate data:", JSON.stringify(candidateData));
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'position', 'skills', 'experience', 'education', 'status'];
    for (const field of requiredFields) {
      if (!candidateData[field]) {
        console.log(`Missing required field: ${field}`);
        return NextResponse.json({
          success: false,
          message: `Missing required field: ${field}`,
        }, { status: 400 });
      }
    }
    
    // Check that skills is an array
    if (!Array.isArray(candidateData.skills)) {
      console.log("Skills is not an array:", candidateData.skills);
      // If it's a string, try to convert it to an array
      if (typeof candidateData.skills === 'string') {
        try {
          candidateData.skills = JSON.parse(candidateData.skills);
          console.log("Parsed skills from JSON string:", candidateData.skills);
        } catch (e) {
          console.log("Failed to parse skills as JSON, treating as single item");
          candidateData.skills = [candidateData.skills];
        }
      } else {
        console.log("Setting skills to empty array");
        candidateData.skills = [];
      }
    }

    // Ensure experience is a number
    if (typeof candidateData.experience !== 'number') {
      console.log("Experience is not a number:", candidateData.experience);
      candidateData.experience = Number(candidateData.experience) || 0;
      console.log("Converted experience to:", candidateData.experience);
    }

    // Map from our client-side model to the database model
    const dbCandidateData = {
      name: candidateData.name,
      email: candidateData.email,
      phone: candidateData.phone || null,
      position: candidateData.position,
      skills: candidateData.skills || [],
      experience: Number(candidateData.experience) || 0,
      education: candidateData.education,
      resume: candidateData.resume || null,
      status: candidateData.status || 'new',
      notes: candidateData.notes || null,
    };
    
    console.log("Prepared database candidate data:", JSON.stringify(dbCandidateData));
    
    // Insert into database
    const supabase = getSupabaseClient();
    
    // Try to get the table schema first to verify connection
    const { data: schemaData, error: schemaError } = await supabase
      .from('candidates')
      .select('*')
      .limit(1);
      
    if (schemaError) {
      console.error('Error accessing candidates table:', schemaError);
      return NextResponse.json({
        success: false,
        message: 'Failed to access candidates table',
        error: schemaError.message,
        details: schemaError
      }, { status: 500 });
    }
    
    console.log("Successfully connected to candidates table");
    
    // Now insert the candidate
    const { data, error } = await supabase
      .from('candidates')
      .insert(dbCandidateData)
      .select('id')
      .single();
    
    if (error) {
      console.error('Error inserting candidate:', error);
      
      // Check for specific error types
      if (error.code === '23502') { // not_null_violation
        return NextResponse.json({
          success: false,
          message: 'Missing required field in database',
          error: error.message,
          details: error
        }, { status: 400 });
      }
      
      if (error.code === '23505') { // unique_violation
        return NextResponse.json({
          success: false,
          message: 'A candidate with this information already exists',
          error: error.message,
          details: error
        }, { status: 409 });
      }
      
      return NextResponse.json({
        success: false,
        message: 'Failed to add candidate',
        error: error.message,
        details: error
      }, { status: 500 });
    }
    
    console.log("Successfully added candidate with ID:", data.id);
    
    return NextResponse.json({
      success: true,
      message: 'Candidate added successfully',
      candidateId: data.id
    });
    
  } catch (error: any) {
    console.error('Error in candidate API:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 