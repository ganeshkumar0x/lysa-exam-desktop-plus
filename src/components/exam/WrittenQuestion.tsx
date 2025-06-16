
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Question } from '../../types/exam';
import DrawingCanvas from './DrawingCanvas';

interface WrittenQuestionProps {
  question: Question;
  questionIndex: number;
  userAnswer?: any;
  onSaveAnswer: (questionIndex: number, answer: any) => void;
  onNextQuestion: () => void;
}

const WrittenQuestion: React.FC<WrittenQuestionProps> = ({
  question,
  questionIndex,
  userAnswer,
  onSaveAnswer,
  onNextQuestion
}) => {
  const [textAnswer, setTextAnswer] = useState<string>(userAnswer?.text || '');
  const [drawingData, setDrawingData] = useState(userAnswer?.drawing || null);
  const [activeTab, setActiveTab] = useState<string>('text');

  const handleSave = () => {
    const answer = {
      text: textAnswer,
      drawing: drawingData,
      mode: activeTab
    };
    onSaveAnswer(questionIndex, answer);
    onNextQuestion();
  };

  return (
    <div className="h-full p-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">
          Question {questionIndex + 1}: {question.content}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Type Answer</TabsTrigger>
            <TabsTrigger value="draw">Draw Answer</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="flex-1 mt-4">
            <Textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none"
            />
          </TabsContent>

          <TabsContent value="draw" className="flex-1 mt-4">
            <DrawingCanvas
              onDataChange={setDrawingData}
              initialData={drawingData}
            />
          </TabsContent>
        </Tabs>

        <div className="pt-6">
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            Save Answer
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export default WrittenQuestion;
