let options = {
  chart: {
    height: "100%",
    maxWidth: "100%",
    type: "area",
    fontFamily: "Inter, sans-serif",
    dropShadow: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  fill: {
    type: "solid",
  },
  tooltip: {
    enabled: true,
    x: {
      show: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 3,
    curve: "smooth",
  },
  grid: {
    show: true,
    strokeDashArray: 4,
    padding: {
      left: 2,
      right: 2,
    },
  },
  series: [
    {
      name: "Total Collection",
      data: [50000, 30000, 50000, 14000, 70000, 75000],
      color: "#1A56DB",
    },
    {
      name: "Fee Collection",
      data: [30000, 20000, 60000, 70000, 50000, 90000],
      color: "#FF0060",
    },
  ],
  legend: {
    show: false,
  },
  xaxis: {
    categories: ["01 Feb", "02 Feb", "03 Feb", "04 Feb", "05 Feb", "06 Feb"],
    labels: {
      show: true,
      style: {
        cssClass: "text-xs font-normal fill-gray-500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
};

const lineChart = getElement("#line-chart");
const totalCollections = getElement("#total_collections");
const feeCollections = getElement("#fee_collections");

if (lineChart && typeof ApexCharts !== "undefined") {
  const chart = new ApexCharts(lineChart, options);
  totalCollections.textContent = `$ ${formattedNumber(
    options.series[0].data.reduce((total, number) => total + number, 0)
  )}`;

  feeCollections.textContent = `$ ${formattedNumber(
    options.series[1].data.reduce((total, number) => total + number, 0)
  )}`;

  chart.render();
}
