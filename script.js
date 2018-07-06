onload = function() {
  var theLinearGauge = new wijmo.gauge.LinearGauge('#theLinearGauge', {
    min: 0,
    max: 100,
    value: 50,
    showText: 'Value',
    isReadOnly: false,
    step: 10,
    valueChanged: function() {
      theRadialGauge.value = theLinearGauge.value;
      theBulletGraph.value = theLinearGauge.value;
    }
  });

  var theRadialGauge = new wijmo.gauge.RadialGauge('#theRadialGauge', {
    min: 0,
    max: 100,
    value: 50,
    showText: 'Value',
    isReadOnly: false,
    step: 10,
    valueChanged: function() {
      theLinearGauge.value = theRadialGauge.value;
      theBulletGraph.value = theRadialGauge.value;
    }
  });

  var theBulletGraph = new wijmo.gauge.BulletGraph('#theBulletGraph', {
    min: 0,
    max: 100,
    value: 50,
    isReadOnly: false,
    step: 10,
    showText: 'Value',
    valueChanged: function() {
      theLinearGauge.value = theBulletGraph.value;
      theRadialGauge.value = theBulletGraph.value;
    }
  });

  theLinearGauge.face.thickness = .5;
  theLinearGauge.pointer.thickness = .5;
  theRadialGauge.face.thickness = .15;
  theRadialGauge.pointer.thickness = .15;
  theBulletGraph.face.thickness = .05;
  theBulletGraph.pointer.thickness = .5;

  // generate some random data
  var countries = 'US,Germany,UK,Japan,Italy,Greece'.split(','),
      data = [];
  for (var i = 0; i < 200; i++) {
    data.push({
      id: i,
      country: countries[i % countries.length],
      sales: Math.random() * 10000,
      expenses: Math.random() * 5000,
    });
  }

  // show data in a grid
  var theGrid = new wijmo.grid.FlexGrid('#theGrid', {
    isReadOnly: true,
    allowResizing: 'None',
    allowDragging: 'None',
    allowSorting: false,
    selectionMode: 'RowRange',
    showAlternatingRows: false,
    autoGenerateColumns: false,
    columns: [
      { binding: 'id', header: 'ID', width: 50 },
      { binding: 'country', header: 'Country' },
      { binding: 'sales', header: 'Sales', width: 80, format: 'n0' },
      { binding: 'salesDiff', header: 'Diff', dataType: 'Number', width: 80, format: 'p0' },
      { binding: 'expenses', header: 'Expenses', width: 80, format: 'n0' },
      { binding: 'expensesDiff', header: 'Diff', dataType: 'Number', width: 80, format: 'p0' }
    ],
    itemsSource: data,
  });

  // insert extra column header row
  var ch = theGrid.columnHeaders,
      hr = new wijmo.grid.Row();
  ch.rows.insert(0, hr);
  
  // fill out headings in extra header row
  for (var i = 0; i < theGrid.columns.length; i++) {
    var hdr = ch.getCellData(1, i);
    if (hdr == 'Diff') hdr = ch.getCellData(1, i - 1)
    ch.setCellData(0, i, hdr);
  }
  
  // allow merging across and down extra header row
  theGrid.allowMerging = 'ColumnHeaders';
  hr.allowMerging = true;      
  theGrid.columns[0].allowMerging = true;
  theGrid.columns[1].allowMerging = true;

  // custom rendering for headers and "Diff" columns
  theGrid.formatItem.addHandler(function(s, e) {
  
    // center-align column headers
    if (e.panel == s.columnHeaders) {
      e.cell.innerHTML = '<div class="v-center">' +
        e.cell.innerHTML + '</div>';
    }
  
    // custom rendering for "Diff" columns
    if (e.panel == s.cells) {
        var col = s.columns[e.col];
        if (e.row > 0 && (col.binding == 'salesDiff' || col.binding == 'expensesDiff')) {
          var vnow = s.getCellData(e.row, e.col - 1),
              vprev = s.getCellData(e.row - 1, e.col - 1),
              diff = (vnow / vprev) - 1;
              
          // format the cell
          var html = '<div class="diff-{cls}">' +
            '<span style="font-size:75%">{val}</span> ' +
            '<span style="font-size:120%" class="wj-glyph-{glyph}"></span>';
          html = html.replace('{val}', wijmo.Globalize.format(diff, col.format));
          if (diff < 0.01) {
            html = html.replace('{cls}', 'down').replace('{glyph}', 'down');
          } else if (diff > 0.01) {
            html = html.replace('{cls}', 'up').replace('{glyph}', 'up');
          } else {
            html = html.replace('{cls}', 'none').replace('{glyph}', 'circle');
          }
          e.cell.innerHTML = html;
      }
    }
  });
}
