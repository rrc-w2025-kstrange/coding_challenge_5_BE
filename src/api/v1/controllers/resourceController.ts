import { Request, Response, NextFunction } from "express";
import { getAllResourcesService, createNewResource, getResourceByIdService, updateResourceById, deleteResourceById } from "../services/resourceService";
import { HTTP_STATUS } from "../../../constants/httpConstants";


export const getAllResources = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    try {
        const resources = getAllResourcesService()

        res.status(HTTP_STATUS.OK).json({
            message: "Resources retrieved",
            count: resources.length || 0,
            data: resources
        })

    } catch (error) {
        next(error)
    }
}


export const getResourceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const id = Number(req.params.id);

        const resource = await getResourceByIdService(id);

        res.status(HTTP_STATUS.OK).json({
            message: "Resource retrieved",
            data: resource
        });

    } catch (error) {
        next(error);
    }
};



export const createResource = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    try {

        const resource = createNewResource(req.body)

        res.status(HTTP_STATUS.CREATED).json({
            message: "Resource created",
            data: resource
        })

    } catch (error) {
        next(error)
    }
}


export const updateResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const updateResourceDetails = req.body;

        await updateResourceById(id, updateResourceDetails);

        const updatedResource = await getResourceByIdService(id);

        res.status(HTTP_STATUS.OK).json({
            message: "Resource updated",
            data: updatedResource
        });

    } catch (error) {
        next(error);
    }
};


export const deleteResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const id = Number(req.params.id);

        await deleteResourceById(id);

        res.status(HTTP_STATUS.OK).json({
            message: `Resource ${id} was deleted`
        });

    } catch (error) {
        next(error);
    }
};