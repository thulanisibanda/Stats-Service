process.env.NODE_ENV = "test";
const expect = require("chai").expect;
const request = require("supertest");
const app = require("../../app");

describe("Testing all routes", () => {
  //data for testing
  let courseId;
  let userId;
  let totalModules = 0;
  let totalTime = 0;
  let totalScore = 0;

  const sessions = [
    {
      totalModulesStudied: 3,
      averageScore: 50,
      timeStudied: 7000,
      totalModulesStudiedUpdate: 2,
      averageScoreUpdate: 60,
      timeStudiedUpdate: 8000,
    },
    {
      totalModulesStudied: 2,
      averageScore: 60,
      timeStudied: 4000,
      totalModulesStudiedUpdate: 1,
      averageScoreUpdate: 40,
      timeStudiedUpdate: 6000,
    },
    {
      totalModulesStudied: 4,
      averageScore: 70,
      timeStudied: 10000,
      totalModulesStudiedUpdate: 3,
      averageScoreUpdate: 60,
      timeStudiedUpdate: 10000,
    },
    {
      totalModulesStudied: 1,
      averageScore: 55,
      timeStudied: 2000,
      totalModulesStudiedUpdate: 7,
      averageScoreUpdate: 80,
      timeStudiedUpdate: 15000,
    },
  ];

  it("OK, creating a user", (done) => {
    request(app)
      .post("/newUser")
      .send({ name: "Bob" })
      .then((res) => {
        body = res.body;
        userId = body.userId;
        expect(body).to.contain.property("name");
        expect(body).to.contain.property("userId");
        done();
      })
      .catch((err) => done(err));
  });

  it("OK, creating a course", (done) => {
    request(app)
      .post("/newCourse")
      .send({ name: "Maths" })
      .then((res) => {
        body = res.body;
        courseId = body.courseId;
        expect(body).to.contain.property("name");
        expect(body).to.contain.property("courseId");
        done();
      })
      .catch((err) => done(err));
  });

  it("OK, creating sessions", (done) => {
    sessions.map((session, index) => {
      totalModules += session.totalModulesStudied;
      totalTime += session.timeStudied;
      totalScore += session.averageScore;
      request(app)
        .post(`/courses/${courseId}`)
        .set({ "x-user-id": userId })
        .send(session)
        .then((res) => {
          body = res.body;
          expect(body).to.contain.property("sessionId");
          expect(body).to.contain.property("totalModulesStudied");
          expect(body).to.contain.property("averageScore");
          expect(body).to.contain.property("timeStudied");
          sessions[index].sessionId = body.sessionId;
          if (index === sessions.length - 1) {
            done();
          }
        })
        .catch((err) => done(err));
    });
  });

  it("OK, getting sessions", (done) => {
    sessions.map((session, index) => {
      request(app)
        .get(`/courses/${courseId}/sessions/${session.sessionId}`)
        .set({ "x-user-id": userId })
        .then((res) => {
          body = res.body;
          expect(body).to.contain.property("sessionId");
          expect(body).to.contain.property("totalModulesStudied");
          expect(body).to.contain.property("averageScore");
          expect(body).to.contain.property("timeStudied");
          if (index === sessions.length - 1) {
            done();
          }
        })
        .catch((err) => done(err));
    });
  });

  it("OK, getting course stats", (done) => {
    request(app)
      .get(`/${courseId}`)
      .set({ "x-user-id": userId })
      .then((res) => {
        const { totalModulesStudied, averageScore, timeStudied } = res.body;
        expect(totalModulesStudied).to.equal(totalModules);
        expect(averageScore).to.equal(totalScore / sessions.length);
        expect(timeStudied).to.equal(totalTime);
        done();
      })
      .catch((err) => done(err));
  });

  it("OK, updating sessions", (done) => {
    sessions.map((session, index) => {
      request(app)
        .post(`/courses/${courseId}`)
        .set({ "x-user-id": userId })
        .send({
          sessionId: session.sessionId,
          totalModulesStudied: session.totalModulesStudiedUpdate,
          averageScore: session.averageScoreUpdate,
          timeStudied: session.timeStudiedUpdate,
        })
        .then((res) => {
          body = res.body;
          expect(body).to.contain.property("sessionId");
          expect(body).to.contain.property("totalModulesStudied");
          expect(body).to.contain.property("averageScore");
          expect(body).to.contain.property("timeStudied");
          if (index === sessions.length - 1) {
            done();
          }
        })
        .catch((err) => done(err));
    });
  });

  it("OK, getting updated course stats", (done) => {
    totalModules = 0;
    totalTime = 0;
    totalScore = 0;
    sessions.map((session, index) => {
      totalModules += session.totalModulesStudiedUpdate;
      totalTime += session.timeStudiedUpdate;
      totalScore += session.averageScoreUpdate;
      request(app)
        .get(`/${courseId}`)
        .set({ "x-user-id": userId })
        .then((res) => {
          const { totalModulesStudied, averageScore, timeStudied } = res.body;
          expect(totalModulesStudied).to.equal(totalModules);
          expect(averageScore).to.equal(totalScore / sessions.length);
          expect(timeStudied).to.equal(totalTime);
          if (index === sessions.length - 1) {
            done();
          }
        })
        .catch((err) => done(err));
    });
  });

  it("FAIL, wrong sessionId for getting sessionId", (done) => {
    request(app)
      .get(`/courses/${courseId}/sessions/13342442`)
      .set({ "x-user-id": userId })
      .then((res) => {
        expect(res.body).to.contain.property("error");
        //expect(res.body).to.contain.property("error");
        done();
      })
      .catch((err) => done(err));
  });

  it("FAIL, wrong courseId for course stats", (done) => {
    request(app)
      .get(`/dgggfgfgfggf`)
      .set({ "x-user-id": userId })
      .then((res) => {
        expect(res.body).to.contain.property("error");
        done();
      })
      .catch((err) => done(err));
  });

  it("FAIL, missing averageScore for saving a session", (done) => {
    request(app)
      .post(`/courses/${courseId}`)
      .set({ "x-user-id": userId })
      .send({
        totalModulesStudied: sessions[0].totalModulesStudiedUpdate,
        timeStudied: sessions[0].timeStudiedUpdate,
      })
      .then((res) => {
        expect(res.body).to.contain.property("error");
        done();
      })
      .catch((err) => done(err));
  });
});
