import React from 'react';
import { Question } from '../../types/exam';
import MCQQuestion from './MCQQuestion';
import WrittenQuestion from './WrittenQuestion';
import CodeQuestion from './CodeQuestion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestionContentProps {
  question: Question;
  questionIndex: number;
  userAnswer?: any;
  onSaveAnswer: (questionIndex: number, answer: any) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  totalQuestions: number;
}

const QuestionContent: React.FC<QuestionContentProps> = ({
  question,
  questionIndex,
  userAnswer,
  onSaveAnswer,
  onNextQuestion,
  onPreviousQuestion,
  totalQuestions
}) => {
  let questionElement;

  if (question.type.toLowerCase().includes('mcq')) {
    questionElement = (
      <MCQQuestion
        question={question}
        questionIndex={questionIndex}
        userAnswer={userAnswer}
        onSaveAnswer={onSaveAnswer}
        onNextQuestion={onNextQuestion}
      />
    );
  } else if (question.type.toLowerCase().includes('written')) {
    questionElement = (
      <WrittenQuestion
        question={question}
        questionIndex={questionIndex}
        userAnswer={userAnswer}
        onSaveAnswer={onSaveAnswer}
        onNextQuestion={onNextQuestion}
      />
    );
  } else if (question.type.toLowerCase().includes('program')) {
    questionElement = (
      <CodeQuestion
        question={question}
        questionIndex={questionIndex}
        userAnswer={userAnswer}
        onSaveAnswer={onSaveAnswer}
        onNextQuestion={onNextQuestion}
      />
    );
  } else {
    questionElement = <div>Unsupported question type</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <Button
          onClick={onPreviousQuestion}
          disabled={questionIndex === 0}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <span className="text-sm font-medium text-gray-600">
          Question {questionIndex + 1} of {totalQuestions}
        </span>

        <Button
          onClick={onNextQuestion}
          disabled={questionIndex === totalQuestions - 1}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Question Content */}
      <div className="flex-1">
        {questionElement}
      </div>
    </div>
  );
};

export default QuestionContent;

