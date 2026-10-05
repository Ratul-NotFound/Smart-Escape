// ==============================================================================
// Bilingual Localization: English and Bangla (Section 3.2 & Rulebook 5.6)
// ==============================================================================

export type Language = 'en' | 'bn';

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  contestBadge: string;
  startLocation: string;
  selectStartPrompt: string;
  evacuationRoute: string;
  targetExit: string;
  totalCost: string;
  statusOptimal: string;
  statusStartBlocked: string;
  statusNoRoute: string;
  hazardsTitle: string;
  activeHazardsCount: string;
  blockNode: string;
  unblockNode: string;
  blockCorridor: string;
  unblockCorridor: string;
  closeExit: string;
  reopenExit: string;
  resetButton: string;
  resetTooltip: string;
  judgeVerificationTitle: string;
  judgeVerificationDesc: string;
  runAllChecks: string;
  allChecksPassed: string;
  testPassed: string;
  testFailed: string;
  expected: string;
  actual: string;
  walkthroughTitle: string;
  walkthroughDesc: string;
  playWalkthrough: string;
  pauseWalkthrough: string;
  stepForward: string;
  resetWalkthrough: string;
  speed: string;
  alternativeRoutesTitle: string;
  noAlternativeRoutes: string;
  costDelta: string;
  exportPngButton: string;
  exportJsonButton: string;
  uploadCustomJson: string;
  highContrastToggle: string;
  normalContrastToggle: string;
  quickScenarios: string;
  scenarioBaseline: string;
  scenarioBlockedJunction: string;
  scenarioExitsClosed: string;
  scenarioDifferentStart: string;
  scenarioBlockedStart: string;
  summaryMetrics: string;
  totalNodes: string;
  totalCorridors: string;
  openExits: string;
  hazardElements: string;
  dragPanHelp: string;
  nodeTypeRoom: string;
  nodeTypeJunction: string;
  nodeTypeExit: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appTitle: 'Smart Escape',
    appSubtitle: 'Tactical Evacuation Route Simulator',
    contestBadge: 'AI DevFest 2026',
    startLocation: 'Starting Location',
    selectStartPrompt: 'Select an unblocked room or junction',
    evacuationRoute: 'Evacuation Route',
    targetExit: 'Target Exit',
    totalCost: 'Total Path Cost',
    statusOptimal: 'Optimal Route Found',
    statusStartBlocked: 'Starting location blocked',
    statusNoRoute: 'No route available',
    hazardsTitle: 'Simulated Hazard Controls',
    activeHazardsCount: 'Active Hazards',
    blockNode: 'Block Node',
    unblockNode: 'Clear Node',
    blockCorridor: 'Block Corridor',
    unblockCorridor: 'Clear Corridor',
    closeExit: 'Close Exit',
    reopenExit: 'Reopen Exit',
    resetButton: 'Restore Initial State',
    resetTooltip: 'Reset hazards and start location to building default',
    judgeVerificationTitle: 'Official Judge Test Suite',
    judgeVerificationDesc: 'Automated Section 4.1 verification runner against practice building',
    runAllChecks: 'Run All Automated Checks',
    allChecksPassed: 'All 5 Official Test Cases Passed 100%',
    testPassed: 'PASS',
    testFailed: 'FAIL',
    expected: 'Expected',
    actual: 'Actual',
    walkthroughTitle: 'Live Route Walkthrough',
    walkthroughDesc: 'Simulate emergency personnel navigating along the evacuation route',
    playWalkthrough: 'Play Simulation',
    pauseWalkthrough: 'Pause',
    stepForward: 'Step Forward',
    resetWalkthrough: 'Reset Avatar',
    speed: 'Speed',
    alternativeRoutesTitle: 'Alternative Evacuation Routes',
    noAlternativeRoutes: 'No alternative route available under current hazards',
    costDelta: 'Delta Cost',
    exportPngButton: 'Export Map (PNG)',
    exportJsonButton: 'Export State (JSON)',
    uploadCustomJson: 'Import Custom Building JSON',
    highContrastToggle: 'High Contrast Mode',
    normalContrastToggle: 'Standard Tactical EOC',
    quickScenarios: 'Section 4.1 Quick Scenarios',
    scenarioBaseline: 'TC-1: Baseline Route (R1)',
    scenarioBlockedJunction: 'TC-2: Block Junction C2',
    scenarioExitsClosed: 'TC-3: Close Exits E1 & E2',
    scenarioDifferentStart: 'TC-4: Different Start (R2)',
    scenarioBlockedStart: 'TC-5: Block Start (R1)',
    summaryMetrics: 'Facility Telemetry',
    totalNodes: 'Total Nodes',
    totalCorridors: 'Corridors',
    openExits: 'Open Exits',
    hazardElements: 'Hazards',
    dragPanHelp: 'Scroll or drag to pan & zoom. Click nodes/corridors to toggle hazards.',
    nodeTypeRoom: 'Room',
    nodeTypeJunction: 'Junction',
    nodeTypeExit: 'Exit',
  },
  bn: {
    appTitle: 'স্মার্ট এস্কেপ',
    appSubtitle: 'জরুরি উদ্ধার পথ সিমুলেটর',
    contestBadge: 'এআই দেবফেস্ট ২০২৬',
    startLocation: 'শুরুর অবস্থান',
    selectStartPrompt: 'একটি উন্মুক্ত রুম বা সংযোগস্থল নির্বাচন করুন',
    evacuationRoute: 'উদ্ধার পথ',
    targetExit: 'নিরাপদ বহির্গমন',
    totalCost: 'মোট পথের খরচ',
    statusOptimal: 'সর্বোত্তম পথ চিহ্নিত',
    statusStartBlocked: 'Starting location blocked', // Exact spec string
    statusNoRoute: 'No route available',            // Exact spec string
    hazardsTitle: 'বিপদ ও প্রতিবন্ধকতা ব্যবস্থাপনা',
    activeHazardsCount: 'সক্রিয় প্রতিবন্ধকতা',
    blockNode: 'নোড অবরুদ্ধ করুন',
    unblockNode: 'নোড মুক্ত করুন',
    blockCorridor: 'করিডোর বন্ধ করুন',
    unblockCorridor: 'করিডোর মুক্ত করুন',
    closeExit: 'বহির্গমন বন্ধ করুন',
    reopenExit: 'বহির্গমন খুলুন',
    resetButton: 'প্রাথমিক অবস্থায় ফিরুন',
    resetTooltip: 'বিল্ডিংয়ের প্রাথমিক অবস্থায় পুনরুদ্ধার করুন',
    judgeVerificationTitle: 'অফিসিয়াল জাজ টেস্ট স্যুট',
    judgeVerificationDesc: 'সেকশন ৪.১ যাচাইকরণের স্বয়ংক্রিয় টেস্ট রানার',
    runAllChecks: 'সকল টেস্ট স্বয়ংক্রিয়ভাবে চালান',
    allChecksPassed: '৫টি টেস্টের সবকটিতে সফল (১০০% সঠিক)',
    testPassed: 'পাস',
    testFailed: 'ফেল',
    expected: 'প্রত্যাশিত',
    actual: 'প্রাপ্ত',
    walkthroughTitle: 'উদ্ধার পথ সিমুলেশন',
    walkthroughDesc: 'উদ্ধারকারী ব্যক্তির ধাপে ধাপে পথ অতিক্রমের অ্যানিমেশন',
    playWalkthrough: 'সিমুলেশন চালান',
    pauseWalkthrough: 'থামান',
    stepForward: 'পরবর্তী ধাপ',
    resetWalkthrough: 'পুনরায় শুরু করুন',
    speed: 'গতি',
    alternativeRoutesTitle: 'বিকল্প উদ্ধার পথসমূহ',
    noAlternativeRoutes: 'বর্তমান অবস্থায় কোনো বিকল্প পথ উপলব্ধ নেই',
    costDelta: 'অতিরিক্ত খরচ',
    exportPngButton: 'ম্যাপ ছবি ডাউনলোড (PNG)',
    exportJsonButton: 'বর্তমান স্টেট সংরক্ষণ (JSON)',
    uploadCustomJson: 'কাস্টম বিল্ডিং JSON লোড করুন',
    highContrastToggle: 'উচ্চ বৈসাদৃশ্য মোড',
    normalContrastToggle: 'স্ট্যান্ডার্ড মোড',
    quickScenarios: 'সেকশন ৪.১ দ্রুত টেস্ট কেস',
    scenarioBaseline: 'টিসি-১: বেসলাইন রুট (R1)',
    scenarioBlockedJunction: 'টিসি-২: জাংশন C2 বন্ধ করুন',
    scenarioExitsClosed: 'টিসি-৩: সকল এক্সিট বন্ধ',
    scenarioDifferentStart: 'টিসি-৪: ভিন্ন শুরু (R2)',
    scenarioBlockedStart: 'টিসি-৫: শুরুর স্থান অবরুদ্ধ (R1)',
    summaryMetrics: 'ভবনের বর্তমান অবস্থা',
    totalNodes: 'মোট নোড',
    totalCorridors: 'করিডোর',
    openExits: 'উন্মুক্ত এক্সিট',
    hazardElements: 'প্রতিবন্ধকতা',
    dragPanHelp: 'প্যান ও জুম করতে ড্র্যাগ/স্ক্রোল করুন। বিপদ টগল করতে নোড/করিডোরে ক্লিক করুন।',
    nodeTypeRoom: 'কক্ষ (Room)',
    nodeTypeJunction: 'সংযোগস্থল (Junction)',
    nodeTypeExit: 'বহির্গমন (Exit)',
  },
};
