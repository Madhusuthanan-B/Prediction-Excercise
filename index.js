async function loadData() {
    const houseSalesDataSet = tf.data.csv('http://127.0.0.1:5500/kc_house_data.csv');
    const pointsDataset = houseSalesDataSet.map(record => ({ x: record.sqft_living, y: record.price }));
    const points = await pointsDataset.toArray();
    if (points.length % 2 !== 0) {
        points.pop();
    }

    // Shuffle data before splitting into training and testing tests.
    // This is to ensure that we have a random selection of data
    // This will avoid patterns in order of data
    // Having a random order will avoid this problem
    tf.util.shuffle(points);
    plot(points, 'Square Feet');

    // Features (inputs)
    const featureValues = points.map(p => p.x);
    const featureTensor = tf.tensor2d(featureValues, [featureValues.length, 1]);

    // Labels (outputs)
    const labelValues = points.map(p => p.y);
    const labelTensor = tf.tensor2d(labelValues, [labelValues.length, 1]);

    const normalizedFeatureTensor = normalize(featureTensor);
    const normalizedLabelTensor = normalize(labelTensor);

    normalizedFeatureTensor.tensor.print();
    const [trainingFeatureTensor, testingFeatureTensor] = tf.split(normalizedFeatureTensor.tensor, 2);
    const [trainingLabelTensor, testingLabelTensor] = tf.split(normalizedLabelTensor.tensor, 2);

    trainingFeatureTensor.print(true);
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
    * Formula for min-max normqlization
    * x` = (x-min(x))/(max(x)-min(x))
    */
    const min = tensor.min();
    const max = tensor.max();
    const range = max.sub(min);
    const normalizedTensor = tensor.sub(min).div(range);
    return {
        tensor: normalizedTensor,
        min,
        max
    };
}

function deNormalize(tensor, min, max) {
    const range = max.sub(min);
    const deNormalizedTensor = tensor.mul(range).add(min);
    return deNormalizedTensor;
}

loadData();