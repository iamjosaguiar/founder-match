"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, CheckCircle, User, Target, Briefcase, Building, Users, AlertTriangle, Brain, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AssessmentData = {
  // Section 1: Founder Identity & Work Style
  motivation: string;
  founderPersonality: string;
  pressureResponse: string;
  conflictHandling: string;
  communicationStyle: string;
  bigFiveData?: any;
  
  // Section 2: Vision, Commitment & Ambition
  longTermVision: string;
  idealExit: string;
  weeklyCommitment: number;
  fullTimeReady: boolean;
  noPayCommitment: boolean;
  locationFlexible: boolean;
  riskAppetite: number;
  
  // Section 3: Skills, Strengths & Role Fit
  topSkills: string[];
  weakAreas: string;
  preferredRoles: string[];
  technicalLevel: string;
  portfolioLinks?: any;
  biggestAchievement: string;
  
  // Section 4: Startup Stage & Domain Fit
  currentStage: string;
  lookingToJoin: string;
  passionateIndustries: string[];
  domainExperience: boolean;
  previousStartupExp: boolean;
  
  // Section 5: Work Culture & Operating Style
  workingStyle: string;
  workPreference: string;
  timezoneFlexibility: string;
  meetingRhythm: string;
  collaborationScale: number;
  
  // Section 6: Conflict, Equity & Red Flags
  scenarioResponse: string;
  equityExpectation: string;
  dealbreakers: string[];
  previousCofounderExp: string;
  
  // Section 7: Optional Psychometrics
  psychometricData?: any;
};

