
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Question } from '../../types/exam';
import EnhancedDrawingCanvas from './EnhancedDrawingCanvas';

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
  const [activeTab, setActiveTab] = useState<string>(userAnswer?.mode || 'text');

  // Sync states when question changes
  useEffect(() => {
    setTextAnswer(userAnswer?.text || '');
    setDrawingData(userAnswer?.drawing || null);
    setActiveTab(userAnswer?.mode || 'text');
  }, [questionIndex, userAnswer]);

  // Auto-save functionality
  useEffect(() => {
    const answer = {
      text: textAnswer,
      drawing: drawingData,
      mode: activeTab
    };
    onSaveAnswer(questionIndex, answer);
  }, [textAnswer, drawingData, activeTab, questionIndex, onSaveAnswer]);

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
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Question {questionIndex + 1}: {question.content}
        </h2>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="text">Type Answer</TabsTrigger>
            <TabsTrigger value="draw">Draw Answer</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 border-2 border-gray-300 rounded-lg">
              <Textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[600px] p-4 border-0 resize-none focus:ring-0 focus:outline-none"
                style={{ minHeight: 'calc(100vh - 300px)' }}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="draw" className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-0">
              <EnhancedDrawingCanvas
                onDataChange={setDrawingData}
                initialData={drawingData}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex-shrink-0">
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            Save Answer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WrittenQuestion;
