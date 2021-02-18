/* ================================================================ *
    ajaxzip3.js ---- AjaxZip3 郵便番号→住所変換ライブラリ

	Copyright (c) 2021
    https://github.com/ZCloud-Firstserver/japan-postal-code
	
    Copyright (c) 2015 MIZUNO Hiroki
    http://github.com/mzp/japan-postal-code

    Copyright (c) 2008-2015 Ninkigumi Co.,Ltd.
    http://ajaxzip3.github.io/

    Copyright (c) 2006-2007 Kawasaki Yusuke <u-suke [at] kawa.net>
    http://www.kawa.net/works/ajax/AjaxZip2/AjaxZip2.html

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
* ================================================================ */

var jsonp = require('jsonp');

var JSONDATA = 'https://danglephuc.github.io/jp-postalcode-lookup/zipdata/zip-'; // Path or URL
var CALLBACK_NAME = 'zipdata';
var CACHE = [];


var PREFMAP = [
    null,       '北海道',   '青森県',   '岩手県',   '宮城県',
    '秋田県',   '山形県',   '福島県',   '茨城県',   '栃木県',
    '群馬県',   '埼玉県',   '千葉県',   '東京都',   '神奈川県',
    '新潟県',   '富山県',   '石川県',   '福井県',   '山梨県',
    '長野県',   '岐阜県',   '静岡県',   '愛知県',   '三重県',
    '滋賀県',   '京都府',   '大阪府',   '兵庫県',   '奈良県',
    '和歌山県', '鳥取県',   '島根県',   '岡山県',   '広島県',
    '山口県',   '徳島県',   '香川県',   '愛媛県',   '高知県',
    '福岡県',   '佐賀県',   '長崎県',   '熊本県',   '大分県',
    '宮崎県',   '鹿児島県', '沖縄県'
];

var PREFMAP_KANA = [
    null,       'ホッカイドウ',   'アオモリケン',   'イワテケン',   'ミヤギケン',
    'アキタケン',   'ヤマガタケン',   'フクシマケン',   'イバラキケン',   'トチギケン',
    'グンマケン',   'サイタマケン',   'チバケン',   'トウキョウト',   'カナガワケン',
    'ニイガタケン',   'トヤマケン',   'イシカワケン',   'フクイケン',   'ヤマナシケン',
    'ナガノケン',   'ギフケン',   'シズオカケン',   'アイチケン',   'ミエケン',
    'シガケン',   'キョウトフ',   'オオサカフ',   'ヒョウゴケン',   'ナラケン',
    'ワカヤマケン', 'トットリケン',   'シマネケン',   'オカヤマケン',   'ヒロシマケン',
    'ヤマグチケン',   'トクシマケン',   'カガワケン',   'エヒメケン',   'コウチケン',
    'フクオカケン',   'サガケン',   'ナガサキケン',   'クマモトケン',   'オオイタケン',
    'ミヤザキケン',   'カゴシマケン', 'オキナワケン'
];

exports.setJsonDataUrl = function(url) {
  JSONDATA = url;
};

exports.setCallbackName = function(name) {
  CALLBACK_NAME = name;
};

exports.get = function(_postalcode, callback) {
  getWithFilter(_postalcode, callback, function(addresses) {
    if (addresses) return addresses[0];
    return null;
  });
};

exports.getMulti = function(_postalcode, callback) {
  getWithFilter(_postalcode, callback, function(addresses) {
    if (addresses) return addresses;
    return [];
  });
};

var cache = function(postalcode3, records) {
  if (records) {
    CACHE[postalcode3] = records;
  }
  return CACHE[postalcode3];
};

var jsonpUrl = function(postalcode3) {
  return JSONDATA + postalcode3 + '.js';
};

var normalizePostalcode = function(postalcode) {
  if (!postalcode) return null;
  var normalized = postalcode.replace(/[^0-9]/, ''); // extract number only
  if (normalized.length < 7) return null;
  return normalized;
};

var lookupAddresses = function(postalcode, _records) {
  var rows = _records[postalcode];
  // Opera バグ対策：0x00800000 を超える添字は +0xff000000 されてしまう
  var opera = (postalcode-0+0xff000000)+"";
  if (!rows && _records[opera]) rows = _records[opera];
  if (!rows) return null;

  var addresses = [];
  for (var i = 0; i < rows.length; i++) {
    addresses.push(parse(rows[i]));
  }

  return addresses;
};

var parse = function(row) {
  if (!row) return null;
  var prefectureId = row[0];
  if (!prefectureId) return null;
  var prefectureJa = PREFMAP[prefectureId];
  if (!prefectureJa) return null;
  var prefectureKana = PREFMAP_KANA[prefectureId];
  if (!prefectureKana) return null;

  var cityId   = row[1] || '';
  var cityJa   = row[2] || '';
  var cityKana = row[3] || '';
  var areaId   = row[4] || '';
  var areaJa   = row[5] || '';
  var areaKana = row[6] || '';
  var streetJa = row[7] || '';  

  var addressJa = prefectureJa + cityJa + areaJa + streetJa;   

  return {
    'prefectureId': 	  prefectureId,  	// 都道府県ID
    'prefecture':   	  prefectureJa,  	// 都道府県名
	  'prefectureKana':   prefectureKana,	//
	  'cityId':			      cityId,		   	  // 市区町村ID
    'city':         	  cityJa,        	// 市区町村名
	  'cityKana':     	  cityKana,	   	  // 
	  'areaId':     		  areaId,	   	   	// 町域ID
    'area':         	  areaJa,        	// 町域名
	  'areaKana':     	  areaKana,      	//
    'street':       	  streetJa,      	// 番地
    'address':      	  addressJa,     	// 都道府県名 + 市区町村名 + 町域名 + 番地
  };
};

var getWithFilter = function (_postalcode, callback, filter) {
  var postalcode = normalizePostalcode(_postalcode);
  if (!postalcode) {
    callback(filter(null));
    return;
  }
  var postalcode3 = postalcode.substr(0, 3);

  var records = cache(postalcode3);
  if (records) {
    var addresses = lookupAddresses(postalcode, records);
    callback(filter(addresses));
    return;
  }

  jsonp(jsonpUrl(postalcode3), { name: CALLBACK_NAME }, function(error, records) {
    if (error) {
      callback(filter(null));
    } else {
      cache(postalcode3, records);
      var addresses = lookupAddresses(postalcode, records);
      callback(filter(addresses));
    }
  });
};