const sections = [
  { id: 1, title: "Founder Identity & Work Style", icon: User, description: "Your personality and interpersonal dynamics" },
  { id: 2, title: "Vision, Commitment & Ambition", icon: Target, description: "Long-term goals and personal investment" },
  { id: 3, title: "Skills, Strengths & Role Fit", icon: Briefcase, description: "Capabilities and role preferences" },
  { id: 4, title: "Startup Stage & Domain Fit", icon: Building, description: "Experience and industry alignment" },
  { id: 5, title: "Work Culture & Operating Style", icon: Users, description: "Collaboration and working preferences" },
  { id: 6, title: "Conflict, Equity & Red Flags", icon: AlertTriangle, description: "Potential challenges and dealbreakers" },
  { id: 7, title: "Optional Psychometrics", icon: Brain, description: "Advanced personality insights" },
  { id: 8, title: "Review & Submit", icon: CheckCircle, description: "Finalize your founder profile" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function FounderAssessment() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    motivation: "",
    founderPersonality: "",
    pressureResponse: "",
    conflictHandling: "",
    communicationStyle: "",
    longTermVision: "",
    idealExit: "",
    weeklyCommitment: 40,
    fullTimeReady: false,
    noPayCommitment: false,
    locationFlexible: false,
    riskAppetite: 5,
    topSkills: [],
    weakAreas: "",
    preferredRoles: [],
    technicalLevel: "",
    biggestAchievement: "",
    currentStage: "",
    lookingToJoin: "",
    passionateIndustries: [],
    domainExperience: false,
    previousStartupExp: false,
    workingStyle: "",
    workPreference: "",
    timezoneFlexibility: "",
    meetingRhythm: "",
    collaborationScale: 5,
    scenarioResponse: "",
    equityExpectation: "",
    dealbreakers: [],
    previousCofounderExp: "",
  });

  const updateData = (field: keyof AssessmentData, value: any) => {
    setAssessmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: keyof AssessmentData, item: string) => {
    const currentArray = assessmentData[field] as string[];
    const newArray = currentArray.includes(item) 
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateData(field, newArray);
  };

  const nextSection = () => {
    if (currentSection < 8) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData),
      });

      if (response.ok) {
        router.push('/discover');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to submit assessment'}`);
      }
    } catch (error) {
      console.error('Assessment submission error:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">What motivates you to build a startup right now?</label>
              <Textarea 
                value={assessmentData.motivation}
                onChange={(e) => updateData('motivation', e.target.value)}
                placeholder="Share your core motivation..."
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Which best describes your founder personality?</label>
              <div className="grid grid-cols-2 gap-3">
                {['Visionary', 'Operator', 'Craftsman', 'Strategist'].map((type) => (
                  <Button
                    key={type}
                    variant={assessmentData.founderPersonality === type ? "default" : "outline"}
                    onClick={() => updateData('founderPersonality', type)}
                    className="text-left justify-start"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">When under pressure, how do you typically respond?</label>
              <div className="space-y-2">
                {[
                  'Take control',
                  'Collaborate and compromise', 
                  'Withdraw and reflect',
                  'Escalate and push through'
                ].map((response) => (
                  <Button
                    key={response}
                    variant={assessmentData.pressureResponse === response ? "default" : "outline"}
                    onClick={() => updateData('pressureResponse', response)}
                    className="w-full text-left justify-start"
                  >
                    {response}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">How do you prefer to handle conflict in a team?</label>
              <Textarea 
                value={assessmentData.conflictHandling}
                onChange={(e) => updateData('conflictHandling', e.target.value)}
                placeholder="Describe your approach to team conflict..."
                className="min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">How do you prefer to communicate?</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Direct and brief',
                  'Detailed and structured',
                  'Casual and async', 
                  'Emotional and intuitive'
                ].map((style) => (
                  <Button
                    key={style}
                    variant={assessmentData.communicationStyle === style ? "default" : "outline"}
                    onClick={() => updateData('communicationStyle', style)}
                    className="text-left justify-start text-sm"
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">What's your long-term vision?</label>
              <div className="space-y-2">
                {[
                  'Build a billion-dollar company',
                  'Build a profitable lifestyle business',
                  'Solve a deep problem for a niche audience'
                ].map((vision) => (
                  <Button
                    key={vision}
                    variant={assessmentData.longTermVision === vision ? "default" : "outline"}
                    onClick={() => updateData('longTermVision', vision)}
                    className="w-full text-left justify-start"
                  >
                    {vision}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">What's your ideal exit?</label>
              <div className="grid grid-cols-2 gap-3">
                {['Acquisition', 'IPO', 'Long-term operator', 'Undecided'].map((exit) => (
                  <Button
                    key={exit}
                    variant={assessmentData.idealExit === exit ? "default" : "outline"}
                    onClick={() => updateData('idealExit', exit)}
                    className="text-left justify-start"
                  >
                    {exit}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">How many hours per week can you realistically commit?</label>
              <Input 
                type="number"
                value={assessmentData.weeklyCommitment}
                onChange={(e) => updateData('weeklyCommitment', parseInt(e.target.value) || 0)}
                min="0"
                max="168"
                placeholder="40"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={assessmentData.fullTimeReady}
                  onCheckedChange={(checked) => updateData('fullTimeReady', checked)}
                />
                <label className="text-sm">Are you open to full-time commitment?</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={assessmentData.noPayCommitment}
                  onCheckedChange={(checked) => updateData('noPayCommitment', checked)}
                />
                <label className="text-sm">Are you willing to go 6+ months with minimal or no pay?</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={assessmentData.locationFlexible}
                  onCheckedChange={(checked) => updateData('locationFlexible', checked)}
                />
                <label className="text-sm">Are you open to relocating or working timezone-flexibly?</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rate your risk appetite (1 = cautious, 10 = all-in, burn the ships)</label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Cautious</span>
                <Input 
                  type="range"
                  min="1"
                  max="10"
                  value={assessmentData.riskAppetite}
                  onChange={(e) => updateData('riskAppetite', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">All-in</span>
                <Badge variant="outline">{assessmentData.riskAppetite}/10</Badge>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">What are your top 3 skills relevant to startup execution?</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Product Development', 'Engineering', 'Design', 'Marketing',
                  'Sales', 'Operations', 'Finance', 'Fundraising',
                  'Strategy', 'Leadership', 'Business Development', 'Analytics'
                ].map((skill) => (
                  <Button
                    key={skill}
                    variant={assessmentData.topSkills.includes(skill) ? "default" : "outline"}
                    onClick={() => handleArrayToggle('topSkills', skill)}
                    className="text-left justify-start text-sm"
                    disabled={!assessmentData.topSkills.includes(skill) && assessmentData.topSkills.length >= 3}
                  >
                    {skill}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">Selected: {assessmentData.topSkills.length}/3</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Which areas are you not comfortable leading?</label>
              <Textarea 
                value={assessmentData.weakAreas}
                onChange={(e) => updateData('weakAreas', e.target.value)}
                placeholder="Areas where you'd prefer a co-founder to take the lead..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Which roles do you prefer to own day-to-day?</label>
              <div className="grid grid-cols-2 gap-2">
                {['Product', 'Tech', 'Ops', 'Growth', 'Fundraising', 'Sales'].map((role) => (
                  <Button
                    key={role}
                    variant={assessmentData.preferredRoles.includes(role) ? "default" : "outline"}
                    onClick={() => handleArrayToggle('preferredRoles', role)}
                    className="text-left justify-start"
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Are you technical or non-technical?</label>
              <div className="grid grid-cols-3 gap-3">
                {['Technical', 'Semi-technical', 'Non-technical'].map((level) => (
                  <Button
                    key={level}
                    variant={assessmentData.technicalLevel === level ? "default" : "outline"}
                    onClick={() => updateData('technicalLevel', level)}
                    className="text-left justify-start"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">What's the hardest thing you've shipped or achieved?</label>
              <Textarea 
                value={assessmentData.biggestAchievement}
                onChange={(e) => updateData('biggestAchievement', e.target.value)}
                placeholder="Describe your most challenging accomplishment..."
                className="min-h-[100px]"
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Which stage are you currently at?</label>
              <div className="space-y-2">
                {['Idea', 'Validation', 'MVP Build', 'Early Revenue', 'Scaling'].map((stage) => (
                  <Button
                    key={stage}
                    variant={assessmentData.currentStage === stage ? "default" : "outline"}
                    onClick={() => updateData('currentStage', stage)}
                    className="w-full text-left justify-start"
                  >
                    {stage}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Are you looking to:</label>
              <div className="space-y-2">
                {[
                  'Start something from scratch',
                  'Join an existing idea',
                  'Find a technical cofounder',
                  'Build in public'
                ].map((option) => (
                  <Button
                    key={option}
                    variant={assessmentData.lookingToJoin === option ? "default" : "outline"}
                    onClick={() => updateData('lookingToJoin', option)}
                    className="w-full text-left justify-start"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Which industries or domains are you passionate about?</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'AI/ML', 'SaaS', 'Web3/Crypto', 'HealthTech', 'EdTech', 'FinTech',
                  'E-commerce', 'Gaming', 'Climate Tech', 'DeepTech', 'Consumer', 'B2B'
                ].map((industry) => (
                  <Button
                    key={industry}
                    variant={assessmentData.passionateIndustries.includes(industry) ? "default" : "outline"}
                    onClick={() => handleArrayToggle('passionateIndustries', industry)}
                    className="text-left justify-start text-sm"
                  >
                    {industry}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={assessmentData.domainExperience}
                  onCheckedChange={(checked) => updateData('domainExperience', checked)}
                />
                <label className="text-sm">Do you have existing experience or networks in that domain?</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={assessmentData.previousStartupExp}
                  onCheckedChange={(checked) => updateData('previousStartupExp', checked)}
                />
                <label className="text-sm">Have you previously worked in a startup or founded one?</label>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Preferred working style:</label>
              <div className="grid grid-cols-3 gap-3">
                {['Remote', 'Hybrid', 'In-person'].map((style) => (
                  <Button
                    key={style}
                    variant={assessmentData.workingStyle === style ? "default" : "outline"}
                    onClick={() => updateData('workingStyle', style)}
                    className="text-left justify-start"
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">How do you prefer to work?</label>
              <div className="space-y-2">
                {[
                  'Fast-paced chaos',
                  'Methodical systems',
                  'Deep focus with minimal meetings',
                  'High-collaboration and sync'
                ].map((pref) => (
                  <Button
                    key={pref}
                    variant={assessmentData.workPreference === pref ? "default" : "outline"}
                    onClick={() => updateData('workPreference', pref)}
                    className="w-full text-left justify-start"
                  >
                    {pref}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Timezone & working hours flexibility?</label>
              <Input 
                value={assessmentData.timezoneFlexibility}
                onChange={(e) => updateData('timezoneFlexibility', e.target.value)}
                placeholder="e.g., PST preferred, flexible for meetings"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Preferred meeting rhythm:</label>
              <div className="grid grid-cols-3 gap-3">
                {['Daily', 'Weekly', 'Async only'].map((rhythm) => (
                  <Button
                    key={rhythm}
                    variant={assessmentData.meetingRhythm === rhythm ? "default" : "outline"}
                    onClick={() => updateData('meetingRhythm', rhythm)}
                    className="text-left justify-start"
                  >
                    {rhythm}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Collaboration preference scale (1 = solo execution, 10 = constant pairing)</label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Solo</span>
                <Input 
                  type="range"
                  min="1"
                  max="10"
                  value={assessmentData.collaborationScale}
                  onChange={(e) => updateData('collaborationScale', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">Pairing</span>
                <Badge variant="outline">{assessmentData.collaborationScale}/10</Badge>
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">How would you handle this scenario: Your cofounder misses a deadline for an investor pitch.</label>
              <Textarea 
                value={assessmentData.scenarioResponse}
                onChange={(e) => updateData('scenarioResponse', e.target.value)}
                placeholder="Describe how you would handle this situation..."
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">What equity % would you expect for your contribution?</label>
              <Input 
                value={assessmentData.equityExpectation}
                onChange={(e) => updateData('equityExpectation', e.target.value)}
                placeholder="e.g., 50-50, depends on contribution, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">What are your absolute dealbreakers in a cofounder?</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  'Must be full-time',
                  'No crypto projects',
                  'Must be remote-friendly',
                  'Must have technical skills',
                  'Must have business experience',
                  'Must be in same timezone',
                  'Must be willing to relocate'
                ].map((dealbreaker) => (
                  <Button
                    key={dealbreaker}
                    variant={assessmentData.dealbreakers.includes(dealbreaker) ? "default" : "outline"}
                    onClick={() => handleArrayToggle('dealbreakers', dealbreaker)}
                    className="text-left justify-start text-sm"
                  >
                    {dealbreaker}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Have you had any previous cofounder relationships? What worked? What didn't?</label>
              <Textarea 
                value={assessmentData.previousCofounderExp}
                onChange={(e) => updateData('previousCofounderExp', e.target.value)}
                placeholder="Share your previous cofounder experiences..."
                className="min-h-[100px]"
              />
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Optional: Enhanced Personality Insights</h3>
              <p className="text-gray-600 mb-6">
                These additional insights help create even more accurate matches, but are completely optional.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Upload Existing Personality Test Results</h4>
              <p className="text-sm text-gray-600 mb-3">
                If you have results from MBTI, Big Five, DISC, Enneagram, or similar tests, you can upload them here.
              </p>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Test Results (Optional)
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Any additional insights about your personality or working style?</label>
              <Textarea 
                value={assessmentData.psychometricData?.notes || ''}
                onChange={(e) => updateData('psychometricData', { ...assessmentData.psychometricData, notes: e.target.value })}
                placeholder="Optional: Any other personality insights you'd like to share..."
              />
            </div>

            <div className="text-center">
              <Button 
                onClick={nextSection}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue to Review <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 8:
        return (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-2">Review Your Founder Profile</h3>
              <p className="text-gray-600">
                Review your responses below, then submit to start finding compatible co-founders.
              </p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Identity & Vision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Personality:</strong> {assessmentData.founderPersonality}</p>
                  <p><strong>Vision:</strong> {assessmentData.longTermVision}</p>
                  <p><strong>Risk Appetite:</strong> {assessmentData.riskAppetite}/10</p>
                  <p><strong>Commitment:</strong> {assessmentData.weeklyCommitment} hours/week, {assessmentData.fullTimeReady ? 'Full-time ready' : 'Part-time'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills & Role</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Top Skills:</strong> {assessmentData.topSkills.join(', ')}</p>
                  <p><strong>Preferred Roles:</strong> {assessmentData.preferredRoles.join(', ')}</p>
                  <p><strong>Technical Level:</strong> {assessmentData.technicalLevel}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Work Style</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Working Style:</strong> {assessmentData.workingStyle}</p>
                  <p><strong>Communication:</strong> {assessmentData.communicationStyle}</p>
                  <p><strong>Collaboration Scale:</strong> {assessmentData.collaborationScale}/10</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                variant="outline" 
                onClick={prevSection}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Edit
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Complete Assessment'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Founder Assessment</h1>
            <Badge variant="outline">{currentSection}/8</Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentSection / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {sections.map((section) => {
            const IconComponent = section.icon;
            const isActive = currentSection === section.id;
            const isCompleted = currentSection > section.id;
            
            return (
              <Button
                key={section.id}
                variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentSection(section.id)}
                className="flex flex-col items-center p-3 h-auto text-xs"
              >
                <IconComponent className="w-4 h-4 mb-1" />
                <span className="hidden sm:block">{section.title.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>

        {/* Current Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              {React.createElement(sections[currentSection - 1].icon, { className: "w-6 h-6 text-blue-600" })}
              <div>
                <CardTitle>{sections[currentSection - 1].title}</CardTitle>
                <p className="text-sm text-gray-600">{sections[currentSection - 1].description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {renderSection()}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentSection < 7 && (
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={prevSection}
              disabled={currentSection === 1}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button 
              onClick={nextSection}
              className="flex-1"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}