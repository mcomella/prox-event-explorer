function getEvents(provider, page) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'events/' + provider + '?lat=41.892455&long=-87.63397&radius=1&page=' + page, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
      resolve(this.response);
    };
    xhr.send();
  });
}

function addEvents(response) {
  console.log('Adding Eventbrite page ' + response.pagination.page_number + '/' + response.pagination.page_count);

  let events = response.events;
  if (!events) {
    document.write("Error: " + JSON.stringify(response));
    return;
  }

  let list = document.getElementById('nav');
  for (let event of events) {
    let a = document.createElement('a');
    a.textContent = event.name.text;
    a.href = 'javascript:void(0);';
    a.onclick = () => loadEvent(event);
    let li = document.createElement('li');
    list.appendChild(a);
    list.appendChild(li);
  }
}

function loadEvent(event) {
  // Clear existing data.
  let data = document.getElementById('data');
  while (data.hasChildNodes()) {
    data.removeChild(data.lastChild);
  }

  for (let field in event) {
    let row = document.createElement('tr');
    let label = document.createElement('td');
    label.textContent = field;
    row.appendChild(label);
    let value = document.createElement('td');

    let text = event[field];
    if (text instanceof Object) {
      switch (field) {
      case 'name': text = text.text; break;
      case 'description': text = text.text; break;
      case 'start': text = text.local; break;
      case 'end': text = text.local; break;
      }
    }
    value.textContent = text;

    row.appendChild(value);
    data.appendChild(row);
  }
  console.log(event);
}

window.onload = () => {
  getEvents('eventbrite', 1).then(response => {
    addEvents(response);

    let pageCount = response.pagination.page_count;
    for (let i = 2; i <= pageCount; i++) {
      getEvents('eventbrite', i).then(addEvents);
    }
  });
};
