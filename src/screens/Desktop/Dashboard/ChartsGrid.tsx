import React from "react";
import { QuestionChart } from "./QuestionChart";

interface Props {
  questionsAnalysis: any[];
}

export function ChartsGrid({ questionsAnalysis }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {questionsAnalysis.map((question) => (
        <QuestionChart key={question.questionId} question={question} />
      ))}
    </div>
  );
}

export default ChartsGrid;
