var postal_code = require('../index');
var expect = require('expect.js');

describe('#get', function () {
  it('fetch address', function(done) {
    postal_code.get('1000001', function(address) {
      expect(address.prefectureId).to.eql(13);
      expect(address.prefecture).to.eql('東京都');
      expect(address.prefectureKana).to.eql('トウキョウト');
      expect(address.cityId).to.eql(13101);
      expect(address.city).to.eql('千代田区');
      expect(address.cityKana).to.eql('チヨダク');
      expect(address.areaId).to.eql(131010045);
      expect(address.area).to.eql('千代田');
      expect(address.areaKana).to.eql('チヨダ');
      expect(address.street).to.eql('');
      expect(address.address).to.eql('東京都千代田区千代田');      
      delete global.zipdata;
      done();
    });
  });

  it('fetch address(hypen)', function(done) {
    postal_code.get('100-0001', function(address) {
      expect(address.prefectureId).to.eql(13);
      expect(address.prefecture).to.eql('東京都');
      expect(address.prefectureKana).to.eql('トウキョウト');
      expect(address.cityId).to.eql(13101);
      expect(address.city).to.eql('千代田区');
      expect(address.cityKana).to.eql('チヨダク');
      expect(address.areaId).to.eql(131010045);
      expect(address.area).to.eql('千代田');
      expect(address.areaKana).to.eql('チヨダ');
      expect(address.street).to.eql('');
      expect(address.address).to.eql('東京都千代田区千代田');  
      delete global.zipdata;
      done();
    });
  });

  it('returns null with short postalcode', function() {
    // // FIXME: I want to test, callback function is not invoke
    // postal_code.get('100', function(address) {
    //   expect().fail("Should not call callback function.");
    //   done();
    // });
    postal_code.get('100', function(address) {
      expect(address).to.be(null);
    });
  });
});

describe('#getMulti', function () {
  it('fetch addresses', function(done) {
    postal_code.getMulti('0995613', function(addresses) {
      expect(addresses.length).to.eql(4);

      expect(addresses[0].prefectureId).to.eql(1);
      expect(addresses[0].prefecture).to.eql('北海道');
      expect(addresses[0].prefectureKana).to.eql('ホッカイドウ');
      expect(addresses[0].cityId).to.eql(1560);
      expect(addresses[0].city).to.eql('紋別郡滝上町');
      expect(addresses[0].cityKana).to.eql('モンベツグンタキノウエチョウ');
      expect(addresses[0].areaId).to.eql(15600011);
      expect(addresses[0].area).to.eql('第３区');
      expect(addresses[0].areaKana).to.eql('ダイ０３ク');
      expect(addresses[0].street).to.eql('');
      expect(addresses[0].address).to.eql('北海道紋別郡滝上町第３区');  

      expect(addresses[1].prefectureId).to.eql(1);
      expect(addresses[1].prefecture).to.eql('北海道');
      expect(addresses[1].prefectureKana).to.eql('ホッカイドウ');
      expect(addresses[1].cityId).to.eql(1560);
      expect(addresses[1].city).to.eql('紋別郡滝上町');
      expect(addresses[1].cityKana).to.eql('モンベツグンタキノウエチョウ');
      expect(addresses[1].areaId).to.eql(15600012);
      expect(addresses[1].area).to.eql('第４区');
      expect(addresses[1].areaKana).to.eql('ダイ０４ク');
      expect(addresses[1].street).to.eql('');
      expect(addresses[1].address).to.eql('北海道紋別郡滝上町第４区');  

      expect(addresses[2].prefectureId).to.eql(1);
      expect(addresses[2].prefecture).to.eql('北海道');
      expect(addresses[2].prefectureKana).to.eql('ホッカイドウ');
      expect(addresses[2].cityId).to.eql(1560);
      expect(addresses[2].city).to.eql('紋別郡滝上町');
      expect(addresses[2].cityKana).to.eql('モンベツグンタキノウエチョウ');
      expect(addresses[2].areaId).to.eql(15600013);
      expect(addresses[2].area).to.eql('第５区');
      expect(addresses[2].areaKana).to.eql('ダイ０５ク');
      expect(addresses[2].street).to.eql('');
      expect(addresses[2].address).to.eql('北海道紋別郡滝上町第５区');  

      expect(addresses[3].prefectureId).to.eql(1);
      expect(addresses[3].prefecture).to.eql('北海道');
      expect(addresses[3].prefectureKana).to.eql('ホッカイドウ');
      expect(addresses[3].cityId).to.eql(1560);
      expect(addresses[3].city).to.eql('紋別郡滝上町');
      expect(addresses[3].cityKana).to.eql('モンベツグンタキノウエチョウ');
      expect(addresses[3].areaId).to.eql(15600016);
      expect(addresses[3].area).to.eql('滝西');
      expect(addresses[3].areaKana).to.eql('タキニシ');
      expect(addresses[3].street).to.eql('');
      expect(addresses[3].address).to.eql('北海道紋別郡滝上町滝西'); 

      delete global.zipdata;
      done();
    });
  });

  it('returns empty array [] with short postalcode', function() {
    postal_code.getMulti('100', function(address) {
      expect(address).to.be.an('array');
      expect(address.length).to.eql(0);
    });
  });
});
