"use client";
import React from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts, { ChartObject } from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import Widgets from "fusioncharts/fusioncharts.widgets";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

// Register FusionCharts components
if (typeof window !== "undefined") {
  ReactFC.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);
}

interface GaugeChartProps {
  value: number;
  label: string;
}

const GaugeChart = ({ value, label }: GaugeChartProps) => {
  const chartConfigs: ChartObject = {
    type: "angulargauge",
    dataFormat: "json",
    width: 300,
    height: 200,
    dataSource: {
      chart: {
        theme: "umber",
        lowerLimit: "0",
        upperLimit: "100",
        numbersuffix: "%",
        showValue: "1",
        bgAlpha: "0",
        canvasBgAlpha: "0",
        showBorder: "0",
        showCanvasBorder: "0",
        canvasBgColor: "transparent",
        gaugeStartAngle: "180",
        gaugeEndAngle: "0",
        showGaugeBorder: "0",
        gaugeBorderAlpha: "80",
        gaugeInnerRadius: "90",
        pivotRadius: "13",
        pivotFillColor: "#22558b",
        pivotFillAlpha: "100",
        pivotBorderColor: "#22558b",
        pivotBorderThickness: "0",
        showPivotBorder: "0",
        valueFontSize: "0",
        showTickMarks: "0",
        showTickValues: "0",
        showLimits: "0",
        majorTMNumber: "0",
        minorTMNumber: "0",
        tickValueDistance: "0",
        tickValueAlpha: "0",
        tickMarkDistance: "0",
        tickMarkAlpha: "0",
        baseFontColor: "#333",
        baseFont: "Arial",
        baseFontSize: "12",
        baseFontBold: "0",
        toolTipColor: "#ffffff",
        toolTipBorderThickness: "0",
        toolTipBgColor: "#000000",
        toolTipBgAlpha: "80",
        toolTipBorderColor: "#000000",
        toolTipBorderAlpha: "0",
        toolTipPadding: "5",
        showToolTip: "0",
      },
      colorRange: {
        color: [
          {
            minValue: "0",
            maxValue: "33",
            code: "#FFD700", // Yellow - Buyer's Market
          },
          {
            minValue: "34",
            maxValue: "66",
            code: "#14b514", // Green - Balanced
          },
          {
            minValue: "67",
            maxValue: "100",
            code: "#ff0000", // Red - Seller's Market
          },
        ],
      },
      dials: {
        dial: [
          {
            value: value.toString(),
            tooltext: label,
            bgColor: "#22558b",
            borderColor: "#22558b",
            baseWidth: "10",
            topWidth: "2",
            rearExtension: "3",
            radius: "100",
          },
        ],
      },
    },
  };

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {React.createElement(ReactFC as any, chartConfigs)}
    </>
  );
};

export default GaugeChart;
