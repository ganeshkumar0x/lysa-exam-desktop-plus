
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Question, CompletionStatus } from '../../types/exam';
import QuestionTypeBadge from './QuestionTypeBadge';

interface NavigationPanelProps {
  questions: Question[];
  currentQuestionIndex: number;
  completionStatus: CompletionStatus;
  onQuestionSelect: (index: number) => void;
  onSubmitExam: () => void;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({
  questions,
  currentQuestionIndex,
  completionStatus,
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

      <CardContent className="flex-1 p-4 flex flex-col space-y-4">
        {/* 1. Status Section - Answered/Remaining */}
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

        {/* 2. Question Types Summary */}
        <Card className="bg-gray-50">
          <CardContent className="p-3">
            <div className="text-sm font-semibold text-gray-700 mb-2">Summary:</div>
            <div className="space-y-1 text-xs">
              {mcqCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-blue-600">MCQ Questions</span>
                  <span className="font-semibold">{mcqCount}</span>
                </div>
              )}
              {writtenCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600">Written Questions</span>
                  <span className="font-semibold">{writtenCount}</span>
                </div>
              )}
              {codeCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-purple-600">Code Questions</span>
                  <span className="font-semibold">{codeCount}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 3. Submit Button */}
        <Button
          onClick={onSubmitExam}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          Submit & View Results
        </Button>

        {/* 4. Questions List with Scrollbar */}
        <div className="flex-1 flex flex-col">
          <div className="text-sm font-semibold text-gray-700 mb-2">Questions:</div>
          <ScrollArea className="flex-1 border border-gray-200 rounded-lg">
            <div className="p-2 space-y-2">
              {questions.map((question, index) => {
                let bgColor = 'bg-gray-50 border-gray-200';
                if (index === currentQuestionIndex) {
                  bgColor = 'bg-blue-50 border-blue-300';
                } else if (completionStatus[index]) {
                  bgColor = 'bg-green-50 border-green-300';
                }

                return (
                  <div
                    key={index}
                    onClick={() => onQuestionSelect(index)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${bgColor}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">Q{index + 1}</span>
                      <QuestionTypeBadge 
                        questionType={question.type}
                        isCompleted={!!completionStatus[index]}
                      />
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2">
                      {question.content.substring(0, 60)}...
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </div>
  );
};

export default NavigationPanel;
