
import React from 'react';
import { formatTime } from '../../utils/examUtils';
import { Clock } from 'lucide-react';

interface CompactTimerProps {
  remainingTime: number;
}

const CompactTimer: React.FC<CompactTimerProps> = ({ remainingTime }) => {
  const isLowTime = remainingTime <= 300; // 5 minutes

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
      isLowTime ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
    }`}>
      <Clock className="w-4 h-4" />
      <span className={`font-mono font-bold text-sm ${
        isLowTime ? 'text-red-600' : 'text-green-600'
      }`}>
        {formatTime(remainingTime)}
      </span>
    </div>
  );
};

export default CompactTimer;
