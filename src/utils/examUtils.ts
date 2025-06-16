
import { Question } from '../types/exam';

export const loadSampleQuestions = (): Question[] => {
  return [
    {
      type: "MCQ",
      content: "What is the capital of France?\nA) London\nB) Paris\nC) Rome\nD) Berlin"
    },
    {
      type: "Written Test",
      content: "Explain the concept of object-oriented programming and its key principles. Discuss encapsulation, inheritance, and polymorphism with examples."
    },
    {
      type: "Program Question",
      content: "Write a function to find the factorial of a number using recursion.\n\nRequirements:\n- Function should handle edge cases (negative numbers, zero)\n- Include proper error handling\n- Test with multiple inputs"
    },
    {
      type: "MCQ",
      content: "Which of the following is NOT a programming language?\nA) Python\nB) Java\nC) HTML\nD) C++"
    },
    {
      type: "Written Test",
      content: "Describe the differences between SQL and NoSQL databases. Include advantages and disadvantages of each approach."
    },
    {
      type: "Program Question",
      content: "Write a Python function to implement binary search algorithm.\n\nRequirements:\n- Function should work on sorted arrays\n- Return the index of the element if found, -1 if not found\n- Handle edge cases (empty array, single element)"
    }
  ];
};

export const parseMCQOptions = (content: string): string[] => {
  const lines = content.split('\n');
  const options: string[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && line.length > 3 && line[1] === ')') {
      options.push(line);
    }
  }
  
  return options;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
