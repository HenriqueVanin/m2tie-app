import { useRef } from "react";

type EChartsInstance = {
  getDataURL: (opts: any) => string;
  getRenderedCanvas: (opts: any) => HTMLCanvasElement;
};

export function useEchartsExport() {
  const chartsRef = useRef<EChartsInstance[]>([]);

  // Registrar instâncias dos gráficos
  const registerChart = (index: number, chartInstance: EChartsInstance) => {
    chartsRef.current[index] = chartInstance;
  };

  // Exportar um gráfico individual
  const exportSingle = (index: number) => {
    const chart = chartsRef.current[index];
    if (!chart) return;

    const url = chart.getDataURL({
      type: "png",
      pixelRatio: 2,
      backgroundColor: "#fff",
    });

    const link = document.createElement("a");
    link.download = `chart-${index}.png`;
    link.href = url;
    link.click();
  };

  // Exportar todos separadamente
  const exportAll = () => {
    chartsRef.current.forEach((_, i) => exportSingle(i));
  };

  // Exportar todos em uma única imagem
  const exportCombined = () => {
    const charts = chartsRef.current.filter(Boolean);
    if (charts.length === 0) return;

    // pega um canvas renderizado por chart
    const canvases = charts.map((chart) =>
      chart.getRenderedCanvas({ pixelRatio: 2 })
    );

    // largura = maior largura entre os canvas
    const width = Math.max(...canvases.map((c) => c.width));
    // altura = soma das alturas
    const height = canvases.reduce((sum, c) => sum + c.height, 0);

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = width;
    finalCanvas.height = height;

    const ctx = finalCanvas.getContext("2d");
    if (!ctx) return;

    let offset = 0;
    canvases.forEach((canvas) => {
      ctx.drawImage(canvas, 0, offset);
      offset += canvas.height;
    });

    const link = document.createElement("a");
    link.download = "combined.png";
    link.href = finalCanvas.toDataURL("image/png");
    link.click();
  };

  return {
    registerChart,
    exportSingle,
    exportAll,
    exportCombined,
  };
}
