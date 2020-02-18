import { Request, Response } from 'express';
import { getManager } from 'typeorm';

import { Component } from '../../database/entity/Component';

/**
 * Returns all components from database
 */
export const getAllComponents = async (req: Request, res: Response) => {
    const componentRepository = getManager().getRepository(Component);
    const components = await componentRepository.find();

    res.json(components);
};
