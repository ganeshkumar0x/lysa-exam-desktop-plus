
import React from 'react';
import { Circle, Square, Timer } from 'lucide-react';

interface QuestionTypeBadgeProps {
  questionType: string;
  isCompleted: boolean;
  size?: 'sm' | 'md';
}

const QuestionTypeBadge: React.FC<QuestionTypeBadgeProps> = ({ 
  questionType, 
  isCompleted, 
  size = 'sm' 
}) => {
  const getTypeInfo = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('mcq')) {
      return { 
        label: 'MCQ', 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: Circle
      };
    }
    if (lowerType.includes('written')) {
      return { 
        label: 'Written', 
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: Square
      };
    }
    if (lowerType.includes('program')) {
      return { 
        label: 'Code', 
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: Timer
      };
    }
    return { 
      label: 'Other', 
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: Circle
    };
  };

  const typeInfo = getTypeInfo(questionType);
  const Icon = typeInfo.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1';

  return (
    <div className="flex items-center gap-1">
      <span className={`inline-flex items-center gap-1 rounded border font-medium ${typeInfo.color} ${sizeClasses}`}>
        <Icon className="w-3 h-3" />
        {typeInfo.label}
      </span>
      {isCompleted && (
        <div className="w-2 h-2 bg-green-500 rounded-full" title="Completed" />
      )}
    </div>
  );
};

export default QuestionTypeBadge;
