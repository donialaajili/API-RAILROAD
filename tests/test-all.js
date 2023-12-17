import app from '../web.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';

import User from '../models/User.js';
import Train from '../models/Train.js';
import TrainStation from '../models/TrainStation.js';
import Ticket from '../models/Ticket.js';

const request = supertest(app);
chai.use(chaiHttp);
const expect = chai.expect;

// Users variables
let userCredentials;
let secondUserCredential;
let adminCredentials;

let userToken;
let secondUserToken;
let adminToken;

let normalUserId;
let secondNormalUserId;
let adminUserId;

// Trainstations variables
let firstTrainStationInformations;
let secondTrainStationInformations;

let firstTrainStationId;
let secondTrainStationId;

// Trains variables
let firstTrainInformations;
let secondTrainInformations;

let firstTrainId;
let secondTrainId;

// Tickets variables
let ticketInformation;
let ticketId;


before(() => {

    // Initialize users
    userCredentials = {
        username: "neo",
        email: "neo@mail.net",
        password: "aZerTy123",
        role: "user"
    };

    secondUserCredential = {
        username: "Bob",
        email: "bob@mail.com",
        password: "MdpTr3sR0busTe",
        role: "user"
    };

    adminCredentials = {
        username: "adeline",
        email: "adeline.labesse@supinfo.com",
        password: "aZerTy123",
        role: "admin"
    };

    // Initialize Trainstations
    firstTrainStationInformations = {
        name: "Montparnasse",
        open_hour: "10",
        close_hour: "18"
    };

    secondTrainStationInformations = {
        name: "Gare du Nord",
        open_hour: "8",
        close_hour: "19"
    };

    // Initialize trains
    firstTrainInformations = {
        name: "TGV",
        time_of_departure: "2017-06-01"
    };

    secondTrainInformations = {
        name: "TER",
        time_of_departure: "2019-03-10"
    };

    // Initialize ticket
    ticketInformation = {
        date: "2019-07-12"
    };
});

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Users tests

describe("Users Registration & Login", () => {
    // Create a user for test CRUD
    it("should register a first new normal user", async () => {
        const response = await request
            .post("/api/auth/register")
            .send(userCredentials);

        expect(response).to.have.status(201);
        expect(response.body).to.have.property("username");
    });

    // Create a user for next tests
    it("should register a second new normal user", async () => {
        const response = await request
            .post("/api/auth/register")
            .send(secondUserCredential);

        expect(response).to.have.status(201);
        expect(response.body).to.have.property("username");
    });

    it("should login the first user and set token", async () => {
        const response = await request
            .post("/api/auth/login")
            .send({ username: userCredentials.username, password: userCredentials.password });

        expect(response).to.have.status(200);
        expect(response.body).to.have.property("accessToken");

        userToken = response.body.accessToken;
        normalUserId = response.body._id;
    });

    it("should login the second user and set token", async () => {
        const response = await request
            .post("/api/auth/login")
            .send({ username: secondUserCredential.username, password: secondUserCredential.password });

        expect(response).to.have.status(200);
        expect(response.body).to.have.property("accessToken");

        secondUserToken = response.body.accessToken;
        secondNormalUserId = response.body._id;

        // Initialize ticket information for next test
        ticketInformation.user = secondNormalUserId;
    });
});

describe("Admin Registration & Login", () => {
    it("should register a second user (admin)", async () => {
        const response = await request
            .post("/api/auth/register")
            .send(adminCredentials);

        expect(response).to.have.status(201);
        expect(response.body).to.have.property("username");

        adminUserId = response.body._id;
    });

    it("should login the admin", async () => {
        const response = await request
            .post("/api/auth/login")
            .send({ username: adminCredentials.username, password: adminCredentials.password });

        expect(response).to.have.status(200);
        expect(response.body).to.have.property("accessToken");

        adminToken = response.body.accessToken;
    });
});

