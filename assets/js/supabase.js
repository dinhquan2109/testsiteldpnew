// ===== SUPABASE CONFIGURATION =====
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ===== SUPABASE CONFIG =====
const SUPABASE_URL = "https://axllpuaybdzubfmsfkws.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bGxwdWF5YmR6dWJmbXNma3dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDMzODgsImV4cCI6MjA3NTMxOTM4OH0.KrjW79ZpnPxu_Lp9mETgKZU-kOLu3oMmWkABqOcDbco";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== SUPABASE FUNCTIONS =====

// Save user information
async function saveUserInfo(userData) {
    const { data, error } = await supabase
        .from('placement')
        .insert([userData])
        .select();
    
    if (error) {
        throw new Error('Không thể lưu dữ liệu: ' + error.message);
    }
    
    return data[0];
}

// Get questions by level
async function getQuestionsByLevel(tableName, range = null) {
    let query = supabase.from(tableName).select('*');
    
    if (range) {
        // For HSK1 with range (e.g., "1-11")
        const [startNum, endNum] = range.split('-').map(Number);
        query = query
            .gte('order_number', startNum)
            .lte('order_number', endNum)
            .order('order_number');
    } else {
        // For other levels with section field
        query = query
            .order('section', { ascending: true })
            .order('order_number', { ascending: true });
    }
    
    const { data, error } = await query;
    
    if (error) {
        throw new Error('Không thể tải câu hỏi: ' + error.message);
    }
    
    return data;
}

// Save test results
async function saveTestResults(resultData) {
    const { data, error } = await supabase
        .from('test_results')
        .insert([resultData])
        .select();
    
    if (error) {
        throw new Error('Không thể lưu kết quả: ' + error.message);
    }
    
    return data[0];
}

// Get test results by placement ID
async function getTestResults(placementId) {
    const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('placement_id', placementId)
        .order('completed_at', { ascending: false });
    
    if (error) {
        throw new Error('Không thể tải kết quả: ' + error.message);
    }
    
    return data;
}

// Get user by ID
async function getUserById(userId) {
    const { data, error } = await supabase
        .from('placement')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) {
        throw new Error('Không thể tải thông tin người dùng: ' + error.message);
    }
    
    return data;
}

// ===== EXPORT =====
export { 
    supabase, 
    saveUserInfo, 
    getQuestionsByLevel, 
    saveTestResults, 
    getTestResults, 
    getUserById 
};
