import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info } from "lucide-react";

type DisclaimerProps = {
  variant?: "warning" | "info";
  className?: string;
};

export function FinancingDisclaimer({ variant = "warning", className = "" }: DisclaimerProps) {
  const isWarning = variant === "warning";
  
  return (
    <Card className={`border-0 shadow-sm ${
      isWarning ? "bg-amber-50" : "bg-blue-50"
    } ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {isWarning ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          )}
          <div className="text-sm">
            <p className={`font-medium mb-1 ${
              isWarning ? "text-amber-800" : "text-blue-800"
            }`}>
              Information Only Platform
            </p>
            <p className={isWarning ? "text-amber-700" : "text-blue-700"}>
              This platform facilitates networking and information sharing only. We do not:
            </p>
            <ul className={`mt-2 space-y-1 text-xs ${
              isWarning ? "text-amber-700" : "text-blue-700"
            }`}>
              <li>• Provide investment advice or recommendations</li>
              <li>• Facilitate, process, or handle any financial transactions</li>
              <li>• Guarantee the accuracy of user-provided information</li>
              <li>• Act as a broker-dealer or investment adviser</li>
              <li>• Endorse any investment opportunities or participants</li>
            </ul>
            <p className={`mt-2 text-xs ${
              isWarning ? "text-amber-600" : "text-blue-600"
            }`}>
              All interactions, due diligence, and investment decisions are solely between users. 
              Please consult qualified professionals before making any investment decisions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FinancingTerms() {
  return (
    <div className="text-xs text-slate-500 mt-6 p-4 bg-slate-50 rounded-lg">
      <h4 className="font-medium text-slate-700 mb-2">Important Legal Information</h4>
      <div className="space-y-2">
        <p>
          <strong>No Investment Advice:</strong> Content on this platform is for informational purposes only 
          and should not be considered investment advice.
        </p>
        <p>
          <strong>User Responsibility:</strong> Users are solely responsible for verifying information, 
          conducting due diligence, and making investment decisions.
        </p>
        <p>
          <strong>Third-Party Content:</strong> We do not verify or endorse user-generated content, 
          company information, or investment opportunities.
        </p>
        <p>
          <strong>Professional Advice:</strong> Always consult with qualified legal, financial, and tax 
          professionals before making investment decisions.
        </p>
        <p>
          <strong>Risk Warning:</strong> All investments carry risk of loss. Past performance does not 
          guarantee future results.
        </p>
      </div>
    </div>
  );
}