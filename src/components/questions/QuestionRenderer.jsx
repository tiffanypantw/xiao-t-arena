import React from 'react';
import MultipleChoice from './MultipleChoice';
import FindDifferent from './FindDifferent';
import DragSort from './DragSort';
import DragClassify from './DragClassify';

export default function QuestionRenderer({ question, onAnswer }) {
  switch (question.type) {
    case 'drag_classify':
      return <DragClassify question={question} onAnswer={onAnswer} />;
    case 'multiple_choice':
      return <MultipleChoice question={question} onAnswer={onAnswer} />;
    case 'find_different':
      return <FindDifferent question={question} onAnswer={onAnswer} />;
    case 'drag_sort':
      return <DragSort question={question} onAnswer={onAnswer} />;
    default:
      return <DragClassify question={question} onAnswer={onAnswer} />;
  }
}