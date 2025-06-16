
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import NavigationPanel from './exam/NavigationPanel';
import QuestionContent from './exam/QuestionContent';
import { Question, UserAnswer, CompletionStatus } from '../types/exam';
import { loadSampleQuestions } from '../utils/examUtils';

const ExamApp = () => {
  const [questions] = useState<Question[]>(loadSampleQuestions());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus>({});
  const [userAnswers, setUserAnswers] = useState<UserAnswer>({});
  const [remainingTime, setRemainingTime] = useState(1800); // 30 minutes
  const [navPanelVisible, setNavPanelVisible] = useState(true);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmitExam = () => {
    console.log('Exam submitted:', userAnswers);
    alert('Exam submitted successfully!');
  };

  const markQuestionComplete = (index: number) => {
    setCompletionStatus(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const saveAnswer = (questionIndex: number, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
    markQuestionComplete(questionIndex);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Navigation Panel */}
      {navPanelVisible && (
        <div className="w-80 border-r border-gray-200">
          <NavigationPanel
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            completionStatus={completionStatus}
            remainingTime={remainingTime}
            onQuestionSelect={setCurrentQuestionIndex}
            onSubmitExam={handleSubmitExam}
          />
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setNavPanelVisible(!navPanelVisible)}
        className="fixed left-80 top-12 z-10 bg-blue-600 text-white px-2 py-4 rounded-r-md shadow-lg hover:bg-blue-700 transition-colors"
        style={{ left: navPanelVisible ? '320px' : '0px' }}
      >
        {navPanelVisible ? '◀' : '▶'}
      </button>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Card className="h-full bg-white shadow-lg rounded-lg">
          <QuestionContent
            question={questions[currentQuestionIndex]}
            questionIndex={currentQuestionIndex}
            userAnswer={userAnswers[currentQuestionIndex]}
            onSaveAnswer={saveAnswer}
            onNextQuestion={goToNextQuestion}
          />
        </Card>
      </div>
    </div>
  );
};

export default ExamApp;
