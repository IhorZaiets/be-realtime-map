import { Request, Response } from 'express';
import { MOCK_EMAIL, MOCK_PASSWORD } from '../data';

export const loginUser = (
  req: Request<unknown, unknown, { email: string; password: string }>,
  res: Response
) => {
  const { email, password } = req.body;

  if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
    res.status(200).json();

    return;
  }

  res.status(401).json('User does not exist');
};