describe("Read users informations", () => {
    it("should get the normal user", async () => {
        const response = await request
            .get(`/api/users/${normalUserId}`)
            .set("authorization", `Bearer ${userToken}`);

        expect(response).to.have.status(200);
        expect(response.body).to.have.property(
            "username",
            userCredentials.username
        );
    });

    it("should get the admin user", async () => {
        const response = await request
            .get(`/api/users/${adminUserId}`)
            .set("authorization", `Bearer ${adminToken}`);

        expect(response).to.have.status(200);
        expect(response.body).to.have.property(
            "username",
            adminCredentials.username
        );
    });

    it("should get all users", async () => {
        const response = await request
            .get("/api/users/")
            .set("authorization", `Bearer ${adminToken}`);

        expect(response).to.have.status(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.be.greaterThan(0);
    });
});

describe("Update users informations", () => {
    it("should update the normal user", async () => {
        const updatedUserData = {
            username: "neo",
            email: "info.neo@mail.net",
            password: "aZerTy123",
            role: "client"
        };

        const response = await request
            .put(`/api/users/${normalUserId}`)
            .set("authorization", `Bearer ${userToken}`)
            .send(updatedUserData);

        expect(response).to.have.status(200);
        expect(response.body).to.have.property("username", "neo");
    });
});

describe("Delete users", () => {
    it("should delete the normal user", async () => {
        const response = await request
            .delete(`/api/users/${normalUserId}`)
            .set("authorization", `Bearer ${userToken}`);

        expect(response).to.have.status(200);
        expect(response.body).to.have.property(
            "message",
            "User deleted successfully"
        )
    });
});

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Trainstations tests

describe("Create a trainstation", () => {

    // Test authorization
    it("should unauthorized normal user to create a trainstation", async () => {
        const response = await request
            .post("/api/trainstations/")
            .set("authorization", `Bearer ${secondUserToken}`)
            .send(firstTrainStationInformations);

        expect(response).to.have.status(403);
    });

    // Create first trainstation for test CRUD
    it("should create a trainstation by admin user", async () => {
        const response = await request
            .post("/api/trainstations/")
            .set("authorization", `Bearer ${adminToken}`)
            .send(firstTrainStationInformations);
        expect(response).to.have.status(200);
        expect(response.body).to.have.property("name");

        firstTrainStationId = response.body._id;
    });

    // Create first trainstation for test train
    it("should create a second trainstation by admin user", async () => {
        const response = await request
            .post("/api/trainstations/")
            .set("authorization", `Bearer ${adminToken}`)
            .send(secondTrainStationInformations);
        expect(response).to.have.status(200);
        expect(response.body).to.have.property("name");

        secondTrainStationId = response.body._id;

        // Initialize trains with the second trainstation infos
        firstTrainInformations.start_station = secondTrainStationId;
        firstTrainInformations.end_station = secondTrainStationId;

        secondTrainInformations.start_station = secondTrainStationId;
        secondTrainInformations.end_station = secondTrainStationId;
    });
});

describe("Read trainstations informations", () => {
    it("should get one trainstations", async () => {
        const response = await request
            .get(`/api/trainstations/${firstTrainStationId}`);

        expect(response).to.have.status(200);
        expect(response.body).to.have.property(
            "name",
            firstTrainStationInformations.name
        );
    });

    it("should get all trainstations", async () => {
        const response = await request
            .get("/api/trainstations/");

        expect(response).to.have.status(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.be.greaterThan(0);
    });
});

describe("Update trainstations informations", () => {
    it("should update the first trainstation", async () => {
        const updatedTrainstationData = {
            name: "Montparnasse",
            open_hour: "8",
            close_hour: "18"
        };

        const response = await request
            .put(`/api/trainstations/${firstTrainStationId}`)
            .set("authorization", `Bearer ${adminToken}`)
            .send(updatedTrainstationData);

        expect(response).to.have.status(200);
        expect(response.body).to.have.property("open_hour", "8");
    });
});

describe("Delete trainstations", () => {
    it("should delete the first trainstation", async () => {
        const response = await request
            .delete(`/api/trainstations/${firstTrainStationId}`)
            .set("authorization", `Bearer ${adminToken}`);

        expect(response).to.have.status(200);
    });
});

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Trains tests

describe("Create trains", () => {
    // Test authorization
    it("should unauthorized normal user to create a train", async () => {
        const response = await request
            .post("/api/trains/")
            .set("authorization", `Bearer ${secondUserToken}`)
            .send(firstTrainInformations);

        expect(response).to.have.status(403);
    });

    // Create a first train for test CRUD
    it("should create a train by admin user", async () => {
        const response = await request
            .post("/api/trains/")
            .set("authorization", `Bearer ${adminToken}`)
            .send(firstTrainInformations);
        expect(response).to.have.status(200);
        expect(response.body).to.have.property("name");

        firstTrainId = response.body._id;
    });

    // Create a second train for test Tickets
    it("should create a second train by admin user", async () => {
        const response = await request
            .post("/api/trains/")
            .set("authorization", `Bearer ${adminToken}`)
            .send(secondTrainInformations);
        expect(response).to.have.status(200);
        expect(response.body).to.have.property("name");

        secondTrainId = response.body._id;

        // Initialize ticket information for next test
        ticketInformation.train = secondTrainId;
    });
});

describe("Read trains informations", () => {
    it("should get one train", async () => {
        const response = await request
            .get(`/api/trains/${firstTrainId}`);

        expect(response).to.have.status(200);
        expect(response.body).to.have.property(
            "name",
            firstTrainInformations.name
        );
    });

    it("should get all trains", async () => {
        const response = await request
            .get("/api/trains/");

        expect(response).to.have.status(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.be.greaterThan(0);
    });
});

describe("Update trains informations", () => {
    it("should update the first train", async () => {
        const updatedTrainData = {
            name: "TGV INOUI",
            start_station: secondTrainStationId,
            end_station: secondTrainStationId,
            time_of_departure: "2017-06-01"
        };

        const response = await request
            .put(`/api/trains/${firstTrainId}`)
            .set("authorization", `Bearer ${adminToken}`)
            .send(updatedTrainData);

        expect(response).to.have.status(200);
        expect(response.body).to.have.property("name", "TGV INOUI");
    });
});

describe("Delete trains", () => {
    it("should delete the first train", async () => {
        const response = await request
            .delete(`/api/trains/${firstTrainId}`)
            .set("authorization", `Bearer ${adminToken}`);

        expect(response).to.have.status(200);
    });
});

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Ticket tests

describe("Create tickets", () => {
    it("should create a ticket by normal user", async () => {
        const response = await request
            .post("/api/tickets/")
            .set("authorization", `Bearer ${secondUserToken}`)
            .send(ticketInformation);
        expect(response).to.have.status(200);

        ticketId = response.body.ticket._id;
    });
});

describe("Read tickets informations", () => {
    it("should get one ticket", async () => {
        const response = await request
            .get(`/api/tickets/${ticketId}`)
            .set("authorization", `Bearer ${adminToken}`);

        expect(response).to.have.status(200);
    });

    it("should get all tickets", async () => {
        const response = await request
            .get("/api/tickets/")
            .set("authorization", `Bearer ${adminToken}`);

        expect(response).to.have.status(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.be.greaterThan(0);
    });
});

describe("Update tickets informations", () => {
    it("should update the ticket", async () => {
        const updatedTicketData = {
            train: ticketInformation.train,
            user: ticketInformation.user,
            date: "2024-10-02"
        };

        const response = await request
            .put(`/api/tickets/${ticketId}`)
            .set("authorization", `Bearer ${adminToken}`)
            .send(updatedTicketData);

        expect(response).to.have.status(200);
        expect(response.body).to.have.property("date", "2024-10-02T00:00:00.000Z");
    });
});

describe("Delete tickets", () => {
    it("should delete the ticket", async () => {
        const response = await request
            .delete(`/api/tickets/${ticketId}`)
            .set("authorization", `Bearer ${adminToken}`);

        expect(response).to.have.status(200);
    });
});

after(async () => {
    await User.deleteMany({});
    await Train.deleteMany({});
    await TrainStation.deleteMany({});
    await Ticket.deleteMany({});
});
