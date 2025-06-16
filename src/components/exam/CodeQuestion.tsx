
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Question } from '../../types/exam';
import { Play, Square, Save } from 'lucide-react';

interface CodeQuestionProps {
  question: Question;
  questionIndex: number;
  userAnswer?: any;
  onSaveAnswer: (questionIndex: number, answer: any) => void;
  onNextQuestion: () => void;
}

const CodeQuestion: React.FC<CodeQuestionProps> = ({
  question,
  questionIndex,
  userAnswer,
  onSaveAnswer,
  onNextQuestion
}) => {
  const [code, setCode] = useState<string>(userAnswer?.code || '');
  const [language, setLanguage] = useState<string>(userAnswer?.language || 'python');
  const [output, setOutput] = useState<string>(userAnswer?.output || '');
  const [isRunning, setIsRunning] = useState(false);

  const executeCode = async () => {
    setIsRunning(true);
    setOutput('Executing code...\n');

    try {
      // Simulate code execution (in a real app, this would call a backend service)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock output based on language
      let mockOutput = '';
      switch (language) {
        case 'python':
          mockOutput = 'Python code executed successfully!\nOutput: Hello, World!';
          break;
        case 'java':
          mockOutput = 'Java compilation successful!\nOutput: Hello, World!';
          break;
        case 'cpp':
          mockOutput = 'C++ compilation successful!\nOutput: Hello, World!';
          break;
        case 'javascript':
          mockOutput = 'JavaScript executed successfully!\nOutput: Hello, World!';
          break;
        default:
          mockOutput = 'Code executed successfully!';
      }
      
      setOutput(prev => prev + mockOutput);
    } catch (error) {
      setOutput(prev => prev + `Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
  };

  const handleSave = () => {
    const answer = {
      code,
      language,
      output
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

      <CardContent className="flex flex-col h-full space-y-4">
        {/* Language Selection */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Language:</span>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Code and Output Area */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {/* Code Editor */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Code Editor</h3>
              <div className="flex gap-2">
                <Button
                  onClick={executeCode}
                  disabled={isRunning}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-1" />
                  {isRunning ? 'Running...' : 'Run'}
                </Button>
                <Button
                  onClick={clearOutput}
                  size="sm"
                  variant="outline"
                >
                  <Square className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`Write your ${language} code here...`}
              className="flex-1 font-mono text-sm resize-none bg-gray-900 text-green-400 border-gray-600"
              style={{ minHeight: '400px' }}
            />
          </div>

          {/* Output */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-700 mb-2">Output</h3>
            <div className="flex-1 bg-gray-900 text-green-400 p-4 rounded border font-mono text-sm whitespace-pre-wrap overflow-auto">
              {output || 'Output will appear here...'}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Code
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export default CodeQuestion;
