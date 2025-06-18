
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

  const contentHeight = 'calc(100vh - 250px)';

  return (
    <div className="h-full flex flex-col">
      {/* Question Header - Compact */}
      <div className="flex-shrink-0 p-4 border-b">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Question {questionIndex + 1}: {question.content}
        </h2>
      </div>

      {/* Tabs and Content - Fill Remaining Space */}
      <div className="flex-1 flex flex-col p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4 flex-shrink-0">
            <TabsTrigger value="text">Type Answer</TabsTrigger>
            <TabsTrigger value="draw">Draw Answer</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="flex-1 flex flex-col">
            <ScrollArea 
              className="flex-1 border-2 border-gray-300 rounded-lg"
              style={{ height: contentHeight }}
            >
              <Textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-full p-4 border-0 resize-none focus:ring-0 focus:outline-none"
                style={{ minHeight: '800px' }}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="draw" className="flex-1 flex flex-col">
            <div 
              className="flex-1"
              style={{ height: contentHeight }}
            >
              <EnhancedDrawingCanvas
                onDataChange={setDrawingData}
                initialData={drawingData}
                containerHeight={contentHeight}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button - Fixed at Bottom */}
        <div className="flex-shrink-0 mt-4">
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
