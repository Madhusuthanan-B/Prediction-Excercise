async function loadData() {
    const houseSalesDataSet = tf.data.csv('http://127.0.0.1:5500/kc_house_data.csv');
    const top10Data = houseSalesDataSet.take(10);
    const dataArray = await top10Data.toArray();
    console.log(dataArray);
}

loadData();