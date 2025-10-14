// ===== SUPABASE CONFIG =====
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://axllpuaybdzubfmsfkws.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bGxwdWF5YmR6dWJmbXNma3dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDMzODgsImV4cCI6MjA3NTMxOTM4OH0.KrjW79ZpnPxu_Lp9mETgKZU-kOLu3oMmWkABqOcDbco";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== GLOBAL VARIABLES =====
export let userRowId = null;
export let testQuestions = [];
export let userAnswers = {};
export let currentQuestionIndex = 0;
export let timerInterval = null;

// Test structure - 3 sections
export let currentSection = 1; // 1=Listening, 2=Reading, 3=Writing
export let audioPlayCount = 0;
export const MAX_AUDIO_PLAYS = 2;
export let audioEndedFlag = false; // Prevent double trigger

// Level selection
export let selectedLevel = null;
export let selectedRange = null;
export let selectedHSK = null; // numeric: 1..5
export let selectedTable = null; // per-level table name

// Section data
export let listeningQuestions = [];
export let readingQuestions = [];
export let writingQuestions = [];

// ===== SETTER FUNCTIONS =====
export function setUserRowId(id) {
    userRowId = id;
}

export function setTestQuestions(questions) {
    testQuestions = questions;
}

export function setUserAnswers(answers) {
    userAnswers = answers;
}

export function setCurrentSection(section) {
    currentSection = section;
}

export function setAudioPlayCount(count) {
    audioPlayCount = count;
}

export function setSelectedLevel(level, range, hsk, table) {
    selectedLevel = level;
    selectedRange = range;
    selectedHSK = hsk;
    selectedTable = table;
}

export function setSectionQuestions(listening, reading, writing) {
    listeningQuestions = listening;
    readingQuestions = reading;
    writingQuestions = writing;
}

// ===== GETTER FUNCTIONS =====
export function getUserRowId() {
    return userRowId;
}

export function getTestQuestions() {
    return testQuestions;
}

export function getUserAnswers() {
    return userAnswers;
}

export function getCurrentSection() {
    return currentSection;
}

export function getAudioPlayCount() {
    return audioPlayCount;
}

export function getSelectedLevel() {
    return { selectedLevel, selectedRange, selectedHSK, selectedTable };
}

export function getSectionQuestions() {
    return { listeningQuestions, readingQuestions, writingQuestions };
}
