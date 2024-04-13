// Assuming you have data for each month's expenses
const monthlyExpenses = [
  { month: "Jan", expenses: [10000, 5000] },
  { month: "Feb", expenses: [7000, 3000] },
  { month: "Mar", expenses: [6000, 5000] },
  // Add expenses for other months similarly
];

// Calculate the total expenses for each month
const totalExpenses = monthlyExpenses.map((monthData) => {
  const total = monthData.expenses.reduce((acc, expense) => acc + expense, 0);
  return { month: monthData.month, total: total };
});

options = {
  colors: ["#1A56DB", "#FF0060", "#00DFA2"],
  series: [
    {
      name: "Total Expenses",
      data: totalExpenses.map((item) => item.total),
    },
  ],
  chart: {
    type: "bar",
    height: "290px",
    fontFamily: "Inter, sans-serif",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      distributed: true,
      horizontal: false,
      columnWidth: "70%",
      borderRadiusApplication: "end",
      borderRadius: 8,
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
    style: {
      fontFamily: "Inter, sans-serif",
    },
  },
  states: {
    hover: {
      filter: {
        type: "darken",
        value: 1,
      },
    },
  },
  stroke: {
    show: true,
    width: 0,
    colors: ["transparent"],
  },
  grid: {
    show: false,
    strokeDashArray: 4,
    padding: {
      left: 2,
      right: 2,
      top: -14,
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  xaxis: {
    categories: totalExpenses.map((item) => item.month), // Set x-axis categories as months
    labels: {
      show: true,
      style: {
        fontFamily: "Inter, sans-serif",
        cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
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
  fill: {
    opacity: 1,
  },
};

if (
  document.getElementById("column-chart") &&
  typeof ApexCharts !== "undefined"
) {
  const chart = new ApexCharts(
    document.getElementById("column-chart"),
    options
  );
  chart.render();
}
