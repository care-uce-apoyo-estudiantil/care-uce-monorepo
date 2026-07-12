import { Request, Response } from 'express';
import { LoggerMiddleware } from './logger.middleware';

describe('LoggerMiddleware', () => {
  it('calls next() and logs once the response finishes', () => {
    const middleware = new LoggerMiddleware();
    const next = jest.fn();

    let finishHandler: () => void = () => undefined;
    const request = {
      ip: '127.0.0.1',
      method: 'GET',
      originalUrl: '/auth/login',
      get: jest.fn().mockReturnValue('jest-test-agent'),
    } as unknown as Request;

    const response = {
      statusCode: 200,
      get: jest.fn().mockReturnValue('123'),
      on: jest.fn((event: string, cb: () => void) => {
        if (event === 'finish') finishHandler = cb;
      }),
    } as unknown as Response;

    middleware.use(request, response, next);

    expect(next).toHaveBeenCalled();
    expect(response.on).toHaveBeenCalledWith('finish', expect.any(Function));

    // Simulate the response finishing to cover the logging branch
    expect(() => finishHandler()).not.toThrow();
  });
});
