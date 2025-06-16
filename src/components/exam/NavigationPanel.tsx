
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question, CompletionStatus } from '../../types/exam';
import { formatTime } from '../../utils/examUtils';
import { Clock } from 'lucide-react';

interface NavigationPanelProps {
  questions: Question[];
  currentQuestionIndex: number;
  completionStatus: CompletionStatus;
  remainingTime: number;
  onQuestionSelect: (index: number) => void;
  onSubmitExam: () => void;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({
  questions,
  currentQuestionIndex,
  completionStatus,
  remainingTime,
  onQuestionSelect,
  onSubmitExam
}) => {
  const answeredCount = Object.keys(completionStatus).length;
  const remainingCount = questions.length - answeredCount;

  const mcqCount = questions.filter(q => q.type.toLowerCase().includes('mcq')).length;
  const writtenCount = questions.filter(q => q.type.toLowerCase().includes('written')).length;
  const codeCount = questions.filter(q => q.type.toLowerCase().includes('program')).length;

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-lg font-bold text-gray-800">Question Navigator</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-4 space-y-4">
        {/* Status Section */}
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{answeredCount}</div>
            <div className="text-xs text-gray-600">Answered</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-600">{remainingCount}</div>
            <div className="text-xs text-gray-600">Remaining</div>
          </div>
        </div>

        {/* Question Grid */}
        <div className="grid grid-cols-5 gap-2">
          {questions.map((_, index) => {
            let bgColor = 'bg-gray-200 text-gray-700';
            if (index === currentQuestionIndex) {
              bgColor = 'bg-blue-500 text-white';
            } else if (completionStatus[index]) {
              bgColor = 'bg-green-500 text-white';
            }

            return (
              <button
                key={index}
                onClick={() => onQuestionSelect(index)}
                className={`w-8 h-8 rounded text-sm font-semibold transition-colors hover:opacity-80 ${bgColor}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {/* Status Legend */}
        <Card className="bg-gray-50">
          <CardContent className="p-3">
            <div className="text-sm font-semibold text-gray-700 mb-2">Status:</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 rounded"></div>
                <span className="text-gray-600">Not answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-gray-600">Current</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Legend */}
        <Card className="bg-gray-50">
          <CardContent className="p-3">
            <div className="text-sm font-semibold text-gray-700 mb-2">Question Types:</div>
            <div className="space-y-1 text-xs">
              {mcqCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600">MCQ Questions</span>
                  <span className="font-semibold">{mcqCount}</span>
                </div>
              )}
              {writtenCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-yellow-600">Written Questions</span>
                  <span className="font-semibold">{writtenCount}</span>
                </div>
              )}
              {codeCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-red-600">Code Questions</span>
                  <span className="font-semibold">{codeCount}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Timer */}
        <Card className={`${remainingTime <= 60 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <CardContent className="p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <div className={`text-2xl font-mono font-bold ${remainingTime <= 60 ? 'text-red-600' : 'text-green-600'}`}>
              {formatTime(remainingTime)}
            </div>
          </CardContent>
        </Card>
      </CardContent>

      {/* Submit Button */}
      <div className="p-4 border-t border-gray-100">
        <Button
          onClick={onSubmitExam}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          Submit & View Results
        </Button>
      </div>
    </div>
  );
};

export default NavigationPanel;
