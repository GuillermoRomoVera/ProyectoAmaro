const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Status 200',()=>{
    it('fails, as expected', function(done) { // <= Pass in done callback
        chai.request('http://localhost:3000')
        .get('/PERSONAJES')
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(err).to.be.null;
          done();                               // <= Call done to signal callback end
        });
      });
})