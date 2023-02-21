import app, { init } from "@/app";
import { prisma } from "@/config";
import { conflictError } from "@/errors";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /sign-up", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/sign-up");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/sign-up").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });

    it("should respond with status 400 when there is no event", async () => {
      const body = generateValidBody();

      const response = await server.post("/sign-up").send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when current event did not started yet", async () => {
      const body = generateValidBody();

      const response = await server.post("/sign-up").send(body).query({ eventId: 1 });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when event started", () => {
      it("should respond with status 409 when there is an user with given email", async () => {
        const body = generateValidBody();
        await createUser(body);

        const response = await server.post("/sign-up").send(body);

        expect(response.status).toBe(httpStatus.CONFLICT);
        expect(response.body).toEqual(conflictError(""));
      });

      it("should respond with status 201 and create user when given email is unique", async () => {
        const body = generateValidBody();

        const response = await server.post("/sign-up").send(body);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual({
          id: expect.any(Number),
          email: body.email,
        });
      });

      it("should not return user password on body", async () => {
        const body = generateValidBody();

        const response = await server.post("/sign-up").send(body);

        expect(response.body).not.toHaveProperty("password");
      });

      it("should save user on db", async () => {
        const body = generateValidBody();

        const response = await server.post("/sign-up").send(body);

        const user = await prisma.user.findUnique({
          where: { email: body.email },
        });
        expect(user).toEqual(
          expect.objectContaining({
            id: response.body.id,
            email: body.email,
          }),
        );
      });
    });
  });
});
