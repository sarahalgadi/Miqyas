const clonumbers = "<%= clohisto %>".split(',').map(Number);
const indirectres = "<%= indirecthisto %>".split(',').map(Number);
const directres = "<%= directhisto %>".split(',').map(Number);

const cloData = [];
for (let i = 0; i < clonumbers.length; i++) {
  const obj =
  {
    clo: "CLO " + clonumbers[i],
    directResult: directres[i],
    indirectResult: indirectres[i]
  };
  cloData.push(obj);
}

const cloLabels = cloData.map(item => item.clo);
const directResults = cloData.map(item => item.directResult);
const indirectResults = cloData.map(item => item.indirectResult);

const ctx = document.getElementById('assessmentChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: cloLabels,
    datasets: [
      {
        label: 'Direct Results',
        backgroundColor: 'rgba(21, 65, 110, 0.9)',
        borderColor: 'rgba(96, 137, 179)',
        borderWidth: 1,
        data: directResults,
      },
      {
        label: 'Indirect Results',
        backgroundColor: 'rgba(174, 183, 191, 0.8)',
        borderColor: 'rgba(225, 230, 235)',
        borderWidth: 1,
        data: indirectResults,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
;