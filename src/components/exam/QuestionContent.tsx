
import React from 'react';
import { Question } from '../../types/exam';
import MCQQuestion from './MCQQuestion';
import WrittenQuestion from './WrittenQuestion';
import CodeQuestion from './CodeQuestion';

interface QuestionContentProps {
  question: Question;
  questionIndex: number;
  userAnswer?: any;
  onSaveAnswer: (questionIndex: number, answer: any) => void;
  onNextQuestion: () => void;
}

const QuestionContent: React.FC<QuestionContentProps> = ({
  question,
  questionIndex,
  userAnswer,
  onSaveAnswer,
  onNextQuestion
}) => {
  if (question.type.toLowerCase().includes('mcq')) {
    return (
      <MCQQuestion
        question={question}
        questionIndex={questionIndex}
        userAnswer={userAnswer}
        onSaveAnswer={onSaveAnswer}
        onNextQuestion={onNextQuestion}
      />
    );
  }

  if (question.type.toLowerCase().includes('written')) {
    return (
      <WrittenQuestion
        question={question}
        questionIndex={questionIndex}
        userAnswer={userAnswer}
        onSaveAnswer={onSaveAnswer}
        onNextQuestion={onNextQuestion}
      />
    );
  }

  if (question.type.toLowerCase().includes('program')) {
    return (
      <CodeQuestion
        question={question}
        questionIndex={questionIndex}
        userAnswer={userAnswer}
        onSaveAnswer={onSaveAnswer}
        onNextQuestion={onNextQuestion}
      />
    );
  }

  return <div>Unsupported question type</div>;
};

export default QuestionContent;
