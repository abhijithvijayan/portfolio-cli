const ts = Date.now();

const date_ob = new Date(ts);
const date = date_ob.getDate();
const month = date_ob.getMonth() + 1;
const year = date_ob.getFullYear();

module.exports = `${date}-${month}-${year}`;
