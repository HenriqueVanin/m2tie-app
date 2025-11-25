import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import QuestionChart from "./QuestionChart";

interface Props {
  questionsAnalysis: any[];
  registerChart: (index: number, chart: echarts.ECharts) => void;
}

export function ChartsGrid({ questionsAnalysis, registerChart }: Props) {
  const chartRefs = questionsAnalysis.map(() => useRef<HTMLDivElement>(null));

  useEffect(() => {
    questionsAnalysis.forEach((question, idx) => {
      const ref = chartRefs[idx];
      if (!ref.current) return;
      const chart = echarts.init(ref.current, null, { renderer: "canvas" });

      // Build option similarly to QuestionChart logic (kept simple here)
      const baseOption: any = {
        title: { text: question.title, left: "center" },
        tooltip: {},
      };

      let option: any = null;
      switch (question.type) {
        case "scale":
          if (!question.distribution) break;
          const scaleData = Object.entries(question.distribution).sort(
            (a, b) => Number(a[0]) - Number(b[0])
          );
          option = {
            ...baseOption,
            xAxis: { type: "category", data: scaleData.map(([v]) => v) },
            yAxis: { type: "value" },
            series: [{ type: "bar", data: scaleData.map(([_, c]) => c) }],
          };
          break;
        case "multiple_choice":
        case "dropdown":
          if (!question.distribution) break;
          const choiceData = Object.entries(question.distribution).sort(
            (a, b) => (b[1] as number) - (a[1] as number)
          );
          option = {
            ...baseOption,
            series: [
              {
                type: "pie",
                data: choiceData.map(([n, v]) => ({ name: n, value: v })),
              },
            ],
          };
          break;
        case "checkbox":
          if (!question.distribution) break;
          const checkboxData = Object.entries(question.distribution).sort(
            (a, b) => (b[1] as number) - (a[1] as number)
          );
          option = {
            ...baseOption,
            xAxis: { type: "value" },
            yAxis: { type: "category", data: checkboxData.map(([o]) => o) },
            series: [{ type: "bar", data: checkboxData.map(([_, c]) => c) }],
          };
          break;
        default:
          break;
      }

      if (option) {
        chart.setOption(option);
        registerChart(idx, chart);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsAnalysis]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {questionsAnalysis.map((question, idx) => (
        <QuestionChart
          key={question.questionId}
          question={question}
          ref={chartRefs[idx]}
        />
      ))}
    </div>
  );
}

export default ChartsGrid;
