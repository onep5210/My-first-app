getData();

const sort = [];

document.getElementById('time').addEventListener('click', event => {
    sortData((a, b) => a.time - b.time);
  });

function sortData(compare) {
    console.log(sort)
    for (let item of sort) {
      item.elt.remove();
    }
    sort.sort(compare);
    for (let item of sort) {
      document.body.append(item.elt);
    }
  }


async function getData() {
    const response = await fetch("/api");
    const data = await response.json();

    for (let item of data) {
        const root = document.createElement("div");
        const anything = document.createElement("div");
        const geo = document.createElement("div");
        const date = document.createElement("div");
        const image = document.createElement("img");
        

        anything.textContent = `Anything: ${item.anything}`;
        geo.textContent = `${item.lat},${item.lon}`;
        const dateString = new Date(item.timestamp).toLocaleString();
        date.textContent = dateString;
        image.src = "../image/" + item.filename;
        image.alt = "img";

        root.append(anything, geo, date, image);
        console.log (root)

        sort.push({elt: root, time: item.timestamp})
        document.body.append(root);
    }
    console.log(data);
}