import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import QuestionChart from "./QuestionChart";

interface Props {
  questionsAnalysis: any[];
  registerChart: (index: number, chart: echarts.ECharts) => void;
}

export function ChartsGrid({ questionsAnalysis, registerChart }: Props) {
  // stable array of container elements
  const containerRefs = useRef<Array<HTMLDivElement | null>>([]);
  // store echarts instances so we can reuse/dispose
  const chartInstances = useRef<Array<echarts.ECharts | null>>([]);

  useEffect(() => {
    // ensure arrays length
    containerRefs.current.length = questionsAnalysis.length;
    chartInstances.current.length = questionsAnalysis.length;

    questionsAnalysis.forEach((question, idx) => {
      const container = containerRefs.current[idx];
      if (!container) return;

      // reuse existing instance if present
      let chart = chartInstances.current[idx];
      if (!chart) {
        chart = echarts.init(container, undefined, { renderer: "canvas" });
        chartInstances.current[idx] = chart;
      }

      const baseOption: any = {
        title: { text: question.title, left: "center" },
        tooltip: {},
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
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
            xAxis: {
              type: "category",
              data: scaleData.map(([v]) => v),
              name: "Escala",
            },
            yAxis: { type: "value", name: "Quantidade" },
            series: [
              {
                name: "Respostas",
                type: "bar",
                data: scaleData.map(([_, c]) => c),
                itemStyle: { color: "#10b981", borderRadius: [8, 8, 0, 0] },
                label: { show: true, position: "top" },
              },
            ],
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
            tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
            legend: { orient: "vertical", left: "left" },
            series: [
              {
                name: "Respostas",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: "#fff",
                  borderWidth: 2,
                },
                label: { show: true, formatter: "{b}: {d}%" },
                emphasis: {
                  label: { show: true, fontSize: 16, fontWeight: "bold" },
                },
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
            xAxis: { type: "value", name: "Quantidade" },
            yAxis: {
              type: "category",
              data: checkboxData.map(([o]) => o),
              axisLabel: {
                interval: 0,
                formatter: (s: string) =>
                  s.length > 20 ? s.substring(0, 20) + "..." : s,
              },
            },
            series: [
              {
                name: "Seleções",
                type: "bar",
                data: checkboxData.map(([_, c]) => c),
                itemStyle: { color: "#8b5cf6", borderRadius: [0, 8, 8, 0] },
                label: { show: true, position: "right" },
              },
            ],
          };
          break;
        default:
          break;
      }

      if (option && chart) {
        chart.setOption(option);
        registerChart(idx, chart);
      }
    });

    // cleanup: dispose charts beyond current length
    return () => {
      chartInstances.current.forEach((c, i) => {
        if (c && !questionsAnalysis[i]) {
          try {
            c.dispose();
          } catch (e) {
            // ignore
          }
          chartInstances.current[i] = null;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsAnalysis]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {questionsAnalysis.map((question, idx) => (
        <QuestionChart
          key={question.questionId}
          question={question}
          ref={(el: HTMLDivElement | null) => {
            containerRefs.current[idx] = el;
          }}
        />
      ))}
    </div>
  );
}

export default ChartsGrid;
