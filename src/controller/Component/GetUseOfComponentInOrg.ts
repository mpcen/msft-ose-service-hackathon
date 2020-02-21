import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import {getUsesOfComponentInOrg} from '../../business/ComponentService'
import { Component } from '../../database/entity/Component';

/**
 * Returns all components from database
 */
export const getUseOfComponentInOrg = async (req: Request, res: Response) => {
    const componentRepository = getManager().getRepository(Component);
    const components = await componentRepository.find();
    const repoInformation = await getUsesOfComponentInOrg(req.body, req.params.org);
    res.json(repoInformation);
};
