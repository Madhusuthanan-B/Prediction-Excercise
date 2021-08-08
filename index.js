async function loadData() {
    const houseSalesDataSet = tf.data.csv('http://127.0.0.1:5500/kc_house_data.csv');
    // const top10Data = houseSalesDataSet.take(10);
    const points = houseSalesDataSet.map(record => ({ x: record.sqft_living, y: record.price }));
    // const dataArray = await points.toArray();
    // console.log(dataArray);
    plot(await points.toArray(), 'Square Feet')

}

async function plot(pointsArray, featureName) {
    const surface = { name: `${featureName} vs House Price`, tab: 'Charts' };
    const series = ['original'];
    const data = { values: [pointsArray], series };
    const labels = { xLabel: featureName, yLabel: 'Price' };
    tfvis.render.scatterplot(surface, data, labels);
}

loadData();