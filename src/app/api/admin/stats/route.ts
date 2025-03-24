import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    // Get total count of candidates
    const { count: totalCount, error: countError } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error fetching candidates count:', countError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch candidate counts' },
        { status: 500 }
      );
    }
    
    // Get count by status
    const { data: statusData, error: statusError } = await supabase
      .from('candidates')
      .select('status')
      .not('status', 'is', null);
    
    if (statusError) {
      console.error('Error fetching candidates by status:', statusError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch candidates by status' },
        { status: 500 }
      );
    }
    
    // Calculate counts by status
    const statusCounts: Record<string, number> = {};
    
    statusData.forEach(item => {
      const status = item.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return NextResponse.json({
      success: true,
      totalCount: totalCount || 0,
      statusCounts
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
} 