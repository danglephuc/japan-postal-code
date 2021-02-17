# Japan Postal Code Lookup
JavaScript module for searching Japan Postal Code.

Forked from https://github.com/ZCloud-Firstserver/japan-postal-code

Forked from https://github.com/ajaxzip3/ajaxzip3.github.io

Forked from https://github.com/mzp/japan-postal-code

Then:
- Update build database with postalcode data from http://jusyo.jp/
- Update id and kana name for prefecture, city and area

## How to install
```
npm install jp-postalcode-lookup
```

## How to use
```js
var postal_code = require('jp-postalcode-lookup');

// Upload /zipdata/*.js to CDN.
// ex) http://example.com/zipdata/
//     http://example.com/zipdata/zip-001.js
postal_code.setJsonDataUrl('http://example.com/zipdata/zip-');

postal_code.get('1000001', function(address) {
  console.log(address.prefectureId); 	  // => 13
  console.log(address.prefecture);   	  // => '東京都'
  console.log(address.prefectureKana);	  // => 'トウキョウト'
  console.log(address.cityId);   		  // => 13101
  console.log(address.city);         	  // => '千代田区'
  console.log(address.cityKana);    	  // => 'チヨダク'
  console.log(address.areaId);         	  // => 131010045
  console.log(address.area);         	  // => '千代田'
  console.log(address.areaKana);          // => 'チヨダ'
  console.log(address.street);       	  // => ''        
});
```

## Tests
```
npm run test-local
npm run test-makejsonpdata-from-csv --test
```

## How to update postalcode data

```
wget http://jusyo.jp/downloads/new/csv/csv_zenkoku.zip
unzip csv_zenkoku.zip
nkf -Sw zenkoku.csv > zenkoku.utf8.csv
python ./makejsonpdata-from-csv.py zenkoku.utf8.csv
```

## LICENSE
MIT License
