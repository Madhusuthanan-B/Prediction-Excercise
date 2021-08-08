async function loadData() {
    const houseSalesDataSet = tf.data.csv('http://127.0.0.1:5500/kc_house_data.csv');
    const points = houseSalesDataSet.map(record => ({ x: record.sqft_living, y: record.price }));
    plot(await points.toArray(), 'Square Feet');

    // Features (inputs)
    const featureValues = await points.map(p => p.x).toArray();
    const featureTensor = tf.tensor2d(featureValues, [featureValues.length, 1]);

    // Labels (outputs)
    const labelValues = await points.map(p => p.y).toArray();
    const labelTensor = tf.tensor2d(labelValues, [labelValues.length, 1]);

    const normalizedFeatureTensor = normalize(featureTensor);
    const normalizedLabelTensor = normalize(labelTensor);
    
    // After normalization, the orignal values will be always between 0 and 1
    normalizedFeatureTensor.print();
    normalizedLabelTensor.print();

}

async function plot(pointsArray, featureName) {
    const surface = { name: `${featureName} vs House Price`, tab: 'Charts' };
    const series = ['original'];
    const data = { values: [pointsArray], series };
    const labels = { xLabel: featureName, yLabel: 'Price' };
    tfvis.render.scatterplot(surface, data, labels);
}


function normalize(tensor) {
    /*
    * Formula for min-max normilization
    * x` = (x-min(x))/(max(x)-min(x))
    */
    const min = tensor.min();
    const max = tensor.max();
    const normalizedTensor = tensor.sub(min).div(max.sub(min));
    return normalizedTensor;
}

loadData();