import { Request, Response } from 'express';
import { getManager } from 'typeorm';

import { Component } from '../../database/entity/Component';

/**
 * Stores a component into database
 */
export const postComponent = async (req: Request, res: Response) => {
    const componentRepository = getManager().getRepository(Component);
    const component = componentRepository.create(req.body);
    const result = await componentRepository.save(component);

    res.send(result);
};
