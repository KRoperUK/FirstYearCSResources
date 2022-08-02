const y1s2_assessment_data = "data/y1s2_sa.csv";
const myDate = new Date();

/**
 * 
 * @param {string} str 
 * @param {string} delimiter 
 * @returns array
 */
function csvToArray(str, delimiter = ",") {
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });
  arr.forEach(function (element) {
    element['"Released"'] = new Date(element['"Released"'].replaceAll('"', ''));
    element['"Due"'] = new Date(element['"Due"'].replaceAll('"', ''));

    if (!(new Date(element['"Marking Deadline"'].replaceAll('"', '')) == "Invalid Date")) {
      element['"Marking Deadline"'] = new Date(element['"Marking Deadline"'].replaceAll('"', ''));
    }

    if (element['"Released"'] == "Invalid Date" || element['"Due"'] == "Invalid Date") {
      element.Status = "Unknown";
      if (element['"Released"'] == "Invalid Date") {
        element['"Released"'] = "Unknown";
      }
      if (element['"Due"'] == "Invalid Date") {
        element['"Due"'] = "Unknown";
      }
    } else {
      currentTime = myDate.getTime();
      releaseTime = element['"Released"'].getTime();
      dueTime = element['"Due"'].getTime();

      if (currentTime < releaseTime) {
        element.Status = "Not Released";
      } if (currentTime > releaseTime && currentTime < dueTime) {
        element.Status = "Open";
      } if (currentTime > dueTime) {
        element.Status = "Closed";
      }
    }
  })
  return arr;
}

/**
 * 
 * @param {string} filePath 
 * @returns array
 */
function loadFile(filePath) {
  var result = null;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", filePath, false);
  xmlHttp.send();
  if (xmlHttp.status == 200) {
    result = csvToArray(xmlHttp.responseText);
  }
  return result;
}

data = loadFile(y1s2_assessment_data);
console.table(data);

var s = data;
var cols = [];
for (var k in s) {
  for (var c in s[k]) {
    if (cols.indexOf(c)===-1) cols.push(c);
  }
}
var html = '<table class=tftable><thead><tr>'+
    cols.map(function(c){ return '<th>'+c+'</th>' }).join('')+
    '</tr></thead><tbody>';
for (var l in s) {
  html += '<tr>'+cols.map(function(c){ return '<td>'+(s[l][c]||'')+'</td>' }).join('')+'</tr>';
}
html += '</tbody></table>';

document.getElementById("y1s2-table").innerHTML += html;
