import { AppError } from "../errors/errors";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Resource, ResourceInput } from "../models/Resource.model";

/**
 * Sample in-memory resource data to simulate a database.
 */
let resources: Resource[] = [
    {
        id: 1,
        title: "Express.js Guide",
        type: "documentation",
        url: "https://expressjs.com/en/guide",
        description: "Official Express.js documentation",
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        title: "TypeScript Basics",
        type: "video",
        url: "https://example.com/ts-basics",
        description: "Introduction to TypeScript",
        createdAt: new Date().toISOString()
    }
];



export const getAllResources = (): Resource[] => {
    return resources
}


export const getResourceById = async (id: number): Promise<Resource> => {
    const resource = resources.find(resources => resources.id === id);

    if (!resources) {
        throw new AppError(
            "Resource not found",
            "RESOURCE_NOT_FOUND",
            HTTP_STATUS.NOT_FOUND
        );
    }

    return resource;
};


export const createResource = (data: ResourceInput): Resource => {
    const nextId =
      resources.length > 0
            ? Math.max(...resources.map(resource => resource.id)) + 1
            : 1

    const newResource: Resource = {
        id: nextId,
        applicant: data.applicant,
        amount: data.amount,
        status: "pending",
        createdAt: new Date().toISOString()
    }

    resources.push(newResource)

    return newResource
}


export const updateResource = async (id: number, updateResourceDetails: Partial<Resource>): Promise<void> => {

    const resource = resources.find(resource => resource.id);

    if (!resource) {
        throw new AppError(
            "Resource not found",
            "RESOURCE_NOT_FOUND",
            HTTP_STATUS.NOT_FOUND
        );
    }

    Object.assign(resources, updateResourceDetails);
};


export const deleteResource = async (id: number): Promise<void> => {

    const index = resources.findIndex(resource => resource.id);

    if (index === -1) {
        throw new AppError(
            "Resource not found",
            "RESOURCE_NOT_FOUND",
            HTTP_STATUS.NOT_FOUND
        );
    }

    resources.splice(index, 1);
};