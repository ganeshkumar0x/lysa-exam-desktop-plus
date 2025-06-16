
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '../../types/exam';
import { parseMCQOptions } from '../../utils/examUtils';

interface MCQQuestionProps {
  question: Question;
  questionIndex: number;
  userAnswer?: string;
  onSaveAnswer: (questionIndex: number, answer: string) => void;
  onNextQuestion: () => void;
}

const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  questionIndex,
  userAnswer,
  onSaveAnswer,
  onNextQuestion
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(userAnswer || '');
  const questionText = question.content.split('\n')[0];
  const options = parseMCQOptions(question.content);

  useEffect(() => {
    setSelectedAnswer(userAnswer || '');
  }, [userAnswer]);

  const handleSave = () => {
    if (selectedAnswer) {
      onSaveAnswer(questionIndex, selectedAnswer);
      onNextQuestion();
    }
  };

  return (
    <div className="h-full p-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">
          Question {questionIndex + 1}: {questionText}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {options.map((option, index) => (
            <label
              key={index}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                name={`question-${questionIndex}`}
                value={option[0]}
                checked={selectedAnswer === option[0]}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>

        <div className="pt-6">
          <Button
            onClick={handleSave}
            disabled={!selectedAnswer}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            Save Answer
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export default MCQQuestion;
