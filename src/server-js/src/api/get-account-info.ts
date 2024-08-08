// src/api/get-account-info.ts
import e, { Request, Response } from 'express';
import { ok, badRequest } from '../utils/http-utils';

interface User {
  address: string;
  chain: string;
  walletStateInit: string;
  publicKey: string;
}

interface RequestWithDb extends Request {
  db: any;
  query: {
    userId?: string;
  };
}

export const getAccountInfo = async (req: RequestWithDb, res: e.Response): Promise<e.Response> => {
  try {
    let { userId } = req.query;
    if (!userId) {
      return res.status(400).json(badRequest({ error: 'Не указан userId' }));
    }
    let user: User = JSON.parse(userId);
    if (
      !user.address ||
      !user.chain ||
      !user.walletStateInit ||
      !user.publicKey
    ) {
      return res.status(400).json(badRequest({ error: 'Некорректные параметры userId' }));
    }

    const result = await req.db.get('SELECT * FROM users2 WHERE user_id = ?', [user.address]);
    if (result) {
      return res.status(200).json(ok(result));
    } else {
      return res.status(400).json(badRequest({ error: 'Пользователь не найден' }));
    }
  } catch (error) {
    console.error('Ошибка получения информации об аккаунте:', error);
    if (error instanceof Error) {
      return res.status(400).json(badRequest({ error: 'Некорректный запрос', trace: error.message }));
    } else {
      return res.status(400).json(badRequest({ error: 'Некорректный запрос', trace: String(error) }));
    }
  }
};
