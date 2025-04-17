import { describe, expect, it, jest } from "@jest/globals";

import { ServerCommonSchemaInterface } from "@config-runtime/schemas/common";
import { validate } from "@config-runtime/validateConsistency";

jest.unmock("@config-runtime/validateConsistency");

describe("[unit] validateConsistency", () => {
  const serverCommonSchema: ServerCommonSchemaInterface = {
    logger: {
      level: "info",
    },
    http: {
      port: 3000,
      version: "2",
      ssl: {
        cert: undefined,
        key: undefined,
      },
    },
    domain: "localhost",
  };

  it("When no SSL certificate is provided, then it should not throw", () => {
    expect(() => validate(serverCommonSchema)).not.toThrow();
  });

  it("When an SSL certificate is provided, then it should not throw", () => {
    serverCommonSchema.http.ssl = {
      cert: "cert.pem",
      key: "key.pem",
    };

    expect(() => validate(serverCommonSchema)).not.toThrow();
  });

  it("When only one SSL certificate is provided, then it should throw", () => {
    serverCommonSchema.http.ssl = {
      cert: "cert.pem",
      key: "",
    };

    expect(() => validate(serverCommonSchema)).toThrow();
  });

  it("When only one SSL key is provided, then it should throw", () => {
    serverCommonSchema.http.ssl = {
      cert: "",
      key: "key.pem",
    };

    expect(() => validate(serverCommonSchema)).toThrow();
  });

  it("When no SSL certificate nor key is provided, then it should not throw", () => {
    serverCommonSchema.http.ssl = {
      cert: "",
      key: "",
    };

    expect(() => validate(serverCommonSchema)).not.toThrow();
  });
});
