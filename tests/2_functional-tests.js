const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const req = require('express/lib/request');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);
    test("Create issue with every field", (done) => {
        chai
            .request(server)
            .post("/api/issues/issuetracker")
            .send({
                issue_title: "test create issue with every field",
                issue_text: "text for test create issue with every field",
                created_by: "Slimane",
                assigned_to: "assigned test create issue with every field",
                status_text: "status test create issue with every field"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.issue_title, "test create issue with every field");
                assert.equal(res.body.issue_text, "text for test create issue with every field");
                assert.equal(res.body.created_by, "Slimane");
                assert.equal(res.body.assigned_to, "assigned test create issue with every field");
                assert.equal(res.body.status_text, "status test create issue with every field");
                done();
            });
    })
    test("Create issue with requered fields", (done) => {
        chai
            .request(server)
            .post("/api/issues/issuetracker")
            .send({
                issue_title: "test create issue with requered fields",
                issue_text: "text for test create issue with requered fields",
                created_by: "name test create issue with requered fields",
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.issue_title, "test create issue with requered fields");
                assert.equal(res.body.issue_text, "text for test create issue with requered fields");
                assert.equal(res.body.created_by, "name test create issue with requered fields");
                done();
            });
    })
    test("Create issue with requered fields missing", (done) => {
        chai
            .request(server)
            .post("/api/issues/issuetracker")
            .send({
                issue_title: "test create issue with requered fields missing",
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "required field(s) missing");
                done();
            });
    })
    test("View issues on a project", (done) => {
        chai
            .request(server)
            .get("/api/issues/issuetracker")
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                done();
            });
    })
    test("View issues on a project with one filter", (done) => {
        chai
            .request(server)
            .get("/api/issues/issuetracker?open=true")
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                done();
            });
    });
    test("View issues on a project with multiple filters", (done) => {
        chai
            .request(server)
            .get("/api/issues/issuetracker?open=true&created_by=Slimane")
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                done();
            });
    });
    test("Update one field on an issue", (done) => {
        chai
            .request(server)
            .put("/api/issues/issuetracker")
            .send({
                _id: `624c78e1bbf2a737a0c83e81`,
                issue_title: "Updated this one field",
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.result, "successfully updated");
                done();
            });
    });
    test("Update multiple field on an issue", (done) => {
        chai
            .request(server)
            .put("/api/issues/issuetracker")
            .send({
                _id: `624c78e1bbf2a737a0c83e7f`,
                issue_title: "Updated two fields, one/ two",
                issue_text: "Updated two fields, two/ two"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.result, "successfully updated");
                done();
            });
    });
    test("Update an issue with missing _id", (done) => {
        chai
            .request(server)
            .put("/api/issues/issuetracker")
            .send({
                issue_title: "Updated this one field",
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "missing _id");
                done();
            });
    });
    test("Update an issue with no fields to update", (done) => {
        chai
            .request(server)
            .put("/api/issues/issuetracker")
            .send({
                _id: `624c2d1766c8851bcc6b3d05`,
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "no update field(s) sent");
                done();
            });
    });
    test("Update an issue with an invalid _id", (done) => {
        chai
            .request(server)
            .put("/api/issues/issuetracker")
            .send({
                _id: `624c2d1766c8851bcc6b3d06`,
                issue_title: "Updated this one field",
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "could not update");
                done();
            });
    });
    test("Delete an issue", (done) => {
        chai
            .request(server)
            .delete("/api/issues/issuetracker")
            .send({
                _id: `624c354cae7dad2128bbea6c`
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.result, "successfully deleted");
                done();
            });
    });
    test("Delete an issue with invalid _id", (done) => {
        chai
            .request(server)
            .delete("/api/issues/issuetracker")
            .send({
                _id: `624c35312d99da2b1882497g`
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "could not delete");
                done();
            });
    });
    test("Delete an issue with missing _id", (done) => {
        chai
            .request(server)
            .delete("/api/issues/issuetracker")
            .send({
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "missing _id");
                done();
            });
    });
});
