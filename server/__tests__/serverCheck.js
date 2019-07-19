/* eslint-disable global-require */
const path = require("path");

describe("server check", () => {
  let loopback, boot;
  const mockApp = {};
  const getApp = () => require("../server");

  beforeEach(() => {
    jest.resetModules();
    jest.mock("loopback");
    jest.mock("loopback-boot");
    loopback = require("loopback");
    boot = require("loopback-boot");
    loopback.mockReturnValue(mockApp);
  });

  it("instances loopback", () => {
    getApp();
    expect(loopback).toBeCalled();
  });

  it("adds start function", () => {
    expect(getApp().start).toBeInstanceOf(Function);
  });

  it("boot application", () => {
    getApp();
    expect(boot).toBeCalledWith(
      mockApp,
      expect.objectContaining({
        appRootDir: path.join(__dirname, "..")
      }),
      expect.any(Function)
    );
  });

  it("throws when application boot fails", () => {
    boot.mockImplementation((a, o, done) => done("foo"));
    expect(getApp).toThrowError("foo");
  });

  it("not throws when application boot success", () => {
    boot.mockImplementation((a, o, done) => done());
    expect(getApp).not.toThrow();
  });

  it("calls express listen when start is called", () => {
    const listen = jest.fn();
    loopback.mockReturnValue({ listen });
    getApp().start();
    expect(listen).toBeCalledWith(expect.any(Function));
  });

  it("emit started when start is called", () => {
    const get = jest.fn(() => "foo");
    const listen = jest.fn(cb => cb());
    const emit = jest.fn();
    const use = jest.fn();
    loopback.mockReturnValue({ listen, get, emit, use });
    getApp().start();
    expect(emit).toBeCalledWith("started");
  });

  it("log api endpoint when start is called", () => {
    const get = jest.fn(() => "foo/api");
    const listen = jest.fn(cb => cb());
    const emit = jest.fn();
    console.log = jest.fn();
    const use = jest.fn();
    loopback.mockReturnValue({ listen, get, emit, use });
    getApp().start();
    expect(console.log).toBeCalledWith(expect.any(String), "foo/api");
  });

  it("log explorer url when start is called", () => {
    const get = jest.fn(term =>
      term === "url" ? "url" : { mountPath: "foo" }
    );
    const listen = jest.fn(cb => cb());
    const emit = jest.fn();
    console.log = jest.fn();
    const use = jest.fn((req, res, next) => {});
    loopback.mockReturnValue({ get, listen, emit, use });
    getApp().start();
    expect(console.log).toBeCalledWith(expect.any(String), "url", "foo");
  });
});
