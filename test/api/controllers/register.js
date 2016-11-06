var assert = require("chai").assert;
var request = require("supertest");
var server = require("../../../app");

describe("controllers", function() {

  describe("register", function() {

    describe("POST /register-challenge", function() {

      it("should return challenge object", function(done) {

        request(server)
          .post("/auth/fido/v1/register-challenge")
          .expect(200)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .end(function(err, res) {
            console.log (err);
            assert.isNotOk(err);
            console.log (require("util").inspect(res.body));
            // assert.strictEqual (res.body, "Sup dude?");

            done();
          });
      });

      it.skip("should accept a name parameter", function(done) {

        request(server)
          .get("/hello")
          .query({ name: "Scott"})
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.eql("Hello, Scott!");

            done();
          });
      });

    });

  });

});
